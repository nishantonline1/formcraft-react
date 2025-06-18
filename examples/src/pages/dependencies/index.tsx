import { DependenciesFormComponent } from './components';

/**
 * Wrapper for the Field Dependencies Example.
 *
 * This component showcases how to use the internal dependency engine
 * of the form-builder library to dynamically show and hide fields based
 * on user input. It has been refactored to be more efficient and robust.
 *
 * Key features demonstrated:
 * - Conditional visibility of form fields.
 * - Centralized dependency logic within the form model.
 * - No more manual form config rebuilding on state changes.
 * - Real-time dashboard showing dependency state.
 */
export const DependenciesWrapper = DependenciesFormComponent;

// Re-export components for potential individual use
export { 
  DependenciesFormComponent,
  DependenciesInfoPanel as DependenciesStatusDashboard
} from './components';

// Re-export hooks for potential reuse
export {
  useDependenciesForm
} from './hooks';

// Re-export model for potential customization
export {
  allFieldsModel,
  initialDependenciesValues,
  getVisibleFields,
  getFieldCategories,
  handleDependenciesSubmit,
  ACCOUNT_TYPES
} from './model'; 