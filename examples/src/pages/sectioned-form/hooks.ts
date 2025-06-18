import { useForm, useSections } from '@dynamic_forms/react';
import { formModel, sectionedModel } from './model';

/**
 * Custom hook for the sectioned form demo
 */
export function useSectionedFormDemo() {
  // Initialize form with default values
  const form = useForm(formModel, {
    initialValues: {
      firstName: 'John',
      lastName: 'Doe',
      newsletter: true
    }
  });

  // Initialize sections with custom options
  const sections = useSections(sectionedModel, form, {
    defaultCollapsed: false,
    autoHideEmptySections: false
  });

  // Calculate overall progress
  const allProgress = sections.getAllProgress();
  const overallProgress = {
    completed: allProgress.reduce((sum, p) => sum + p.completed, 0),
    total: allProgress.reduce((sum, p) => sum + p.total, 0),
    hasErrors: allProgress.some(p => p.hasErrors)
  };
  
  const overallPercentage = overallProgress.total > 0 
    ? Math.round((overallProgress.completed / overallProgress.total) * 100) 
    : 0;

  return {
    form,
    sections,
    allProgress,
    overallProgress: {
      ...overallProgress,
      percentage: overallPercentage
    }
  };
}

/**
 * Hook for headerless form demo
 */
export function useHeaderlessFormDemo() {
  const form = useForm(formModel);
  const sections = useSections(formModel, form);

  return {
    form,
    sections
  };
}

/**
 * Hook for flat form demo
 */
export function useFlatFormDemo() {
  const form = useForm(formModel);
  const sections = useSections(formModel, form);

  return {
    form,
    sections
  };
} 