import { useMemo } from 'react';
import { useEnhancedForm } from '../../enhanced-hooks';
import { simpleFormModel, initialFormValues } from './model';

/**
 * Custom hook for the simple form that encapsulates form configuration and state management
 */
export const useSimpleForm = () => {
  const form = useEnhancedForm(simpleFormModel, {
    initialValues: initialFormValues,
    formId: 'simple-dependency-form',
    enableAnalytics: true,
  });

  const { config, values, errors, touched, isFieldVisible, isFieldDisabled, dynamicOptions } = form;

  const handleSubmit = async (formValues: Record<string, unknown>) => {
    console.log('Simple form submitted:', formValues);
    try {
      // Simulate async operation
      await new Promise(resolve => resolve(true));
      console.log('✅ Form submission successful');
      return { success: true, data: formValues };
    } catch (error) {
      console.error('❌ Form submission failed:', error);
      throw error;
    }
  };

  const stats = useMemo(() => ({
    totalFields: config.fields.length,
    visibleFields: config.fields.filter(field => isFieldVisible(field.path)).length,
    disabledFields: config.fields.filter(field => isFieldDisabled(field.path)).length,
    fieldsWithErrors: Object.keys(errors).filter(key => errors[key]?.length > 0).length,
    touchedFields: Object.keys(touched).filter(key => touched[key]).length,
    fieldsWithValues: Object.keys(values).filter(key => {
      const value = values[key];
      return value !== undefined && value !== '' && value !== null;
    }).length,
    dynamicOptionsCount: dynamicOptions.size,
  }), [config, values, errors, touched, isFieldVisible, isFieldDisabled, dynamicOptions]);

  const validationState = useMemo(() => {
    const hasErrors = Object.keys(errors).some(key => errors[key]?.length > 0);
    const isFormValid = !hasErrors;
    const isFormTouched = Object.keys(touched).length > 0;
    const isFormDirty = Object.keys(values).some(key => {
      const currentValue = values[key];
      const initialValue = initialFormValues[key as keyof typeof initialFormValues];
      return currentValue !== initialValue;
    });
    return {
      hasErrors,
      isFormValid,
      isFormTouched,
      isFormDirty,
      canSubmit: isFormValid && (isFormDirty || isFormTouched),
    };
  }, [errors, touched, values]);

  return {
    form,
    handleSubmit,
    stats,
    validationState,
  };
}; 