import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { FormModel } from '../model';
import { FormValues, ValidationErrors, TouchedFields, FormValue, ConfigField } from '../types';
import { createFormConfig } from '../core/config';
import { FormConfigOptions, FormConfigResult } from '../core/types';
import { evaluateAllDependencies } from '../core';
import { trackEvent } from '../events/eventBus';
import { validateField as coreValidateField } from '../core';

// Type definitions for the hook
export type OptionItem = { value: unknown; label: string };
export type SubmitHandler = (values: FormValues) => Promise<unknown>;
export type SubmitFunction = (e?: React.SyntheticEvent) => Promise<void>;

export interface EventHooks {
  onInit?: (field: ConfigField) => void;
  onFieldChange?: (path: string, value: FormValue) => void;
  onFieldBlur?: (path: string) => void;
  onFormSubmit?: (values: FormValues) => void;
}

export interface UseFormConfigOptions extends FormConfigOptions {
  formId?: string;
  enableAnalytics?: boolean;
  eventHooks?: EventHooks;
}

export interface UseFormConfigReturn extends FormConfigResult {
  values: FormValues;
  errors: ValidationErrors;
  touched: TouchedFields;
  dynamicOptions: Map<string, OptionItem[]>;

  // State management
  setValue: (path: string, value: FormValue) => void;
  setTouched: (path: string, touched?: boolean) => void;
  setError: (path: string, errors: string[]) => void;

  // Computed properties
  isFieldVisible: (path: string) => boolean;
  isFieldDisabled: (path: string) => boolean;
  getEffectiveField: (path: string) => ConfigField;

  // Actions
  handleChange: (path: string, value: FormValue) => void;
  handleBlur: (path: string) => void;
  handleFocus: (path: string) => void;
  handleSubmit: (onSubmit: SubmitHandler) => SubmitFunction;

  // Array operations
  addArrayItem: (path: string) => void;
  removeArrayItem: (path: string, index: number) => void;

  // Validation
  triggerValidation: (fields?: string[]) => Promise<boolean>;

  // Utilities
  reset: (values?: FormValues) => void;
  isDirty: boolean;
  isValid: boolean;
}

/**
 * Lightweight React hook that wraps createFormConfig and provides state management
 */
export function useFormConfig(
  model: FormModel,
  options: UseFormConfigOptions = {},
): UseFormConfigReturn {
  // Create the form configuration using the core function
  const configResult = useMemo(
    () => createFormConfig(model, options),
    [model, options.flags, options.enableDependencies, options.enableValidation]
  );

  // Initialize state with default values from config
  const initialValues = useMemo(() => {
    const baseValues: FormValues = {};
    
    // Initialize all fields with empty strings (for backward compatibility)
    configResult.fields.forEach(field => {
      baseValues[field.path] = '';
    });
    
    // Apply default values from config
    Object.assign(baseValues, configResult.config.computed.defaultValues);
    
    // Apply provided initial values
    Object.assign(baseValues, options.initialValues);
    
    return baseValues;
  }, [configResult.fields, configResult.config.computed.defaultValues, options.initialValues]);

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [dynamicOptions, setDynamicOptions] = useState<Map<string, OptionItem[]>>(new Map());

  // Track initial values for dirty state calculation
  const initialValuesRef = useRef(initialValues);

  // Get analytics handler (optional, avoid dependency issues)
  let analyticsHandler: ((eventName: string, data: Record<string, unknown>) => void) | undefined;
  try {
    if (options.enableAnalytics !== false) {
      // Try to get analytics handler, but don't fail if not available
      // We'll handle this in the consuming hook (useForm) to avoid circular dependencies
      analyticsHandler = undefined;
    }
  } catch {
    // Analytics provider not available, continue without analytics
  }

  // Evaluate dependencies whenever values change
  const dependencies = useMemo(() => 
    evaluateAllDependencies(configResult.fields, values), 
    [configResult.fields, values]
  );

  // Track previous dependency states to only emit events for changes
  const prevDependenciesRef = useRef(dependencies);

  // Computed properties
  const isFieldVisible = useCallback((path: string): boolean => {
    return configResult.state.getFieldVisibility(path, values);
  }, [configResult.state, values]);

  const isFieldDisabled = useCallback((path: string): boolean => {
    return configResult.state.getFieldDisabled(path, values);
  }, [configResult.state, values]);

  const getEffectiveField = useCallback((path: string): ConfigField => {
    return configResult.state.getEffectiveField(path, values);
  }, [configResult.state, values]);

  // Calculate dirty and valid states
  const isDirty = useMemo(() => {
    return Object.keys(values).some(key => 
      values[key] !== initialValuesRef.current[key]
    );
  }, [values]);

  const isValid = useMemo(() => {
    return Object.values(errors).every(fieldErrors => fieldErrors.length === 0);
  }, [errors]);

  // State management functions
  const setValue = useCallback((path: string, value: FormValue) => {
    setValues(prev => ({ ...prev, [path]: value }));
  }, []);

  const setTouchedField = useCallback((path: string, touchedValue: boolean = true) => {
    setTouched(prev => ({ ...prev, [path]: touchedValue }));
  }, []);

  const setError = useCallback((path: string, fieldErrors: string[]) => {
    setErrors(prev => ({ ...prev, [path]: fieldErrors }));
  }, []);

  // Action handlers
  const handleChange = useCallback((path: string, value: FormValue) => {
    const field = configResult.lookup[path];
    if (!field) return;

    const oldValue = values[path];
    
    // Update value
    setValue(path, value);
    
    // Run validation
    const fieldErrors = configResult.validation.validateField(path, value);
    setError(path, fieldErrors);
    
    // Emit field change event
    trackEvent('field:change', {
      fieldPath: path,
      fieldKey: field.key,
      oldValue,
      newValue: value,
      formValues: { ...values, [path]: value },
    }, analyticsHandler);
    
    // Call event hook if provided
    options.eventHooks?.onFieldChange?.(path, value);
  }, [configResult.lookup, configResult.validation, values, setValue, setError, analyticsHandler, options.eventHooks]);

  const handleBlur = useCallback((path: string) => {
    const field = configResult.lookup[path];
    if (!field) return;

    setTouchedField(path, true);
    
    // Emit field blur event
    trackEvent('field:blur', {
      fieldPath: path,
      fieldKey: field.key,
      value: values[path],
      formValues: values,
    }, analyticsHandler);
    
    // Call event hook if provided
    options.eventHooks?.onFieldBlur?.(path);
  }, [configResult.lookup, values, setTouchedField, analyticsHandler, options.eventHooks]);

  const handleFocus = useCallback((path: string) => {
    const field = configResult.lookup[path];
    if (!field) return;
    
    // Emit field focus event
    trackEvent('field:focus', {
      fieldPath: path,
      fieldKey: field.key,
      value: values[path],
      formValues: values,
    }, analyticsHandler);
  }, [configResult.lookup, values, analyticsHandler]);

  // Array operations
  const addArrayItem = useCallback((path: string) => {
    setValues(prev => {
      const currentValue = prev[path];
      const arr = Array.isArray(currentValue) ? [...(currentValue as unknown[])] : [];
      return { ...prev, [path]: [...arr, {}] };
    });
  }, []);

  const removeArrayItem = useCallback((path: string, index: number) => {
    setValues(prev => {
      const currentValue = prev[path];
      const arr = Array.isArray(currentValue) ? [...(currentValue as unknown[])] : [];
      arr.splice(index, 1);
      return { ...prev, [path]: arr };
    });
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[`${path}[${index}]`];
      return copy;
    });
  }, []);

  // Validation
  const triggerValidation = useCallback(async (fields?: string[]): Promise<boolean> => {
    const fieldsToValidate = fields || configResult.fields.map(f => f.path);
    
    const newErrors: ValidationErrors = {};
    let allValid = true;

    fieldsToValidate.forEach(path => {
      const fieldErrors = configResult.validation.validateField(path, values[path]);
      if (fieldErrors.length > 0) {
        newErrors[path] = fieldErrors;
        allValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return allValid;
  }, [configResult.fields, configResult.validation, values]);

  // Submit handler
  const handleSubmit = useCallback(
    (onSubmit: SubmitHandler): SubmitFunction =>
      async (e?: React.SyntheticEvent) => {
        e?.preventDefault();
        
        // Run validation for all visible fields using effective field configuration
        const allErrors: ValidationErrors = {};
        configResult.fields.forEach(field => {
          if (isFieldVisible(field.path)) {
            const effectiveField = getEffectiveField(field.path);
            // Use the core validateField with the effective field to handle dependency overrides
            const fieldErrors = coreValidateField(effectiveField, values[field.path]);
            if (fieldErrors.length > 0) {
              allErrors[field.path] = fieldErrors;
            }
          }
        });
        setErrors(allErrors);

        const isFormValid = Object.keys(allErrors).length === 0;
        
        // Emit form submit event
        trackEvent('form:submit', {
          formId: options.formId,
          values,
          isValid: isFormValid,
          errors: isFormValid ? undefined : allErrors,
        }, analyticsHandler);

        // If any errors, abort
        if (!isFormValid) {
          return;
        }
        
        // Call the actual submit handler
        try {
          await onSubmit(values);
          options.eventHooks?.onFormSubmit?.(values);
        } catch (err) {
          console.error('Submission handler failed', err);
        }
      },
    [configResult.fields, values, isFieldVisible, getEffectiveField, options.formId, options.eventHooks, analyticsHandler]
  );

  // Reset utility
  const reset = useCallback((newValues?: FormValues) => {
    const resetValues = newValues || initialValues;
    setValues(resetValues);
    setErrors({});
    setTouched({});
    initialValuesRef.current = resetValues;
  }, [initialValues]);

  // Emit form init event on mount
  useEffect(() => {
    trackEvent('form:init', {
      formId: options.formId,
      initialValues: values,
      fieldCount: configResult.fields.length,
    }, analyticsHandler);
    
    // Call init event hook for each field
    configResult.fields.forEach(field => {
      options.eventHooks?.onInit?.(field);
    });
  }, []); // Only emit once on mount

  // Emit dependency resolution events when dependencies change
  useEffect(() => {
    const prevDeps = prevDependenciesRef.current;
    
    dependencies.forEach((resolution, path) => {
      const prevResolution = prevDeps.get(path);
      
      // Only emit event if this is a new dependency or if the resolution changed
      if (!prevResolution || 
          prevResolution.isVisible !== resolution.isVisible ||
          prevResolution.isDisabled !== resolution.isDisabled) {
        
        trackEvent('dependency:resolved', {
          fieldPath: resolution.field,
          fieldKey: configResult.lookup[resolution.field]?.key || resolution.field,
          isVisible: resolution.isVisible,
          isDisabled: resolution.isDisabled,
          dependsOn: resolution.dependsOn,
        }, analyticsHandler);
      }
    });
    
    // Update the previous dependencies reference
    prevDependenciesRef.current = dependencies;
  }, [dependencies, configResult.lookup, analyticsHandler]);

  // Load dynamic options when trigger values change
  useEffect(() => {
    const loadDynamicOptions = async () => {
      const fieldsWithDynamicOptions = configResult.fields.filter(f => f.dynamicOptions);

      const triggerMap: Record<string, string[]> = fieldsWithDynamicOptions.reduce((acc: Record<string, string[]>, field) => {
        field.dynamicOptions!.trigger.forEach(key => {
          if (!acc[key]) acc[key] = [];
          acc[key].push(field.path);
        });
        return acc;
      }, {});
      
      const changedKeys = Object.keys(values).filter(key => values[key] !== initialValues[key]);
      const fieldsToUpdate = new Set<string>();
      
      changedKeys.forEach(key => {
        if (triggerMap[key]) {
          triggerMap[key].forEach(path => fieldsToUpdate.add(path));
        }
      });
      
      if (fieldsToUpdate.size > 0) {
        fieldsToUpdate.forEach(async path => {
          const field = configResult.lookup[path];
          if (field?.dynamicOptions) {
            const newOpts = await field.dynamicOptions.loader(values);
            setDynamicOptions(prev => new Map(prev).set(path, newOpts));
          }
        });
      }
    };

    loadDynamicOptions();
  }, [values, configResult.fields, configResult.lookup, initialValues]);

  return {
    // Core configuration result
    ...configResult,
    
    // State
    values,
    errors,
    touched,
    dynamicOptions,

    // State management
    setValue,
    setTouched: setTouchedField,
    setError,

    // Computed properties
    isFieldVisible,
    isFieldDisabled,
    getEffectiveField,

    // Actions
    handleChange,
    handleBlur,
    handleFocus,
    handleSubmit,

    // Array operations
    addArrayItem,
    removeArrayItem,

    // Validation
    triggerValidation,

    // Utilities
    reset,
    isDirty,
    isValid,
  };
}