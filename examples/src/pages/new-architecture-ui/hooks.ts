import { useMemo } from 'react';
import { useForm } from '@dynamic_forms/react';
import type { FormValues } from '@dynamic_forms/react';
import { newArchitectureFormModel, initialValues } from './model';

/**
 * Hook demonstrating the new architecture with useForm
 * Shows how to use the refactored library with UI components
 */
export const useNewArchitectureForm = () => {
  const formConfig = useForm(newArchitectureFormModel, {
    initialValues,
    formId: 'new-architecture-demo',
    enableAnalytics: true,
    eventHooks: {
      onFieldChange: (path: string, value: any) => {
        console.log(`Field ${path} changed to:`, value);
      },
      onFieldBlur: (path: string) => {
        console.log(`Field ${path} blurred`);
      }
    }
  });

  const handleSubmit = async (values: FormValues) => {
    console.log('New architecture form submitted:', values);

    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate occasional failures for demo purposes
    if (Math.random() < 0.1) {
      throw new Error('Simulated submission failure');
    }

    return {
      success: true,
      data: values,
      projectId: `proj_${Date.now()}`,
      estimatedCost: calculateEstimatedCost(values),
      recommendations: generateRecommendations(values)
    };
  };

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const { values } = formConfig;
    const estimatedCost = calculateEstimatedCost(values);
    const complexity = calculateComplexity(values);
    const riskLevel = calculateRiskLevel(values);

    return {
      estimatedCost,
      complexity,
      riskLevel,
      estimatedDuration: values.timeline || 0,
      teamProductivity: calculateTeamProductivity(values)
    };
  }, [formConfig.values]);

  // Form validation and state
  const formState = useMemo(() => {
    const { errors, touched, values } = formConfig;
    const hasErrors = Object.keys(errors).some(key => errors[key]?.length > 0);
    const isFormTouched = Object.keys(touched).length > 0;
    const isFormDirty = Object.keys(values).some(key => {
      const currentValue = values[key];
      const initialValue = initialValues[key as keyof typeof initialValues];
      return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
    });

    const completionPercentage = calculateCompletionPercentage(values);

    return {
      isValid: !hasErrors,
      hasErrors,
      isFormTouched,
      isFormDirty,
      canSubmit: !hasErrors && (isFormDirty || isFormTouched),
      completionPercentage,
      errorCount: Object.keys(errors).filter(key => errors[key]?.length > 0).length,
      touchedCount: Object.keys(touched).filter(key => touched[key]).length
    };
  }, [formConfig.errors, formConfig.touched, formConfig.values]);

  // Field statistics
  const fieldStats = useMemo(() => {
    const fields = formConfig.config?.fields || [];

    return {
      totalFields: fields.length,
      visibleFields: fields.filter(field => formConfig.isFieldVisible(field.path)).length,
      requiredFields: fields.filter(field => field.validators?.required).length,
      optionalFields: fields.filter(field => !field.validators?.required).length,
      fieldsWithDependencies: fields.filter(field => field.dependencies).length,
      arrayFields: fields.filter(field => field.type === 'array').length
    };
  }, [formConfig]);

  return {
    ...formConfig,
    handleSubmit,
    projectStats,
    formState,
    fieldStats
  };
};

/**
 * Calculate estimated project cost based on form values
 */
function calculateEstimatedCost(values: FormValues): number {
  const baseCost = values.budget || 0;
  const timelineMultiplier = Math.max(0.5, Math.min(2, Number(values.timeline || 12) / 12));
  const teamSizeMultiplier = Math.max(0.8, Math.min(1.5, Number(values.teamSize || 1) / 3));

  let complexityMultiplier = 1;
  if (values.projectType === 'api') complexityMultiplier = 0.8;
  if (values.projectType === 'mobile') complexityMultiplier = 1.2;
  if (values.projectType === 'desktop') complexityMultiplier = 1.1;

  const featureCount = Array.isArray(values.features) ? values.features.length : 0;
  const featureMultiplier = Math.max(0.8, Math.min(1.5, featureCount / 5));

  return Math.round(Number(baseCost) * timelineMultiplier * teamSizeMultiplier * complexityMultiplier * featureMultiplier);
}

/**
 * Calculate project complexity score
 */
function calculateComplexity(values: FormValues): 'Low' | 'Medium' | 'High' | 'Very High' {
  let score = 0;

  // Project type complexity
  const typeScores = { web: 1, api: 1, mobile: 2, desktop: 2 };
  score += typeScores[values.projectType as keyof typeof typeScores] || 0;

  // Feature count
  const featureCount = Array.isArray(values.features) ? values.features.length : 0;
  score += Math.min(3, Math.floor(featureCount / 2));

  // Team size impact
  if (values.teamSize > 10) score += 2;
  else if (values.teamSize > 5) score += 1;

  // Timeline pressure
  if (values.timeline < 8) score += 2;
  else if (values.timeline < 16) score += 1;

  // Experience level
  const expScores = { junior: 2, mid: 1, senior: 0, mixed: 1 };
  score += expScores[values.experience as keyof typeof expScores] || 0;

  if (score <= 2) return 'Low';
  if (score <= 4) return 'Medium';
  if (score <= 6) return 'High';
  return 'Very High';
}

/**
 * Calculate project risk level
 */
function calculateRiskLevel(values: FormValues): 'Low' | 'Medium' | 'High' {
  let riskScore = 0;

  // Timeline pressure
  if (values.hasDeadline && values.timeline < 12) riskScore += 2;

  // Budget constraints
  if (values.budget < 5000) riskScore += 1;
  if (values.budget > 100000) riskScore += 1;

  // Team experience
  if (values.experience === 'junior') riskScore += 2;
  if (values.experience === 'mixed') riskScore += 1;

  // Priority level
  if (values.priority === 'urgent') riskScore += 2;
  if (values.priority === 'high') riskScore += 1;

  // Feature complexity
  const featureCount = Array.isArray(values.features) ? values.features.length : 0;
  if (featureCount > 8) riskScore += 1;

  if (riskScore <= 2) return 'Low';
  if (riskScore <= 4) return 'Medium';
  return 'High';
}

/**
 * Calculate team productivity score
 */
function calculateTeamProductivity(values: FormValues): number {
  let productivity = 1.0;

  // Experience multiplier
  const expMultipliers = { junior: 0.7, mid: 1.0, senior: 1.3, mixed: 0.9 };
  productivity *= expMultipliers[values.experience as keyof typeof expMultipliers] || 1.0;

  // Team size efficiency
  const teamSize = values.teamSize || 1;
  if (teamSize <= 3) productivity *= 1.1;
  else if (teamSize <= 7) productivity *= 1.0;
  else productivity *= 0.9;

  // Priority focus
  if (values.priority === 'high' || values.priority === 'urgent') {
    productivity *= 1.1;
  }

  return Math.round(productivity * 100) / 100;
}

/**
 * Calculate form completion percentage
 */
function calculateCompletionPercentage(values: FormValues): number {
  const requiredFields = [
    'projectType', 'projectName', 'framework', 'language',
    'budget', 'timeline', 'priority', 'teamSize', 'experience'
  ];

  const optionalFields = ['description', 'features', 'deadline'];

  let completed = 0;
  let total = requiredFields.length + optionalFields.length;

  // Check required fields
  requiredFields.forEach(field => {
    const value = values[field];
    if (value !== undefined && value !== '' && value !== null) {
      completed++;
    }
  });

  // Check optional fields
  optionalFields.forEach(field => {
    const value = values[field];
    if (field === 'features') {
      if (Array.isArray(value) && value.length > 0) completed++;
    } else if (field === 'deadline') {
      if (values.hasDeadline && value) completed++;
      else if (!values.hasDeadline) completed++; // Not applicable
    } else if (value !== undefined && value !== '' && value !== null) {
      completed++;
    }
  });

  return Math.round((completed / total) * 100);
}

/**
 * Generate project recommendations based on form values
 */
function generateRecommendations(values: FormValues): string[] {
  const recommendations: string[] = [];

  // Timeline recommendations
  if (values.timeline < 8) {
    recommendations.push('Consider extending timeline to reduce project risk');
  }

  // Budget recommendations
  if (values.budget < 10000) {
    recommendations.push('Budget may be insufficient for project scope');
  }

  // Team recommendations
  if (values.experience === 'junior' && values.teamSize > 5) {
    recommendations.push('Consider adding senior developers for mentorship');
  }

  // Feature recommendations
  const featureCount = Array.isArray(values.features) ? values.features.length : 0;
  if (featureCount > 10) {
    recommendations.push('Consider prioritizing features for MVP approach');
  }

  // Technology recommendations
  if (values.projectType === 'web' && values.framework === 'react') {
    recommendations.push('Great choice! React has excellent ecosystem support');
  }

  return recommendations;
}