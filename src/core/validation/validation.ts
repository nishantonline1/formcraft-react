import { FieldProps } from '../../model';
import { FormValue, ConfigField, FormValues, ValidationErrors } from '../../types';
import { ValidationRule } from '../types';

// Fallback function for plugin validation
const runPluginValidation = (_field: ConfigField, _value: FormValue): string[] => {
  // In a real implementation, this would run plugin validation
  // For now, just return empty array for backward compatibility
  return [];
};

/**
 * Enhanced validation interface for core module
 * Works independently of React context
 */

/**
 * Validates a single field value against its validation rules
 * @param field - The field configuration or props
 * @param value - The value to validate
 * @returns Array of error messages
 */
export function validateField(field: FieldProps | ConfigField, value: FormValue): string[] {
  const errors: string[] = [];

  if (!field.validators) {
    return errors;
  }

  const { required, min, max, pattern, custom, decimal_places, minItems, maxItems } = field.validators;

  // Required validation
  if (required && (value === '' || value == null || value === undefined)) {
    errors.push(`${field.label} is required.`);
    return errors; // Skip other validations if required field is empty
  }

  // Skip other validations if value is empty/null but not required
  if (value === '' || value == null || value === undefined) {
    return errors;
  }

  // Number validations
  if (typeof value === 'number') {
    if (min != null && value < min) {
      errors.push(`${field.label} must be ≥ ${min}.`);
    }
    if (max != null && value > max) {
      errors.push(`${field.label} must be ≤ ${max}.`);
    }
    if (decimal_places != null) {
      const decimalPart = value.toString().split('.')[1];
      if (decimalPart && decimalPart.length > decimal_places) {
        errors.push(`${field.label} must have at most ${decimal_places} decimal places.`);
      }
    }
  }

  // String validations
  if (typeof value === 'string') {
    if (pattern && !pattern.test(value)) {
      errors.push(`${field.label} has invalid format.`);
    }
    if (min != null && value.length < min) {
      errors.push(`${field.label} must be at least ${min} characters.`);
    }
    if (max != null && value.length > max) {
      errors.push(`${field.label} must be at most ${max} characters.`);
    }
  }

  // Array validations
  if (Array.isArray(value)) {
    if (minItems != null && value.length < minItems) {
      errors.push(`${field.label} must have at least ${minItems} items.`);
    }
    if (maxItems != null && value.length > maxItems) {
      errors.push(`${field.label} must have at most ${maxItems} items.`);
    }
  }

  // Custom validation
  if (custom) {
    try {
      const customErrors = custom(value);
      if (Array.isArray(customErrors)) {
        errors.push(...customErrors);
      }
    } catch (error) {
      console.error(`Custom validation error for field "${field.label}":`, error);
      errors.push(`${field.label} validation failed.`);
    }
  }

  // Plugin validation (only for ConfigField)
  if ('id' in field && 'path' in field) {
    try {
      const pluginErrors = runPluginValidation(field as ConfigField, value);
      errors.push(...pluginErrors);
    } catch (error) {
      console.error(`Plugin validation error for field "${field.label}":`, error);
    }
  }

  return errors;
}

/**
 * Validates all fields in a form configuration
 * @param fields - Array of field configurations
 * @param values - Current form values
 * @returns Validation errors object
 */
export function validateAllFields(fields: ConfigField[], values: FormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of fields) {
    const fieldValue = values[field.path];
    const fieldErrors = validateField(field, fieldValue);

    if (fieldErrors.length > 0) {
      errors[field.path] = fieldErrors;
    }
  }

  return errors;
}

/**
 * Validates specific fields by their paths
 * @param fields - Array of field configurations
 * @param values - Current form values
 * @param fieldPaths - Array of field paths to validate
 * @returns Validation errors object for specified fields
 */
export function validateSpecificFields(
  fields: ConfigField[],
  values: FormValues,
  fieldPaths: string[]
): ValidationErrors {
  const errors: ValidationErrors = {};
  const fieldLookup = new Map(fields.map(f => [f.path, f]));

  for (const path of fieldPaths) {
    const field = fieldLookup.get(path);
    if (field) {
      const fieldValue = values[path];
      const fieldErrors = validateField(field, fieldValue);

      if (fieldErrors.length > 0) {
        errors[path] = fieldErrors;
      }
    }
  }

  return errors;
}

/**
 * Extracts validation rules from field configuration
 * @param field - Field configuration
 * @returns Array of validation rules
 */
export function extractValidationRules(field: FieldProps | ConfigField): ValidationRule[] {
  const rules: ValidationRule[] = [];

  if (!field.validators) {
    return rules;
  }

  const { required, min, max, pattern, custom, decimal_places, minItems, maxItems } = field.validators;

  if (required) {
    rules.push({
      type: 'required',
      message: `${field.label} is required.`
    });
  }

  if (min != null) {
    rules.push({
      type: 'min',
      value: min,
      message: `${field.label} must be ≥ ${min}.`
    });
  }

  if (max != null) {
    rules.push({
      type: 'max',
      value: max,
      message: `${field.label} must be ≤ ${max}.`
    });
  }

  if (pattern) {
    rules.push({
      type: 'pattern',
      value: pattern,
      message: `${field.label} has invalid format.`
    });
  }

  if (decimal_places != null) {
    rules.push({
      type: 'decimal_places',
      value: decimal_places,
      message: `${field.label} must have at most ${decimal_places} decimal places.`
    });
  }

  if (minItems != null) {
    rules.push({
      type: 'minItems',
      value: minItems,
      message: `${field.label} must have at least ${minItems} items.`
    });
  }

  if (maxItems != null) {
    rules.push({
      type: 'maxItems',
      value: maxItems,
      message: `${field.label} must have at most ${maxItems} items.`
    });
  }

  if (custom) {
    rules.push({
      type: 'custom',
      validator: custom,
      message: `${field.label} validation failed.`
    });
  }

  return rules;
}

/**
 * Creates a validation function for a specific field
 * @param field - Field configuration
 * @returns Validation function
 */
export function createFieldValidator(field: FieldProps | ConfigField) {
  return (value: FormValue): string[] => {
    return validateField(field, value);
  };
}

/**
 * Creates a validation function for all fields
 * @param fields - Array of field configurations
 * @returns Validation function
 */
export function createFormValidator(fields: ConfigField[]) {
  return (values: FormValues): ValidationErrors => {
    return validateAllFields(fields, values);
  };
}

/**
 * Checks if a form has any validation errors
 * @param errors - Validation errors object
 * @returns True if form is valid (no errors)
 */
export function isFormValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}

/**
 * Gets all error messages from validation errors object
 * @param errors - Validation errors object
 * @returns Array of all error messages
 */
export function getAllErrorMessages(errors: ValidationErrors): string[] {
  const messages: string[] = [];

  for (const fieldErrors of Object.values(errors)) {
    messages.push(...fieldErrors);
  }

  return messages;
}

/**
 * Merges multiple validation error objects
 * @param errorObjects - Array of validation error objects
 * @returns Merged validation errors object
 */
export function mergeValidationErrors(...errorObjects: ValidationErrors[]): ValidationErrors {
  const merged: ValidationErrors = {};

  for (const errors of errorObjects) {
    for (const [path, fieldErrors] of Object.entries(errors)) {
      if (merged[path]) {
        merged[path] = [...merged[path], ...fieldErrors];
      } else {
        merged[path] = [...fieldErrors];
      }
    }
  }

  return merged;
}