import type { FormModel } from '@dynamic_forms/react';

/**
 * Form model demonstrating the new architecture with UI components
 * Shows complex form scenarios with the refactored library
 */
export const newArchitectureFormModel: FormModel = [
  {
    key: 'projectType',
    type: 'select',
    label: 'Project Type',
    validators: { required: true },
    options: async () => [
      { value: 'web', label: 'Web Application' },
      { value: 'mobile', label: 'Mobile Application' },
      { value: 'desktop', label: 'Desktop Application' },
      { value: 'api', label: 'API Service' }
    ]
  },
  {
    key: 'projectName',
    type: 'text',
    label: 'Project Name',
    validators: {
      required: true,
      min: 3,
      max: 50
    }
  },
  {
    key: 'description',
    type: 'text',
    label: 'Description',
    validators: { max: 500 }
  },
  {
    key: 'budget',
    type: 'number',
    label: 'Budget ($)',
    validators: {
      required: true,
      min: 1000,
      max: 1000000
    }
  },
  {
    key: 'timeline',
    type: 'number',
    label: 'Timeline (weeks)',
    validators: {
      required: true,
      min: 1,
      max: 104
    }
  },
  {
    key: 'priority',
    type: 'select',
    label: 'Priority Level',
    validators: { required: true },
    options: async () => [
      { value: 'low', label: 'Low Priority' },
      { value: 'medium', label: 'Medium Priority' },
      { value: 'high', label: 'High Priority' },
      { value: 'urgent', label: 'Urgent' }
    ]
  },
  {
    key: 'teamSize',
    type: 'number',
    label: 'Team Size',
    validators: {
      required: true,
      min: 1,
      max: 50
    }
  },
  {
    key: 'experience',
    type: 'select',
    label: 'Team Experience Level',
    validators: { required: true },
    options: async () => [
      { value: 'junior', label: 'Junior (0-2 years)' },
      { value: 'mid', label: 'Mid-level (2-5 years)' },
      { value: 'senior', label: 'Senior (5+ years)' },
      { value: 'mixed', label: 'Mixed Experience' }
    ]
  }
];

export const initialValues = {
  projectType: '',
  projectName: '',
  description: '',
  budget: 10000,
  timeline: 12,
  priority: 'medium',
  teamSize: 3,
  experience: 'mid'
};