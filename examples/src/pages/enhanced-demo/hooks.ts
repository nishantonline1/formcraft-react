import { useEnhancedForm, useSectionedForm } from '../../enhanced-hooks';
import { 
  enhancedFormModel, 
  sectionedDemoModel, 
  enhancedFormInitialValues,
  sectionedFormInitialValues,
  handleFormSubmission 
} from './model';

/**
 * Hook for enhanced form demo (demonstrates elimination of buildFormConfig)
 */
export function useEnhancedFormDemo() {
  // ✅ NEW WAY - No more buildFormConfig calls!
  const form = useEnhancedForm(enhancedFormModel, {
    initialValues: enhancedFormInitialValues,
    formId: 'enhanced-demo',
    enableAnalytics: true
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const result = await handleFormSubmission(values);
      console.log('Enhanced form submission result:', result);
      return result;
    } catch (error) {
      console.error('Enhanced form submission failed:', error);
      throw error;
    }
  };

  return {
    form,
    handleSubmit,
    // Demonstrate that config is automatically available
    fieldCount: form.config.fields.length,
    fieldPaths: form.config.fields.map(f => f.path)
  };
}

/**
 * Hook for sectioned form demo (demonstrates section organization)
 */
export function useSectionedFormDemo() {
  const form = useSectionedForm(sectionedDemoModel, {
    initialValues: sectionedFormInitialValues,
    formId: 'sectioned-demo',
    enableAnalytics: true
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const result = await handleFormSubmission(values);
      console.log('Sectioned form submission result:', result);
      return result;
    } catch (error) {
      console.error('Sectioned form submission failed:', error);
      throw error;
    }
  };

  // Calculate overall form progress
  const overallProgress = () => {
    const totalFields = form.config.fields.length;
    const completedFields = form.config.fields.filter(field => {
      const value = form.values[field.path];
      return value !== null && value !== undefined && value !== '';
    }).length;
    
    return {
      completed: completedFields,
      total: totalFields,
      percentage: totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
    };
  };

  // Get section-specific progress
  const sectionProgress = {
    account: form.getSectionProgress('account'),
    preferences: form.getSectionProgress('preferences'),
    security: form.getSectionProgress('security')
  };

  return {
    form,
    handleSubmit,
    overallProgress: overallProgress(),
    sectionProgress,
    // Section helpers
    getSectionFields: form.getSectionFields,
    getSectionProgress: form.getSectionProgress
  };
}

/**
 * Comparison hook showing old vs new patterns
 */
export function useComparisonDemo() {
  // The old way would require:
  // const config = useMemo(() => buildFormConfig(enhancedFormModel), []);
  // const form = useForm(config, { initialValues: enhancedFormInitialValues });

  // The new way:
  const enhancedForm = useEnhancedForm(enhancedFormModel, {
    initialValues: enhancedFormInitialValues
  });

  return {
    enhancedForm,
    // Stats for comparison
    stats: {
      linesOfCodeSaved: 2, // No more useMemo + buildFormConfig
      configAvailable: !!enhancedForm.config,
      fieldCount: enhancedForm.config.fields.length
    }
  };
} 