import { useMemo, useCallback } from 'react';
import { useEnhancedForm, type EnhancedFormOptions } from './useEnhancedForm';
import type { FormModel, ConfigField, UseFormReturn } from '@dynamic_forms/react';
import type { SectionedFormModel, SectionedFieldProps, FormSection, SectionProgress } from './types';

/**
 * Enhanced return type for sectioned forms
 */
export interface SectionedFormReturn extends UseFormReturn {
  sections: FormSection[];
  getSectionFields: (sectionId: string) => ConfigField[];
  getSectionProgress: (sectionId: string) => SectionProgress;
}

/**
 * Flatten sectioned model into regular FormModel
 */
export function flattenSectionedModel(sectionedModel: SectionedFormModel): FormModel {
  const flattened: SectionedFieldProps[] = [];
  
  sectionedModel.sections.forEach(section => {
    section.fields.forEach(field => {
      flattened.push({
        ...field,
        sectionId: section.id,
        sectionTitle: section.title,
        // Add section metadata to field
        meta: {
          ...field.meta,
          sectionId: section.id,
          sectionTitle: section.title,
          sectionDescription: section.description
        }
      });
    });
  });
  
  return flattened;
}

/**
 * Enhanced useForm for sectioned forms
 * 
 * @example
 * ```typescript
 * const sectionedModel: SectionedFormModel = {
 *   sections: [
 *     {
 *       id: 'personal',
 *       title: 'Personal Information',
 *       fields: [
 *         { key: 'firstName', type: 'text', label: 'First Name' },
 *         { key: 'lastName', type: 'text', label: 'Last Name' }
 *       ]
 *     },
 *     {
 *       id: 'preferences',
 *       title: 'Preferences',
 *       collapsible: true,
 *       fields: [
 *         { key: 'theme', type: 'select', label: 'Theme' }
 *       ]
 *     }
 *   ]
 * };
 * 
 * const form = useSectionedForm(sectionedModel, {
 *   initialValues: { firstName: '', lastName: '', theme: '' }
 * });
 * 
 * // Access section-specific functionality
 * const personalFields = form.getSectionFields('personal');
 * const personalProgress = form.getSectionProgress('personal');
 * ```
 */
export function useSectionedForm(
  sectionedModel: SectionedFormModel,
  options?: EnhancedFormOptions
): SectionedFormReturn {
  // Flatten the sectioned model
  const flatModel = useMemo(() => flattenSectionedModel(sectionedModel), [sectionedModel]);
  
  // Use enhanced form hook
  const form = useEnhancedForm(flatModel, options);
  
  // Helper to get fields for a specific section
  const getSectionFields = useCallback((sectionId: string): ConfigField[] => {
    return form.config.fields.filter(field => field.meta?.sectionId === sectionId);
  }, [form.config.fields]);
  
  // Helper to calculate section progress
  const getSectionProgress = useCallback((sectionId: string): SectionProgress => {
    const sectionFields = getSectionFields(sectionId);
    const total = sectionFields.length;
    const completed = sectionFields.filter(field => {
      const value = form.values[field.path];
      return value !== null && value !== undefined && value !== '';
    }).length;
    
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [getSectionFields, form.values]);

  return {
    ...form,
    sections: sectionedModel.sections,
    getSectionFields,
    getSectionProgress
  };
}

export default useSectionedForm; 