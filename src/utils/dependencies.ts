import { ConfigField, FormValues } from '../types';
import { FieldProps } from '../model';

/**
 * Represents the result of dependency evaluation for a field
 */
export interface DependencyResolution {
  field: ConfigField;
  isVisible: boolean;
  isDisabled: boolean;
  overrides: Partial<FieldProps>;
  dependsOn: string[];
}

/**
 * Evaluates all dependencies for a given field based on current form values
 */
export function evaluateFieldDependencies(
  field: ConfigField,
  values: FormValues,
  allFields: ConfigField[]
): DependencyResolution {
  let isVisible = !field.hidden;
  let isDisabled = !!field.disabled;
  let overrides: Partial<FieldProps> = {};
  const dependsOn = field.dependencies?.map(d => d.field) || [];

  if (!field.dependencies || field.dependencies.length === 0) {
    return {
      field,
      isVisible,
      isDisabled,
      overrides,
      dependsOn,
    };
  }

  // Process each dependency
  for (const dependency of field.dependencies) {
    const dependentField = allFields.find(f => f.key === dependency.field);
    if (!dependentField) {
      console.warn(`Dependency field "${dependency.field}" not found for field "${field.key}"`);
      continue;
    }

    const dependentValue = values[dependentField.path];
    
    try {
      // Evaluate the condition
      const conditionMet = dependency.condition(dependentValue);
      
      if (conditionMet) {
        // Apply overrides
        const depOverrides = dependency.overrides;
        
        // Handle visibility
        if (depOverrides.hidden !== undefined) {
          isVisible = !depOverrides.hidden;
        }
        
        // Handle disabled state
        if (depOverrides.disabled !== undefined) {
          isDisabled = depOverrides.disabled;
        }
        
        // Collect other overrides
        overrides = { ...overrides, ...depOverrides };
      }
    } catch (error) {
      console.error(`Error evaluating dependency condition for field "${field.key}":`, error);
    }
  }

  return {
    field,
    isVisible,
    isDisabled,
    overrides,
    dependsOn,
  };
}

/**
 * Evaluates dependencies for all fields and returns a map of resolutions
 */
export function evaluateAllDependencies(
  fields: ConfigField[],
  values: FormValues
): Map<string, DependencyResolution> {
  const resolutions = new Map<string, DependencyResolution>();
  
  // Sort fields to ensure dependencies are evaluated in correct order
  const sortedFields = topologicalSort(fields);
  
  for (const field of sortedFields) {
    const resolution = evaluateFieldDependencies(field, values, fields);
    resolutions.set(field.path, resolution);
  }
  
  return resolutions;
}

/**
 * Sorts fields in topological order to ensure dependencies are evaluated correctly
 */
function topologicalSort(fields: ConfigField[]): ConfigField[] {
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const sorted: ConfigField[] = [];
  const fieldMap = new Map(fields.map(f => [f.key, f]));

  function visit(field: ConfigField) {
    if (visiting.has(field.key)) {
      // Circular dependency detected, log warning and continue
      console.warn(`Circular dependency detected involving field "${field.key}"`);
      return;
    }
    
    if (visited.has(field.key)) {
      return;
    }

    visiting.add(field.key);

    // Visit all dependencies first
    if (field.dependencies) {
      for (const dep of field.dependencies) {
        const depField = fieldMap.get(dep.field);
        if (depField) {
          visit(depField);
        }
      }
    }

    visiting.delete(field.key);
    visited.add(field.key);
    sorted.push(field);
  }

  for (const field of fields) {
    visit(field);
  }

  return sorted;
}

/**
 * Checks if a field should be visible based on its dependencies
 */
export function isFieldVisible(
  field: ConfigField,
  values: FormValues,
  allFields: ConfigField[]
): boolean {
  const resolution = evaluateFieldDependencies(field, values, allFields);
  return resolution.isVisible;
}

/**
 * Checks if a field should be disabled based on its dependencies
 */
export function isFieldDisabled(
  field: ConfigField,
  values: FormValues,
  allFields: ConfigField[]
): boolean {
  const resolution = evaluateFieldDependencies(field, values, allFields);
  return resolution.isDisabled;
}

/**
 * Gets the effective field properties after applying dependency overrides
 */
export function getEffectiveFieldProps(
  field: ConfigField,
  values: FormValues,
  allFields: ConfigField[]
): ConfigField {
  const resolution = evaluateFieldDependencies(field, values, allFields);
  
  return {
    ...field,
    ...resolution.overrides,
    hidden: !resolution.isVisible,
    disabled: resolution.isDisabled,
  };
} 