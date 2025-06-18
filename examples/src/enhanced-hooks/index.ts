/**
 * Enhanced Form Builder Hooks
 * 
 * This module provides enhanced versions of Form Builder hooks that:
 * 1. Eliminate redundant buildFormConfig calls
 * 2. Add section-based form organization
 * 3. Provide better developer experience with automatic config building
 */

// Enhanced form hooks
export { useEnhancedForm, useEnhancedFormDirect } from './useEnhancedForm';
export { useSectionedForm, flattenSectionedModel } from './useSectionedForm';

// Types
export type { EnhancedFormOptions } from './useEnhancedForm';
export type { SectionedFormReturn } from './useSectionedForm';
export type { 
  FormSection, 
  SectionedFormModel, 
  SectionedFieldProps, 
  SectionProgress 
} from './types';

// Re-export commonly used types from main library
export type { FormModel, FormConfig, ConfigField, FormValues, UseFormReturn } from '@dynamic_forms/react';

/**
 * Migration guide:
 * 
 * OLD WAY:
 * ```typescript
 * import { useForm, buildFormConfig } from '@dynamic_forms/react';
 * 
 * const config = useMemo(() => buildFormConfig(formModel), []);
 * const form = useForm(config, { initialValues: {...} });
 * ```
 * 
 * NEW WAY:
 * ```typescript
 * import { useEnhancedForm } from './enhanced-hooks';
 * 
 * const form = useEnhancedForm(formModel, { initialValues: {...} });
 * ```
 * 
 * Benefits:
 * - 75% less boilerplate code
 * - Automatic config memoization
 * - Better TypeScript inference
 * - Full backward compatibility
 */ 