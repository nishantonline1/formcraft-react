import React from 'react';
import { FormPlugin } from './index';
import { ConfigField, DependencyRule } from '../types';

/**
 * Email validation plugin
 */
export const emailValidationPlugin: FormPlugin = {
  name: 'email-validation',
  onValidate: (field: ConfigField, value: unknown): string[] => {
    const errors: string[] = [];
    
    // Only validate if field has email meta flag
    if (field.meta?.validation === 'email' && typeof value === 'string' && value.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push(`${field.label} must be a valid email address.`);
      }
    }
    
    return errors;
  },
};

/**
 * Phone number validation plugin
 */
export const phoneValidationPlugin: FormPlugin = {
  name: 'phone-validation',
  onValidate: (field: ConfigField, value: unknown): string[] => {
    const errors: string[] = [];
    
    // Only validate if field has phone meta flag
    if (field.meta?.validation === 'phone' && typeof value === 'string' && value.length > 0) {
      // Simple US phone number validation
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!phoneRegex.test(value)) {
        errors.push(`${field.label} must be a valid phone number (e.g., 123-456-7890).`);
      }
    }
    
    return errors;
  },
};

/**
 * Field dependency plugin - shows/hides fields based on other field values
 */
export const fieldDependencyPlugin: FormPlugin = {
  name: 'field-dependency',
  extendConfig: (model, config) => {
    // Process dependencies and mark fields as hidden based on conditions
    const updatedFields = config.fields.map(field => {
      if (field.dependencies && field.dependencies.length > 0) {
        // For each dependency, check if the condition is met
        // This is a simplified implementation - in real usage, you'd need access to current form values
        return {
          ...field,
          // Add metadata to indicate this field has dependencies
          meta: {
            ...field.meta,
            hasDependencies: true,
            dependsOn: field.dependencies.map(dep => dep.field),
          },
        };
      }
      return field;
    });

    return {
      ...config,
      fields: updatedFields,
    };
  },
};

/**
 * Debug plugin - logs all form activities
 */
export const debugPlugin: FormPlugin = {
  name: 'debug',
  extendConfig: (model, config) => {
    console.log('🔧 Debug Plugin: Config extended', { model, config });
    return config;
  },
  onValidate: (field, value) => {
    console.log('🔧 Debug Plugin: Validation', { field: field.key, value });
    return [];
  },
  renderField: (field, form) => {
    // Add debug info to fields with debug meta flag
    if (field.meta?.debug) {
      return React.createElement('div', {
        key: `debug-${field.id}`,
        style: { border: '1px dashed #999', padding: '4px', margin: '2px' },
      }, [
        React.createElement('small', { key: 'debug-info' }, 
          `DEBUG: ${field.key} (${field.type}) = ${JSON.stringify(form.values[field.path])}`
        ),
      ]);
    }
    return null;
  },
};

/**
 * Auto-register all built-in plugins
 */
export const builtinPlugins = [
  emailValidationPlugin,
  phoneValidationPlugin,
  fieldDependencyPlugin,
  debugPlugin,
]; 