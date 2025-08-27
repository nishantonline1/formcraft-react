import { v4 as uuidv4 } from 'uuid';
import { FormModel } from '../../model';
import { ConfigField, FormValues, FormValue, ValidationErrors, FormConfig } from '../../types';
import { FormConfigOptions, FormConfigResult, EnhancedFormConfig, ValidationRule, DependencyResolution } from '../types';
import {
  validateField as coreValidateField,
  extractValidationRules,
  createFormValidator,
} from '../validation';
import {
  createFieldStateQueries,
} from '../dependencies';

// Import plugins directly - if this causes issues in test environments,
// we can handle it at the build/test configuration level
import { applyConfigExtensions } from '../../plugins';

/**
 * Creates a comprehensive form configuration from a form model
 */
export function createFormConfig(
  model: FormModel,
  options: FormConfigOptions = {},
): FormConfigResult {
  const {
    flags = {},
    initialValues = {},
    enableDependencies = true,
    enableValidation = true,
  } = options;

  const fields: ConfigField[] = [];
  const lookup: Record<string, ConfigField> = {};
  const dependencyGraph = new Map<string, string[]>();
  const validationRules = new Map<string, ValidationRule[]>();
  const dependencies = new Map<string, DependencyResolution>();
  const defaultValues: FormValues = { ...initialValues };

  // Traverse the model and build configuration
  function traverse(items: FormModel, parentPath = '') {
    items.forEach((field, _index) => {
      // Skip by flag
      if (field.flags) {
        const flagKeys = Object.keys(field.flags);
        if (flagKeys.some(k => !flags[k])) return;
      }

      const path = parentPath ? `${parentPath}.${field.key}` : field.key;
      const id = uuidv4();

      const configField: ConfigField = {
        ...field,
        id,
        path,
        defaultValue: field.defaultValue as FormValue | undefined,
      };

      fields.push(configField);
      lookup[path] = configField;

      // Set default value if provided
      if (field.defaultValue !== undefined && field.defaultValue !== null) {
        defaultValues[path] = field.defaultValue as FormValue;
      }

      // Process dependencies
      if (enableDependencies && field.dependencies) {
        const dependsOn: string[] = [];

        field.dependencies.forEach(dep => {
          const depPath = parentPath ? `${parentPath}.${dep.field}` : dep.field;
          dependsOn.push(depPath);

          // Add to dependency graph
          if (!dependencyGraph.has(depPath)) {
            dependencyGraph.set(depPath, []);
          }
          dependencyGraph.get(depPath)!.push(path);
        });

        dependencies.set(path, {
          field: path,
          dependsOn,
          isVisible: !field.hidden,
          isDisabled: !!field.disabled,
          overrides: {},
        });
      }

      // Process validation rules using core utility
      if (enableValidation && field.validators) {
        const rules = extractValidationRules(configField);
        if (rules.length > 0) {
          validationRules.set(path, rules);
        }
      }

      // Handle array items
      if (field.type === 'array' && field.itemModel) {
        traverse(field.itemModel, `${path}[0]`);
      }
    });
  }

  traverse(model);

  // Build metadata
  const requiredFields = Array.from(validationRules.entries())
    .filter(([_, rules]) => rules.some(rule => rule.type === 'required'))
    .map(([path, _]) => path);

  const optionalFields = fields
    .map(field => field.path)
    .filter(path => !requiredFields.includes(path));

  const metadata = {
    fieldCount: fields.length,
    hasArrayFields: fields.some(field => field.type === 'array'),
    hasDependencies: dependencies.size > 0,
    hasValidation: validationRules.size > 0,
    requiredFields,
    optionalFields,
  };

  // Create base config
  const baseConfig: EnhancedFormConfig = {
    fields,
    lookup,
    metadata,
    computed: {
      dependencyGraph,
      validationRules,
      defaultValues,
    },
  };

  // Apply plugin extensions to the base part and then reconstruct
  const baseFormConfig: FormConfig = { fields: baseConfig.fields, lookup: baseConfig.lookup };
  const extendedBase = applyConfigExtensions(model, baseFormConfig);
  const config: EnhancedFormConfig = {
    ...baseConfig,
    fields: extendedBase.fields,
    lookup: extendedBase.lookup,
  };

  // Create validation functions using core utilities
  const validateField = (path: string, value: FormValue): string[] => {
    if (!enableValidation) return [];
    const field = config.lookup[path];
    if (!field) return [];
    return coreValidateField(field, value);
  };

  const validateAll = enableValidation
    ? createFormValidator(config.fields)
    : (): ValidationErrors => ({});

  // Create state management functions using core utilities
  const stateQueries = createFieldStateQueries(config.fields);

  return {
    config,
    fields: config.fields,
    lookup: config.lookup,
    dependencies,
    validation: {
      validateField,
      validateAll,
    },
    state: {
      getFieldVisibility: stateQueries.getFieldVisibility,
      getFieldDisabled: stateQueries.getFieldDisabled,
      getEffectiveField: (path: string, values: FormValues): ConfigField => {
        const field = stateQueries.getEffectiveField(path, values);
        if (!field) throw new Error(`Field not found: ${path}`);
        return field;
      },
    },
  };
}