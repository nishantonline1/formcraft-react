import { useState, useCallback, useEffect } from 'react';
import { useForm, FormValues, FormValue } from '@dynamic_forms/react';
import type { UseFormReturn } from '@dynamic_forms/react';
import { gradeFormModel, defaultGradeData, moduleInfo } from './models';
import type { GradeFormData, ChemicalElement, Material, ToleranceSettings } from './types';

/**
 * Custom hook for Grade Creation form
 * Handles form state, validation, submission, and business logic
 */

export interface GradeCreationState {
  isSubmitting: boolean;
  submitSuccess: boolean;
  errors: string[];
  validationErrors: Record<string, string[]>;
}

// Return type for the hook
export interface UseGradeCreationReturn {
  // Form management
  form: UseFormReturn;
  formData: FormValues;
  state: GradeCreationState;
  handleSubmit: () => Promise<void>;
  handleCloseSuccessModal: () => void;
  resetForm: () => void;
  
  // Validation methods
  validateTemperatureRange: () => boolean;
  validateSelectedModules: () => boolean;
  validateRequiredFields: () => boolean;
  
  // Utility methods
  getSelectedModuleInfo: () => Array<typeof moduleInfo[keyof typeof moduleInfo]>;
  getFormSummary: () => Partial<GradeFormData>;
  
  // Event handlers
  onFieldChange: (key: string, value: FormValue) => void;
  onModuleToggle: (moduleId: string) => void;
  onReset: () => void;
  
  // Enhanced methods for sophisticated UI
  updateChemistryElements: (elements: ChemicalElement[]) => void;
  updateToleranceSettings: (settings: ToleranceSettings[]) => void;
  updateMaterials: (materials: Material[]) => void;
  toggleModule: (moduleKey: string) => void;
}

const INITIAL_STATE: GradeCreationState = {
  isSubmitting: false,
  submitSuccess: false,
  errors: [],
  validationErrors: {}
};

export const useGradeCreation = (): UseGradeCreationReturn => {
  // Initialize form with the model
  const form = useForm(gradeFormModel, {
    initialValues: defaultGradeData
  });

  // Custom state management
  const [state, setState] = useState<GradeCreationState>(INITIAL_STATE);

  // Get form data
  const { values: formData, handleChange } = form;

  // Sync form errors with custom state (if available)
  useEffect(() => {
    if (form.errors) {
      setState(prev => ({
        ...prev,
        validationErrors: form.errors || {}
      }));
    }
  }, [form.errors]);

  // Enhanced field change handler with custom logic
  const onFieldChange = useCallback((key: string, value: FormValue) => {
    handleChange(key, value);
    
    // Custom logic for specific fields
    if (key === 'selectedModules') {
      const modules = value as string[];
      
      // Auto-enable spectro when SPECTRO module is selected
      if (modules.includes('SPECTRO')) {
        handleChange('spectroEnabled', true);
      }
      
      // Auto-enable chargemix when IF or CHARGEMIX modules are selected
      if (modules.includes('IF') || modules.includes('CHARGEMIX')) {
        handleChange('chargemixEnabled', true);
      }
    }
    
    // Temperature range validation
    if (key === 'tappingTemperatureMin' || key === 'tappingTemperatureMax') {
      const min = key === 'tappingTemperatureMin' ? value as number : formData.tappingTemperatureMin as number;
      const max = key === 'tappingTemperatureMax' ? value as number : formData.tappingTemperatureMax as number;
      
      if (min && max && min >= max) {
        setState(prev => ({
          ...prev,
          validationErrors: {
            ...prev.validationErrors,
            tappingTemperature: ['Minimum temperature must be less than maximum temperature']
          }
        }));
      } else {
        setState(prev => ({
          ...prev,
          validationErrors: {
            ...prev.validationErrors,
            tappingTemperature: []
          }
        }));
      }
    }
  }, [handleChange, formData]);

  // Module toggle handler
  const onModuleToggle = useCallback((moduleId: string) => {
    const currentModules = (formData.selectedModules as string[]) || [];
    const newModules = currentModules.includes(moduleId)
      ? currentModules.filter(id => id !== moduleId)
      : [...currentModules, moduleId];
    
    onFieldChange('selectedModules', newModules);
  }, [formData.selectedModules, onFieldChange]);

  // Validation methods
  const validateTemperatureRange = useCallback(() => {
    const min = formData.tappingTemperatureMin as number;
    const max = formData.tappingTemperatureMax as number;
    
    if (!min || !max) return false;
    if (min < 800 || min > 2000) return false;
    if (max < 800 || max > 2000) return false;
    if (min >= max) return false;
    
    return true;
  }, [formData.tappingTemperatureMin, formData.tappingTemperatureMax]);

  const validateSelectedModules = useCallback(() => {
    const modules = formData.selectedModules as string[];
    return modules && modules.length > 0;
  }, [formData.selectedModules]);

  const validateRequiredFields = useCallback(() => {
    const requiredFields = ['tagId', 'gradeName', 'gradeType', 'bathChemistryDecision'];
    return requiredFields.every(field => {
      const value = formData[field];
      return value !== undefined && value !== null && value !== '';
    });
  }, [formData]);

  // Get selected module information
  const getSelectedModuleInfo = useCallback(() => {
    const selectedModules = (formData.selectedModules as string[]) || [];
    return selectedModules
      .map(moduleId => moduleInfo[moduleId as keyof typeof moduleInfo])
      .filter(Boolean);
  }, [formData.selectedModules]);

  // Get form summary for display
  const getFormSummary = useCallback((): Partial<GradeFormData> => {
    return {
      selectedModules: formData.selectedModules as string[],
      tagId: formData.tagId as string,
      gradeName: formData.gradeName as string,
      gradeType: formData.gradeType as GradeFormData['gradeType'],
      tappingTemperatureMin: formData.tappingTemperatureMin as number,
      tappingTemperatureMax: formData.tappingTemperatureMax as number,
      bathChemistryDecision: formData.bathChemistryDecision as 'with' | 'without',
      spectroEnabled: formData.spectroEnabled as boolean,
      chargemixEnabled: formData.chargemixEnabled as boolean
    };
  }, [formData]);

  // Form submission handler
  const handleSubmit = useCallback(async () => {
    setState(prev => ({ ...prev, isSubmitting: true, errors: [] }));

    try {
      // Validate form
      const isTemperatureValid = validateTemperatureRange();
      const areModulesValid = validateSelectedModules();
      const areRequiredFieldsValid = validateRequiredFields();

      if (!isTemperatureValid || !areModulesValid || !areRequiredFieldsValid) {
        const errors: string[] = [];
        if (!isTemperatureValid) errors.push('Invalid temperature range');
        if (!areModulesValid) errors.push('At least one module must be selected');
        if (!areRequiredFieldsValid) errors.push('All required fields must be filled');

        setState(prev => ({
          ...prev,
          isSubmitting: false,
          errors
        }));
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get form summary for analytics
      const summary = getFormSummary();
      console.log('Grade created successfully:', summary);
      
      // Analytics tracking
      console.log('Analytics: Grade creation completed', {
        moduleCount: summary.selectedModules?.length,
        gradeType: summary.gradeType,
        spectroEnabled: summary.spectroEnabled,
        chargemixEnabled: summary.chargemixEnabled
      });

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        submitSuccess: true
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        errors: [error instanceof Error ? error.message : 'Failed to create grade']
      }));
    }
  }, [validateSelectedModules, validateRequiredFields, validateTemperatureRange, getFormSummary]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    // Reset form values
    Object.keys(defaultGradeData).forEach((key) => {
      const field = gradeFormModel.find(f => f.key === key);
      if (field) {
        handleChange(key, field.defaultValue as FormValue);
      }
    });
    
    // Reset custom state
    setState(INITIAL_STATE);
  }, [handleChange]);

  // Reset handler
  const onReset = useCallback(() => {
    resetForm();
  }, [resetForm]);

  // Enhanced methods for the sophisticated UI
  const updateChemistryElements = useCallback((elements: ChemicalElement[]) => {
    handleChange('chemistryElements', elements);
  }, [handleChange]);

  const updateToleranceSettings = useCallback((settings: ToleranceSettings[]) => {
    handleChange('toleranceSettings', settings);
  }, [handleChange]);

  const updateMaterials = useCallback((materials: Material[]) => {
    handleChange('materials', materials);
  }, [handleChange]);

  const toggleModule = useCallback((moduleKey: string) => {
    const currentModules = (formData.selectedModules as string[]) || [];
    const newModules = currentModules.includes(moduleKey)
      ? currentModules.filter(m => m !== moduleKey)
      : [...currentModules, moduleKey];
    
    handleChange('selectedModules', newModules);
    
    // Auto-enable features based on module selection
    if (moduleKey === 'SPECTRO' && newModules.includes('SPECTRO')) {
      handleChange('spectroEnabled', true);
    }
    if ((moduleKey === 'IF_KIOSK' || moduleKey === 'CHARGEMIX') && 
        (newModules.includes('IF_KIOSK') || newModules.includes('CHARGEMIX'))) {
      handleChange('chargemixEnabled', true);
    }
  }, [formData.selectedModules, handleChange]);

  return {
    form,
    formData,
    state,
    handleSubmit,
    handleCloseSuccessModal: onReset,
    resetForm,
    validateTemperatureRange,
    validateSelectedModules,
    validateRequiredFields,
    getSelectedModuleInfo,
    getFormSummary,
    onFieldChange,
    onModuleToggle,
    onReset,
    
    // Enhanced methods for sophisticated UI
    updateChemistryElements,
    updateToleranceSettings,
    updateMaterials,
    toggleModule,
  };
};