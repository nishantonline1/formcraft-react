import { FieldProps } from '../model';
import { FormValue, ConfigField } from '../types';
import { runPluginValidation } from '../plugins';

/**
 * Returns an array of error messages for a single field value.
 */
export function validateField(field: FieldProps | ConfigField, value: FormValue): string[] {
  const errs: string[] = [];

  if (field.validators) {
    const { required, min, max, pattern, custom, decimal_places} = field.validators;

    if (required && (value === '' || value == null)) {
      errs.push(`${field.label} is required.`);
    }
    if (typeof value === 'number') {
      if (min != null && value < min) {
        errs.push(`${field.label} must be ≥ ${min}.`);
      }
      if (max != null && value > max) {
        errs.push(`${field.label} must be ≤ ${max}.`);
      }
    }
    if (pattern && typeof value === 'string' && !pattern.test(value)) {
      errs.push(`${field.label} is invalid format.`);
    }
    if (custom && custom(value).length > 0) {
      errs.push(...custom(value));
    }
    if (decimal_places && typeof value === 'number' && value.toString().split('.')[1]?.length > decimal_places) {
      errs.push(`${field.label} must have at most ${decimal_places} decimal places.`);
    }
  }

  // Run plugin validation if this is a ConfigField
  if ('id' in field && 'path' in field) {
    const pluginErrors = runPluginValidation(field as ConfigField, value);
    errs.push(...pluginErrors);
  }

  return errs;
}
