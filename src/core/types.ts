import { FieldProps } from '../model';
import { FormValue, FormValues, ValidationErrors, ConfigField } from '../types';
import { FormConfig as BaseFormConfig } from '../types';

/**
 * Options for creating form configuration
 */
export interface FormConfigOptions {
  flags?: Record<string, boolean>;
  initialValues?: FormValues;
  enableDependencies?: boolean;
  enableValidation?: boolean;
}

/**
 * Enhanced form configuration with metadata and computed properties
 */
export interface EnhancedFormConfig extends BaseFormConfig {
  metadata: {
    fieldCount: number;
    hasArrayFields: boolean;
    hasDependencies: boolean;
    hasValidation: boolean;
    requiredFields: string[];
    optionalFields: string[];
  };
  computed: {
    dependencyGraph: Map<string, string[]>;
    validationRules: Map<string, ValidationRule[]>;
    defaultValues: FormValues;
  };
}

/**
 * Validation rule interface
 */
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom' | 'minItems' | 'maxItems' | 'decimal_places';
  value?: unknown;
  message?: string;
  validator?: (value: unknown) => string[];
}

/**
 * Dependency resolution result
 */
export interface DependencyResolution {
  field: string;
  dependsOn: string[];
  isVisible: boolean;
  isDisabled: boolean;
  overrides: Partial<FieldProps>;
}

/**
 * Result of form configuration creation
 */
export interface FormConfigResult {
  config: EnhancedFormConfig;
  fields: ConfigField[];
  lookup: Record<string, ConfigField>;
  dependencies: Map<string, DependencyResolution>;
  validation: {
    validateField: (path: string, value: FormValue) => string[];
    validateAll: (values: FormValues) => ValidationErrors;
  };
  state: {
    getFieldVisibility: (path: string, values: FormValues) => boolean;
    getFieldDisabled: (path: string, values: FormValues) => boolean;
    getEffectiveField: (path: string, values: FormValues) => ConfigField;
  };
}