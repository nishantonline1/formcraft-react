import { useForm } from 'react-form-builder-ts';
import type { FormModel, FormValues, UseFormReturn } from 'react-form-builder-ts';

/**
 * Enhanced form options interface
 */
export interface EnhancedFormOptions {
  initialValues?: FormValues;
  formId?: string;
  enableAnalytics?: boolean;
  eventHooks?: {
    onInit?: (field: any) => void;
    onFieldChange?: (path: string, value: any) => void;
    onFieldFocus?: (path: string) => void;
    onFieldBlur?: (path: string) => void;
    onFormSubmit?: (values: FormValues) => void;
  };
  flags?: Record<string, boolean>;
}

/**
 * Enhanced useForm hook that provides a clean API for form management
 * 
 * ✨ UPDATED: Now uses the new refactored useForm API!
 * - No more manual buildFormConfig calls needed
 * - Config is automatically generated and returned
 * - Simplified, error-free API
 * 
 * @example
 * ```typescript
 * // ✅ CLEAN API - FormModel goes directly to useForm
 * const form = useEnhancedForm(formModel, { 
 *   initialValues: { username: '', email: '' } 
 * });
 * 
 * // Config is automatically available
 * <FormRenderer config={form.config} form={form} />
 * ```
 */
export function useEnhancedForm(
  model: FormModel,
  options?: EnhancedFormOptions
): UseFormReturn {
  // Use the refactored useForm hook that now accepts FormModel directly
  // and returns config as part of UseFormReturn
  return useForm(model, options);
}

/**
 * Migration helper: Drop-in replacement for existing useForm usage
 * Now simply aliases useEnhancedForm since the APIs are unified
 * 
 * @example
 * ```typescript
 * // Before refactoring
 * const config = useMemo(() => buildFormConfig(formModel), []);
 * const form = useForm(config, { initialValues: {...} });
 * 
 * // After refactoring - both work the same way
 * const form = useEnhancedForm(formModel, { initialValues: {...} });
 * const form = useEnhancedFormDirect(formModel, { initialValues: {...} });
 * ```
 */
export const useEnhancedFormDirect = useEnhancedForm;

export default useEnhancedForm; 