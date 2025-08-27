import { useMemo, useCallback, useState } from 'react';
import { useForm } from '@dynamic_forms/react';
import type { FormValues } from '@dynamic_forms/react';
import { 
  coreConfigFormModel, 
  initialValues, 
  customValidationRules, 
  fieldHelpers,
  testScenarios,
  configurationPresets,
  type CoreConfigFormData 
} from './model';

/**
 * Advanced hook demonstrating comprehensive form configuration usage
 * 
 * This hook showcases:
 * - Form state management with useForm
 * - Custom validation integration
 * - Field visibility and dependency management
 * - Form statistics and analytics
 * - Preset configuration switching
 * - Advanced form operations
 */
export const useAdvancedCoreConfig = () => {
  const [currentPreset, setCurrentPreset] = useState<keyof typeof configurationPresets>('enterprise');
  const [validationMode, setValidationMode] = useState<'standard' | 'strict'>('standard');
  
  // Initialize form with current preset
  const formModel = configurationPresets[currentPreset];
  
  const form = useForm(formModel, {
    initialValues,
    formId: `core-config-${currentPreset}`,
    enableAnalytics: true
  });

  // Advanced form statistics
  const formAnalytics = useMemo(() => {
    const { values, errors, touched, config } = form;
    const fields = config?.fields || [];
    
    const stats = {
      // Basic metrics
      totalFields: fields.length,
      visibleFields: fields.filter(field => form.isFieldVisible(field.path)).length,
      completedFields: Object.keys(values).filter(key => {
        const value = values[key];
        return value !== undefined && value !== '' && value !== null && 
               !(Array.isArray(value) && value.length === 0);
      }).length,
      
      // Validation metrics
      fieldsWithErrors: Object.keys(errors).filter(key => 
        errors[key] && errors[key].length > 0
      ).length,
      touchedFields: Object.keys(touched).filter(key => touched[key]).length,
      
      // Progress metrics
      completionPercentage: 0,
      validationScore: 0,
      
      // Field type breakdown
      fieldsByType: fieldHelpers.getFieldsByType('text').length ? {
        text: fieldHelpers.getFieldsByType('text').length,
        select: fieldHelpers.getFieldsByType('select').length,
        number: fieldHelpers.getFieldsByType('number').length,
        checkbox: fieldHelpers.getFieldsByType('checkbox').length,
        array: fieldHelpers.getFieldsByType('array').length
      } : {},
      
      // Conditional field metrics
      conditionalFields: fieldHelpers.getConditionalFields().length,
      activeConditionalFields: fieldHelpers.getConditionalFields().filter(field => 
        form.isFieldVisible(field.path)
      ).length
    };
    
    // Calculate completion percentage
    const visibleFields = stats.visibleFields;
    stats.completionPercentage = visibleFields > 0 
      ? Math.round((stats.completedFields / visibleFields) * 100) 
      : 0;
    
    // Calculate validation score
    const touchedFieldCount = stats.touchedFields;
    const errorFieldCount = stats.fieldsWithErrors;
    stats.validationScore = touchedFieldCount > 0 
      ? Math.round(((touchedFieldCount - errorFieldCount) / touchedFieldCount) * 100)
      : 100;
    
    return stats;
  }, [form, currentPreset]);

  // Advanced validation with custom rules
  const performAdvancedValidation = useCallback(async () => {
    const values = form.values as Partial<CoreConfigFormData>;
    const errors: Record<string, string[]> = {};
    
    // Standard form validation
    const standardErrors = form.errors;
    Object.assign(errors, standardErrors);
    
    // Custom validation rules
    if (validationMode === 'strict') {
      // Enterprise requirements validation
      const enterpriseErrors = customValidationRules.validateEnterpriseRequirements(values);
      if (enterpriseErrors.length > 0) {
        errors.enterprise = enterpriseErrors;
      }
      
      // Budget-feature alignment validation
      const budgetErrors = customValidationRules.validateBudgetFeatureAlignment(values);
      if (budgetErrors.length > 0) {
        errors.budgetAlignment = budgetErrors;
      }
      
      // Email uniqueness validation (async)
      if (values.email) {
        try {
          const emailErrors = await customValidationRules.validateEmailUniqueness(values.email);
          if (emailErrors.length > 0) {
            errors.email = [...(errors.email || []), ...emailErrors];
          }
        } catch (error) {
          console.warn('Email validation failed:', error);
        }
      }
    }
    
    return errors;
  }, [form.errors, form.values, validationMode]);

  // Form submission with advanced processing
  const handleAdvancedSubmit = useCallback(async () => {
    const values = form.values as Partial<CoreConfigFormData>;
    
    // Perform advanced validation
    const validationErrors = await performAdvancedValidation();
    const hasErrors = Object.keys(validationErrors).some(key => 
      validationErrors[key] && validationErrors[key].length > 0
    );
    
    if (hasErrors) {
      console.error('Validation errors:', validationErrors);
      return { success: false, errors: validationErrors };
    }
    
    // Simulate form submission
    console.log('Submitting form with values:', values);
    console.log('Form analytics:', formAnalytics);
    
    // Simulate API call with processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return submission result
    return {
      success: true,
      data: values,
      metadata: {
        submissionTime: new Date().toISOString(),
        formPreset: currentPreset,
        validationMode,
        analytics: formAnalytics
      }
    };
  }, [form.values, performAdvancedValidation, formAnalytics, currentPreset, validationMode]);

  // Load test scenario
  const loadTestScenario = useCallback((scenario: keyof typeof testScenarios) => {
    const scenarioData = testScenarios[scenario];
    Object.keys(scenarioData).forEach(key => {
      form.handleChange(key, scenarioData[key as keyof typeof scenarioData]);
    });
  }, [form]);

  // Switch configuration preset
  const switchPreset = useCallback((preset: keyof typeof configurationPresets) => {
    setCurrentPreset(preset);
    // Reset form when switching presets
    Object.keys(initialValues).forEach(key => {
      form.handleChange(key, initialValues[key as keyof typeof initialValues]);
    });
  }, [form]);

  // Field introspection utilities
  const fieldIntrospection = useMemo(() => ({
    getFieldMetadata: (fieldKey: string) => {
      const field = fieldHelpers.getFieldByKey(fieldKey);
      if (!field) return null;
      
      return {
        ...field,
        isVisible: form.isFieldVisible(fieldKey),
        isDisabled: form.isFieldDisabled(fieldKey),
        currentValue: form.values[fieldKey],
        hasError: form.errors[fieldKey]?.length > 0,
        isTouched: form.touched[fieldKey],
        effectiveField: form.getEffectiveField(fieldKey)
      };
    },
    
    getAllFieldMetadata: () => {
      return formModel.map(field => ({
        key: field.key,
        metadata: fieldIntrospection.getFieldMetadata(field.key)
      }));
    },
    
    getVisibleFieldKeys: () => {
      return formModel
        .filter(field => form.isFieldVisible(field.key))
        .map(field => field.key);
    },
    
    getFieldsBySection: () => {
      const sections: Record<string, string[]> = {
        basic: ['userType', 'firstName', 'lastName', 'email', 'phone'],
        organization: ['companyName', 'industry', 'employeeCount', 'annualRevenue'],
        budget: ['monthlyBudget', 'paymentFrequency', 'requiredFeatures'],
        preferences: ['communicationPreferences', 'timezone'],
        agreements: ['agreesToTerms', 'subscribesToNewsletter', 'allowsDataSharing'],
        advanced: ['customRequirements', 'implementationTimeline', 'contactMethod']
      };
      
      return Object.keys(sections).reduce((acc, section) => {
        acc[section] = sections[section].filter(fieldKey => 
          form.isFieldVisible(fieldKey)
        );
        return acc;
      }, {} as Record<string, string[]>);
    }
  }), [form, formModel]);

  return {
    // Core form functionality
    form,
    ...form,
    
    // Advanced features
    formAnalytics,
    performAdvancedValidation,
    handleAdvancedSubmit,
    
    // Configuration management
    currentPreset,
    switchPreset,
    availablePresets: Object.keys(configurationPresets) as (keyof typeof configurationPresets)[],
    
    // Validation mode
    validationMode,
    setValidationMode,
    
    // Test scenarios
    loadTestScenario,
    availableScenarios: Object.keys(testScenarios) as (keyof typeof testScenarios)[],
    
    // Field introspection
    fieldIntrospection,
    
    // Utilities
    helpers: fieldHelpers,
    customValidation: customValidationRules
  };
};

/**
 * Simplified hook for basic core configuration usage
 * Perfect for getting started with the core config approach
 */
export const useBasicCoreConfig = () => {
  const form = useForm(configurationPresets.minimal, {
    initialValues: {
      userType: '',
      firstName: '',
      lastName: '',
      email: '',
      agreesToTerms: false
    },
    enableAnalytics: false
  });

  const handleSubmit = async (values: FormValues) => {
    console.log('Basic form submitted:', values);
    
    // Simple validation check
    const requiredFields = ['userType', 'firstName', 'lastName', 'email'];
    const missingFields = requiredFields.filter(field => !values[field]);
    
    if (missingFields.length > 0) {
      return { 
        success: false, 
        errors: { 
          missing: `Please fill in: ${missingFields.join(', ')}` 
        } 
      };
    }
    
    if (!values.agreesToTerms) {
      return { 
        success: false, 
        errors: { 
          terms: 'You must agree to the terms of service' 
        } 
      };
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, data: values };
  };

  const getFormSummary = () => {
    const { values } = form;
    const filledFields = Object.keys(values).filter(key => {
      const value = values[key];
      return value !== undefined && value !== '' && value !== null;
    });
    
    return {
      totalFields: configurationPresets.minimal.length,
      filledFields: filledFields.length,
      isComplete: filledFields.length === configurationPresets.minimal.length,
      completionPercentage: Math.round((filledFields.length / configurationPresets.minimal.length) * 100)
    };
  };

  return {
    ...form,
    handleSubmit,
    getFormSummary,
    isMinimalConfig: true
  };
};

/**
 * Hook demonstrating standalone configuration (non-React usage simulation)
 * Shows how the configuration can be used outside of React components
 */
export const useStandaloneConfig = () => {
  // Simulate standalone configuration usage
  const configResult = useMemo(() => {
    // This simulates how you would use createFormConfig in a non-React environment
    const form = useForm(coreConfigFormModel, {
      initialValues,
      enableAnalytics: false
    });

    return {
      // Configuration data
      config: form.config,
      fields: form.config?.fields || [],
      dependencies: form.dependencies,
      
      // Utility functions
      getFieldByKey: (key: string) => fieldHelpers.getFieldByKey(key),
      getFieldsByType: (type: string) => fieldHelpers.getFieldsByType(type),
      getConditionalFields: () => fieldHelpers.getConditionalFields(),
      
      // Validation utilities
      validation: {
        validateField: (path: string, value: unknown) => {
          const field = fieldHelpers.getFieldByKey(path);
          if (!field) return [];
          
          const errors: string[] = [];
          
          if (field.validators?.required && (!value || value === '')) {
            errors.push('This field is required');
          }
          
          if (field.validators?.min && typeof value === 'string' && value.length < field.validators.min) {
            errors.push(`Minimum length is ${field.validators.min}`);
          }
          
          if (field.validators?.pattern && typeof value === 'string' && !field.validators.pattern.test(value)) {
            errors.push('Invalid format');
          }
          
          return errors;
        },
        
        validateAllFields: (values: Record<string, unknown>) => {
          const allErrors: Record<string, string[]> = {};
          
          Object.keys(values).forEach(key => {
            const fieldErrors = configResult.validation.validateField(key, values[key]);
            if (fieldErrors.length > 0) {
              allErrors[key] = fieldErrors;
            }
          });
          
          return allErrors;
        }
      },
      
      // Statistics
      stats: {
        totalFields: form.config?.fields?.length || 0,
        conditionalFields: fieldHelpers.getConditionalFields().length,
        requiredFields: fieldHelpers.getRequiredFields().length,
        fieldTypes: {
          text: fieldHelpers.getFieldsByType('text').length,
          select: fieldHelpers.getFieldsByType('select').length,
          number: fieldHelpers.getFieldsByType('number').length,
          checkbox: fieldHelpers.getFieldsByType('checkbox').length,
          array: fieldHelpers.getFieldsByType('array').length
        }
      }
    };
  }, []);

  return configResult;
};

/**
 * Legacy hook for backward compatibility
 * Maintains the original simple interface while using the new system
 */
export const useCoreFormConfig = () => {
  return useAdvancedCoreConfig();
};