import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { FormModel } from '../model';
import { FormConfig, ConfigField, FormValues, ValidationErrors, TouchedFields, FormValue } from '../types';
import { buildFormConfig } from '../config';
import { validateField } from '../utils/validation';
import { evaluateAllDependencies, DependencyResolution } from '../utils/dependencies';
import { trackEvent } from '../events/eventBus';
import { useAnalytics } from '../providers';

export interface UseFormReturn {
  config: FormConfig;
  values: FormValues;
  errors: ValidationErrors;
  touched: TouchedFields;
  dependencies: Map<string, DependencyResolution>;
  dynamicOptions: Map<string, { value: unknown; label: string }[]>;
  isFieldVisible(path: string): boolean;
  isFieldDisabled(path: string): boolean;
  getEffectiveField(path: string): ConfigField | undefined;
  handleChange(path: string, value: FormValue): void;
  handleBlur(path: string): void;
  handleFocus(path: string): void;
  addArrayItem(path: string): void;
  removeArrayItem(path: string, index: number): void;
  handleSubmit(onSubmit: (values: FormValues) => Promise<unknown>): (e?: React.SyntheticEvent) => Promise<void>;
  // Direct event methods as specified in README
  trackEvent?: (eventName: string, payload: Record<string, unknown>) => void;
  onInit?: (field: ConfigField) => void;
  onFieldChange?: (path: string, value: FormValue) => void;
  onFieldBlur?: (path: string) => void;
  onFormSubmit?: (values: FormValues) => void;
  triggerValidation(fieldsToValidate: string[]): Promise<boolean>;
}

export interface EventHooks {
  onInit?: (field: ConfigField) => void;
  onFieldChange?: (path: string, value: FormValue) => void;
  onFieldBlur?: (path: string) => void;
  onFormSubmit?: (values: FormValues) => void;
}

export function useForm(
  model: FormModel,
  options?: {
    initialValues?: FormValues;
    formId?: string;
    enableAnalytics?: boolean;
    eventHooks?: EventHooks;
    flags?: Record<string, boolean>;
  }
): UseFormReturn {
  // 1. Build the form configuration internally and memoize it.
  const config = useMemo(
    () => buildFormConfig(model, options?.flags),
    [model, options?.flags]
  );

  // Initialize values
  const init = options?.initialValues || {};
  const [values, setValues] = useState<FormValues>(
    config.fields.reduce((acc, f) => {
      acc[f.path] = init[f.path] ?? '';
      return acc;
    }, {} as FormValues)
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [dynamicOptions, setDynamicOptions] = useState<Map<string, { value: unknown; label: string }[]>>(new Map());

  // Get analytics handler (optional)
  let analyticsHandler: ((eventName: string, data: Record<string, unknown>) => void) | undefined;
  try {
    if (options?.enableAnalytics !== false) {
      analyticsHandler = useAnalytics();
    }
  } catch {
    // Analytics provider not available, continue without analytics
  }

  // Evaluate dependencies whenever values change
  const dependencies = useMemo(() => 
    evaluateAllDependencies(config.fields, values), 
    [config.fields, values]
  );

  // Track previous dependency states to only emit events for changes
  const prevDependenciesRef = useRef<Map<string, DependencyResolution>>(new Map());

  // Helper functions for dependency resolution
  const isFieldVisible = useCallback((path: string): boolean => {
    const resolution = dependencies.get(path);
    return resolution?.isVisible ?? true;
  }, [dependencies]);

  const isFieldDisabled = useCallback((path: string): boolean => {
    const resolution = dependencies.get(path);
    return resolution?.isDisabled ?? false;
  }, [dependencies]);

  const getEffectiveField = useCallback((path: string): ConfigField | undefined => {
    const field = config.lookup[path];
    if (!field) return undefined;
    
    const resolution = dependencies.get(path);
    if (!resolution) return field;

    return {
      ...field,
      ...resolution.overrides,
      hidden: !resolution.isVisible,
      disabled: resolution.isDisabled,
    };
  }, [config.lookup, dependencies]);

  // Validate one field, update errors state, emit events
  const runValidation = useCallback((field: ConfigField, val: FormValue) => {
    const fieldErrors = validateField(field, val);
    setErrors(prev => ({ ...prev, [field.path]: fieldErrors }));
    
    // Emit validation event
    trackEvent('form:validation', {
      fieldPath: field.path,
      fieldKey: field.key,
      value: val,
      errors: fieldErrors,
      isValid: fieldErrors.length === 0,
    }, analyticsHandler);

    return fieldErrors;
  }, [analyticsHandler]);

  const handleChange = useCallback((path: string, value: FormValue) => {
    const field = config.lookup[path];
    if (!field) return;

    const oldValue = values[path];
    
    setValues(v => ({ ...v, [path]: value }));
    
    // Run validation
    runValidation(field, value);
    
    // Emit field change event
    trackEvent('field:change', {
      fieldPath: path,
      fieldKey: field.key,
      oldValue,
      newValue: value,
      formValues: { ...values, [path]: value },
    }, analyticsHandler);
    
    // Call event hook if provided
    options?.eventHooks?.onFieldChange?.(path, value);
  }, [config.lookup, runValidation, values, analyticsHandler]);

  const handleBlur = useCallback((path: string) => {
    const field = config.lookup[path];
    if (!field) return;

    setTouched(t => ({ ...t, [path]: true }));
    
    // Emit field blur event
    trackEvent('field:blur', {
      fieldPath: path,
      fieldKey: field.key,
      value: values[path],
      formValues: values,
    }, analyticsHandler);
    
    // Call event hook if provided
    options?.eventHooks?.onFieldBlur?.(path);
  }, [config.lookup, values, analyticsHandler]);

  const handleFocus = useCallback((path: string) => {
    const field = config.lookup[path];
    if (!field) return;
    
    // Emit field focus event
    trackEvent('field:focus', {
      fieldPath: path,
      fieldKey: field.key,
      value: values[path],
      formValues: values,
    }, analyticsHandler);
  }, [config.lookup, values, analyticsHandler]);

  const addArrayItem = useCallback((path: string) => {
    setValues(v => {
      const currentValue = v[path];
      const arr = Array.isArray(currentValue) ? [...(currentValue as unknown[])] : [];
      return { ...v, [path]: [...arr, {}] };
    });
  }, []);

  const removeArrayItem = useCallback((path: string, index: number) => {
    setValues(v => {
      const currentValue = v[path];
      const arr = Array.isArray(currentValue) ? [...(currentValue as unknown[])] : [];
      arr.splice(index, 1);
      return { ...v, [path]: arr };
    });
    setErrors(e => {
      const copy = { ...e };
      delete copy[`${path}[${index}]`];
      return copy;
    });
  }, []);

  const triggerValidation = useCallback(async (fieldsToValidate: string[]): Promise<boolean> => {
    const validationPromises = fieldsToValidate.map(path => {
      const field = config.lookup[path];
      if (field) {
        return validateField(field, values[path]);
      }
      return [];
    });
    
    const results = await Promise.all(validationPromises);
    const newErrors: ValidationErrors = {};
    let allValid = true;

    fieldsToValidate.forEach((path, index) => {
      if (results[index].length > 0) {
        newErrors[path] = results[index];
        allValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return allValid;
  }, [config.lookup, values]);

  const handleSubmit = useCallback(
    (onSubmit: (values: FormValues) => Promise<unknown>) =>
      async (e?: React.SyntheticEvent) => {
        e?.preventDefault();
        
        // Run validation for all visible fields using effective field configuration
        const allErrors: ValidationErrors = {};
        config.fields.forEach(field => {
          if (isFieldVisible(field.path)) {
            const effectiveField = getEffectiveField(field.path) || field;
            const errs = validateField(effectiveField, values[field.path]);
            if (errs.length) {
              allErrors[field.path] = errs;
            }
          }
        });
        setErrors(allErrors);

        const isValid = Object.keys(allErrors).length === 0;
        
        // Emit form submit event
        trackEvent('form:submit', {
          formId: options?.formId,
          values,
          isValid,
          errors: isValid ? undefined : allErrors,
        }, analyticsHandler);

        // If any errors, abort
        if (!isValid) {
          return;
        }
        
        // Call the actual submit handler
        try {
          await onSubmit(values);
          options?.eventHooks?.onFormSubmit?.(values);
        } catch (err) {
          console.error('Submission handler failed', err);
        }
      },
    [config, values, options?.formId, analyticsHandler, getEffectiveField, isFieldVisible, options?.eventHooks]
  );

  // Emit form init event on mount
  useEffect(() => {
    trackEvent('form:init', {
      formId: options?.formId,
      initialValues: values,
      fieldCount: config.fields.length,
    }, analyticsHandler);
    
    // Call init event hook for each field
    config.fields.forEach(field => {
      options?.eventHooks?.onInit?.(field);
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
          fieldPath: resolution.field.path,
          fieldKey: resolution.field.key,
          isVisible: resolution.isVisible,
          isDisabled: resolution.isDisabled,
          dependsOn: resolution.dependsOn,
        }, analyticsHandler);
      }
    });
    
    // Update the previous dependencies reference
    prevDependenciesRef.current = new Map(dependencies);
  }, [dependencies, analyticsHandler]);

  // Load dynamic options when trigger values change
  useEffect(() => {
    const loadDynamicOptions = async () => {
      const allFields = config.fields;
      const fieldsWithDynamicOptions = allFields.filter(f => f.dynamicOptions);

      const triggerMap: Record<string, string[]> = fieldsWithDynamicOptions.reduce((acc: Record<string, string[]>, field) => {
        field.dynamicOptions!.trigger.forEach(key => {
          if (!acc[key]) acc[key] = [];
          acc[key].push(field.path);
        });
        return acc;
      }, {});
      
      const changedKeys = Object.keys(values).filter(key => values[key] !== (options?.initialValues || {})[key]);
      const fieldsToUpdate = new Set<string>();
      
      changedKeys.forEach(key => {
        if (triggerMap[key]) {
          triggerMap[key].forEach(path => fieldsToUpdate.add(path));
        }
      });
      
      if (fieldsToUpdate.size > 0) {
        fieldsToUpdate.forEach(async path => {
          const field = config.lookup[path];
          if (field?.dynamicOptions) {
            const newOpts = await field.dynamicOptions.loader(values);
            setDynamicOptions(prev => new Map(prev).set(path, newOpts));
          }
        });
      }
    };

    loadDynamicOptions();
  }, [values, config, options?.initialValues, analyticsHandler]);

  return {
    config,
    values,
    errors,
    touched,
    dependencies,
    dynamicOptions,
    isFieldVisible,
    isFieldDisabled,
    getEffectiveField,
    handleChange,
    handleBlur,
    handleFocus,
    addArrayItem,
    removeArrayItem,
    handleSubmit,
    triggerValidation,
    trackEvent: analyticsHandler,
    onInit: options?.eventHooks?.onInit,
    onFieldChange: options?.eventHooks?.onFieldChange,
    onFieldBlur: options?.eventHooks?.onFieldBlur,
    onFormSubmit: options?.eventHooks?.onFormSubmit,
  };
}
