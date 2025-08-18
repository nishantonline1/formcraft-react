import React from 'react';
import { FormModel } from '../model';
import { FormConfig, ConfigField, FormValues, ValidationErrors, TouchedFields, FormValue } from '../types';
import { DependencyResolution, evaluateAllDependencies } from '../core';
import { useFormConfig, UseFormConfigOptions } from './useFormConfig';
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
  // Use the new useFormConfig hook internally
  const configOptions: UseFormConfigOptions = {
    initialValues: options?.initialValues,
    formId: options?.formId,
    enableAnalytics: options?.enableAnalytics,
    eventHooks: options?.eventHooks,
    flags: options?.flags,
    enableDependencies: true,
    enableValidation: true,
  };

  const configResult = useFormConfig(model, configOptions);

  // Get analytics handler for backward compatibility
  let analyticsHandler: ((eventName: string, payload: Record<string, unknown>) => void) | undefined;
  try {
    if (options?.enableAnalytics !== false) {
      analyticsHandler = useAnalytics();
    }
  } catch {
    // Analytics provider not available, continue without analytics
  }

  // Use the core evaluateAllDependencies for backward compatibility
  const compatDependencies = React.useMemo(() => {
    return evaluateAllDependencies(configResult.fields, configResult.values);
  }, [configResult.fields, configResult.values]);

  // Map the useFormConfig return to match the exact useForm interface
  const getEffectiveFieldCompat = (path: string): ConfigField | undefined => {
    try {
      return configResult.getEffectiveField(path);
    } catch {
      // Return undefined if field doesn't exist (backward compatibility)
      return undefined;
    }
  };

  // Wrap triggerValidation to match the old signature (requires fieldsToValidate parameter)
  const triggerValidationCompat = async (fieldsToValidate: string[]): Promise<boolean> => {
    return configResult.triggerValidation(fieldsToValidate);
  };

  return {
    config: configResult.config,
    values: configResult.values,
    errors: configResult.errors,
    touched: configResult.touched,
    dependencies: compatDependencies,
    dynamicOptions: configResult.dynamicOptions,
    isFieldVisible: configResult.isFieldVisible,
    isFieldDisabled: configResult.isFieldDisabled,
    getEffectiveField: getEffectiveFieldCompat,
    handleChange: configResult.handleChange,
    handleBlur: configResult.handleBlur,
    handleFocus: configResult.handleFocus,
    addArrayItem: configResult.addArrayItem,
    removeArrayItem: configResult.removeArrayItem,
    handleSubmit: configResult.handleSubmit,
    triggerValidation: triggerValidationCompat,
    trackEvent: analyticsHandler,
    onInit: options?.eventHooks?.onInit,
    onFieldChange: options?.eventHooks?.onFieldChange,
    onFieldBlur: options?.eventHooks?.onFieldBlur,
    onFormSubmit: options?.eventHooks?.onFormSubmit,
  };
}
