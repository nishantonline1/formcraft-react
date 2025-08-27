// Core configuration exports (always included)
export { createFormConfig, buildFormConfig } from './core';
export { useFormConfig } from './hooks';
export type {
  UseFormConfigReturn,
  UseFormConfigOptions,
  EventHooks,
  OptionItem,
  SubmitHandler,
  SubmitFunction,
} from './hooks';

export type {
  FormConfigResult,
  FormConfigOptions,
} from './core';

// Core functionality exports
export {
  validateField,
  validateAllFields,
  validateSpecificFields,
  extractValidationRules,
  createFieldValidator,
  createFormValidator,
  isFormValid,
  getAllErrorMessages,
  mergeValidationErrors,
  evaluateFieldDependencies,
  evaluateAllDependencies,
  isFieldVisible,
  isFieldDisabled,
  getEffectiveFieldProps,
  buildDependencyGraph,
  getDependentFields,
  detectCircularDependencies,
  createDependencyResolver,
  createFieldStateQueries,
} from './core';

export type {
  EnhancedFormConfig,
  ValidationRule,
  DependencyResolution,
} from './core';

// Model and type exports
export * from './model';
export * from './types';

// Backward compatibility (wraps core functionality)
export { useForm, useSections, extractSectionsFromModel } from './hooks';
export type { 
  UseFormReturn,
  UseSectionsReturn,
  SectionOptions
} from './hooks';

// Plugin system
export * from './plugins';

// Event system
export * from './events';

// Performance utilities
export * from './performance';

// UI components
export * from './ui';
export { FormRenderer } from './ui/FormRenderer';
export type { FieldRenderer, FieldRendererProps, FormRendererProps } from './ui/FormRenderer';

// Provider components  
export * from './providers';
