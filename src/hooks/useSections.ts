import { useMemo, useCallback, useState } from 'react';
import type { 
  FormModel, 
  SectionedFormModel, 
  FieldSection, 
  SectionGroup, 
  SectionProgress,
  FieldProps
} from '../model';
import type { UseFormReturn } from './useForm';

/**
 * Section management options
 */
export interface SectionOptions {
  defaultCollapsed?: boolean;
  collapsibleByDefault?: boolean;
  autoHideEmptySections?: boolean;
}

/**
 * Section management return type
 */
export interface UseSectionsReturn {
  sections: SectionGroup[];
  getSectionFields: (sectionId: string) => FieldProps[];
  getSectionProgress: (sectionId: string) => SectionProgress;
  getAllProgress: () => SectionProgress[];
  toggleSection: (sectionId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  isCollapsed: (sectionId: string) => boolean;
  getVisibleFields: () => FieldProps[];
  getSectionByField: (fieldPath: string) => FieldSection | undefined;
}

/**
 * Utility function to convert FormModel with sections to SectionedFormModel
 */
export function extractSectionsFromModel(model: FormModel): SectionedFormModel {
  const sectionsMap = new Map<string, FieldSection>();
  const fieldsWithSections: FieldProps[] = [];
  const fieldsWithoutSections: FieldProps[] = [];

  // Separate fields with and without sections, extract section definitions
  model.forEach(field => {
    if (field.section) {
      fieldsWithSections.push(field);
      
      // Extract section definition from field.meta if present
      if (field.meta?.sectionConfig) {
        const sectionConfig = field.meta.sectionConfig as Partial<FieldSection>;
        if (!sectionsMap.has(field.section.sectionId)) {
          sectionsMap.set(field.section.sectionId, {
            id: field.section.sectionId,
            title: field.section.sectionId,
            ...sectionConfig
          });
        }
      } else if (!sectionsMap.has(field.section.sectionId)) {
        // Create default section
        sectionsMap.set(field.section.sectionId, {
          id: field.section.sectionId,
          title: field.section.sectionId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        });
      }
    } else {
      fieldsWithoutSections.push(field);
    }
  });

  // If there are fields without sections, create a default section
  if (fieldsWithoutSections.length > 0) {
    sectionsMap.set('default', {
      id: 'default',
      title: undefined, // No title for default section
    });
    
    // Add section reference to fields without sections
    fieldsWithoutSections.forEach(field => {
      field.section = { sectionId: 'default' };
    });
  }

  return {
    sections: Array.from(sectionsMap.values()),
    fields: [...fieldsWithSections, ...fieldsWithoutSections],
  };
}

/**
 * Hook for comprehensive section management
 */
export function useSections(
  model: FormModel | SectionedFormModel,
  form: UseFormReturn,
  options: SectionOptions = {}
): UseSectionsReturn {
  const {
    defaultCollapsed = false,
    collapsibleByDefault = true,
    autoHideEmptySections = false,
  } = options;

  // Convert model to sectioned format if needed
  const sectionedModel = useMemo((): SectionedFormModel => {
    if (Array.isArray(model)) {
      return extractSectionsFromModel(model);
    }
    return model;
  }, [model]);

  // Track collapsed state for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => {
    const initialCollapsed = new Set<string>();
    if (defaultCollapsed || collapsibleByDefault) {
      sectionedModel.sections.forEach(section => {
        if (section.collapsible !== false && (defaultCollapsed || section.collapsed)) {
          initialCollapsed.add(section.id);
        }
      });
    }
    return initialCollapsed;
  });

  // Group fields by section
  const sectionGroups = useMemo((): SectionGroup[] => {
    const groups: SectionGroup[] = [];
    
    sectionedModel.sections.forEach(section => {
      const sectionFields = sectionedModel.fields
        .filter(field => field.section?.sectionId === section.id)
        .sort((a, b) => (a.section?.order || 0) - (b.section?.order || 0));

      // Skip empty sections if auto-hide is enabled
      if (autoHideEmptySections && sectionFields.length === 0) {
        return;
      }

      const visibleFields = sectionFields.filter(field => 
        form.isFieldVisible(field.key)
      );

      groups.push({
        section,
        fields: sectionFields,
        isVisible: visibleFields.length > 0,
        isCollapsed: collapsedSections.has(section.id),
      });
    });

    return groups;
  }, [sectionedModel, form, collapsedSections, autoHideEmptySections]);

  // Get fields for a specific section
  const getSectionFields = useCallback((sectionId: string): FieldProps[] => {
    return sectionedModel.fields.filter(field => 
      field.section?.sectionId === sectionId
    );
  }, [sectionedModel.fields]);

  // Calculate section progress
  const getSectionProgress = useCallback((sectionId: string): SectionProgress => {
    const sectionFields = getSectionFields(sectionId);
    const visibleFields = sectionFields.filter(field => form.isFieldVisible(field.key));
    
    const total = visibleFields.length;
    const completed = visibleFields.filter(field => {
      const value = form.values[field.key];
      return value !== null && value !== undefined && value !== '';
    }).length;

    const fieldsWithErrors = visibleFields.filter(field => {
      const errors = form.errors[field.key];
      return errors && errors.length > 0;
    }).length;

    return {
      sectionId,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      hasErrors: fieldsWithErrors > 0,
      isValid: fieldsWithErrors === 0 && completed === total,
    };
  }, [getSectionFields, form.values, form.errors, form.isFieldVisible]);

  // Get progress for all sections
  const getAllProgress = useCallback((): SectionProgress[] => {
    return sectionedModel.sections.map(section => 
      getSectionProgress(section.id)
    );
  }, [sectionedModel.sections, getSectionProgress]);

  // Toggle section collapsed state
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Expand all collapsible sections
  const expandAll = useCallback(() => {
    setCollapsedSections(new Set());
  }, []);

  // Collapse all collapsible sections
  const collapseAll = useCallback(() => {
    const allCollapsible = new Set<string>();
    sectionedModel.sections.forEach(section => {
      if (section.collapsible !== false) {
        allCollapsible.add(section.id);
      }
    });
    setCollapsedSections(allCollapsible);
  }, [sectionedModel.sections]);

  // Check if section is collapsed
  const isCollapsed = useCallback((sectionId: string): boolean => {
    return collapsedSections.has(sectionId);
  }, [collapsedSections]);

  // Get all visible fields (accounting for collapsed sections)
  const getVisibleFields = useCallback((): FieldProps[] => {
    return sectionGroups.flatMap(group => {
      if (!group.isVisible || group.isCollapsed) {
        return [];
      }
      return group.fields.filter(field => form.isFieldVisible(field.key));
    });
  }, [sectionGroups, form.isFieldVisible]);

  // Get section by field path
  const getSectionByField = useCallback((fieldPath: string): FieldSection | undefined => {
    const field = sectionedModel.fields.find(f => f.key === fieldPath);
    if (!field?.section) return undefined;
    
    return sectionedModel.sections.find(s => s.id === field.section!.sectionId);
  }, [sectionedModel.fields, sectionedModel.sections]);

  return {
    sections: sectionGroups,
    getSectionFields,
    getSectionProgress,
    getAllProgress,
    toggleSection,
    expandAll,
    collapseAll,
    isCollapsed,
    getVisibleFields,
    getSectionByField,
  };
} 