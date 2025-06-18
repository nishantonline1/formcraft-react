import { useMemo } from 'react';
import { useEnhancedForm } from '../../enhanced-hooks';
import { validationFormModel, initialValidationValues, handleValidationSubmit } from './model';

/**
 * Main hook for validation form functionality.
 * This refactored hook uses `useEnhancedForm` and consolidates all related logic.
 */
export const useValidationForm = () => {
  const form = useEnhancedForm(validationFormModel, {
    initialValues: initialValidationValues,
    formId: 'validation-form',
    enableAnalytics: true,
  });

  const { values, errors, touched } = form;

  // Submit handler wrapper
  const handleSubmit = async (formValues: any) => {
    return await handleValidationSubmit(formValues);
  };

  const validationMetrics = useMemo(() => {
    const totalFields = Object.keys(values).length;
    
    const fieldsWithErrors = Object.keys(errors).filter(key => 
      errors[key] && errors[key].length > 0
    ).length;
    
    const validFields = totalFields - fieldsWithErrors;
    
    const touchedFields = Object.keys(touched).filter(key => touched[key]).length;
    
    const fieldsWithValues = Object.keys(values).filter(key => {
      const value = values[key];
      return value !== null && value !== undefined && value !== '';
    }).length;

    const isFormValid = fieldsWithErrors === 0;
    const isFormTouched = touchedFields > 0;
    const isComplete = fieldsWithValues === totalFields;
    
    return {
      // Stats
      totalFields,
      fieldsWithErrors,
      validFields,
      touchedFields,
      fieldsWithValues,
      completionPercentage: totalFields > 0 ? Math.round((fieldsWithValues / totalFields) * 100) : 0,
      
      // State
      isFormValid,
      isFormTouched,
      isComplete,
      hasErrors: fieldsWithErrors > 0,
      canSubmit: isFormValid && isFormTouched && isComplete,
    };
  }, [values, errors, touched]);

  return {
    form,
    handleSubmit,
    validationMetrics,
  };
}; 