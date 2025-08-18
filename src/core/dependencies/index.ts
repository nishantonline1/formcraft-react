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

export type { DependencyResolution } from '../types';