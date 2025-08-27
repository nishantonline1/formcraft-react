// Core configuration exports
export { createFormConfig, buildFormConfig } from './config';

// Core validation exports
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
} from './validation';

// Core dependency exports
export {
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
} from './dependencies';

// Core type exports
export type {
  FormConfigOptions,
  FormConfigResult,
  EnhancedFormConfig,
  ValidationRule,
  DependencyResolution,
} from './types';