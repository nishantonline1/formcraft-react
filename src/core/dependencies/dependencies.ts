import { ConfigField, FormValues, FormValue } from '../../types';
import { FieldProps } from '../../model';
import { DependencyResolution } from '../types';

/**
 * Enhanced dependency resolution for core module
 * Works independently of React context
 */

/**
 * Evaluates all dependencies for a given field based on current form values
 * @param field - The field to evaluate dependencies for
 * @param values - Current form values
 * @param allFields - All fields in the form for dependency lookup
 * @returns Dependency resolution result
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
      field: field.path,
      isVisible,
      isDisabled,
      overrides,
      dependsOn,
    };
  }

  // Create field lookup for efficient access
  const fieldLookup = new Map(allFields.map(f => [f.key, f]));

  // Process each dependency
  for (const dependency of field.dependencies) {
    const dependentField = fieldLookup.get(dependency.field);
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
    field: field.path,
    isVisible,
    isDisabled,
    overrides,
    dependsOn,
  };
}

/**
 * Evaluates dependencies for all fields and returns a map of resolutions
 * @param fields - Array of all fields
 * @param values - Current form values
 * @returns Map of dependency resolutions keyed by field path
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
 * @param fields - Array of fields to sort
 * @returns Fields sorted in dependency order
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
 * @param field - The field to check
 * @param values - Current form values
 * @param allFields - All fields for dependency lookup
 * @returns True if field should be visible
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
 * @param field - The field to check
 * @param values - Current form values
 * @param allFields - All fields for dependency lookup
 * @returns True if field should be disabled
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
 * @param field - The field to get effective properties for
 * @param values - Current form values
 * @param allFields - All fields for dependency lookup
 * @returns Field with dependency overrides applied
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
    defaultValue: (resolution.overrides.defaultValue ?? field.defaultValue) as FormValue | undefined,
  };
}

/**
 * Builds a dependency graph showing which fields depend on which other fields
 * @param fields - Array of all fields
 * @returns Map of field paths to arrays of dependent field paths
 */
export function buildDependencyGraph(fields: ConfigField[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  
  // Initialize graph with all field paths
  for (const field of fields) {
    graph.set(field.path, []);
  }
  
  // Build dependency relationships
  for (const field of fields) {
    if (field.dependencies) {
      for (const dep of field.dependencies) {
        const dependentField = fields.find(f => f.key === dep.field);
        if (dependentField) {
          const dependents = graph.get(dependentField.path) || [];
          dependents.push(field.path);
          graph.set(dependentField.path, dependents);
        }
      }
    }
  }
  
  return graph;
}

/**
 * Gets all fields that depend on a specific field
 * @param targetFieldPath - Path of the field to check dependencies for
 * @param fields - Array of all fields
 * @returns Array of fields that depend on the target field
 */
export function getDependentFields(
  targetFieldPath: string,
  fields: ConfigField[]
): ConfigField[] {
  const dependentFields: ConfigField[] = [];
  const targetField = fields.find(f => f.path === targetFieldPath);
  
  if (!targetField) {
    return dependentFields;
  }
  
  for (const field of fields) {
    if (field.dependencies) {
      for (const dep of field.dependencies) {
        if (dep.field === targetField.key) {
          dependentFields.push(field);
          break;
        }
      }
    }
  }
  
  return dependentFields;
}

/**
 * Checks if there are circular dependencies in the field configuration
 * @param fields - Array of all fields
 * @returns Array of field paths involved in circular dependencies
 */
export function detectCircularDependencies(fields: ConfigField[]): string[] {
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const circularFields: string[] = [];
  const fieldMap = new Map(fields.map(f => [f.key, f]));

  function visit(field: ConfigField): boolean {
    if (visiting.has(field.key)) {
      circularFields.push(field.path);
      return true;
    }
    
    if (visited.has(field.key)) {
      return false;
    }

    visiting.add(field.key);

    if (field.dependencies) {
      for (const dep of field.dependencies) {
        const depField = fieldMap.get(dep.field);
        if (depField && visit(depField)) {
          circularFields.push(field.path);
        }
      }
    }

    visiting.delete(field.key);
    visited.add(field.key);
    return false;
  }

  for (const field of fields) {
    visit(field);
  }

  return [...new Set(circularFields)]; // Remove duplicates
}

/**
 * Creates a dependency resolver function for a specific set of fields
 * @param fields - Array of fields to create resolver for
 * @returns Function that resolves dependencies for given values
 */
export function createDependencyResolver(fields: ConfigField[]) {
  return (values: FormValues): Map<string, DependencyResolution> => {
    return evaluateAllDependencies(fields, values);
  };
}

/**
 * Creates field state functions for a specific set of fields
 * @param fields - Array of fields to create state functions for
 * @returns Object with state query functions
 */
export function createFieldStateQueries(fields: ConfigField[]) {
  return {
    getFieldVisibility: (path: string, values: FormValues): boolean => {
      const field = fields.find(f => f.path === path);
      return field ? isFieldVisible(field, values, fields) : false;
    },
    
    getFieldDisabled: (path: string, values: FormValues): boolean => {
      const field = fields.find(f => f.path === path);
      return field ? isFieldDisabled(field, values, fields) : false;
    },
    
    getEffectiveField: (path: string, values: FormValues): ConfigField | null => {
      const field = fields.find(f => f.path === path);
      return field ? getEffectiveFieldProps(field, values, fields) : null;
    }
  };
}