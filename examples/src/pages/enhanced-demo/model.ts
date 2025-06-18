import type { FormModel } from 'react-form-builder-ts';
import type { SectionedFormModel } from '../../enhanced-hooks';

/**
 * Standard form model for enhanced form demo
 */
export const enhancedFormModel: FormModel = [
  {
    key: 'username',
    type: 'text',
    label: 'Username',
    validators: { 
      required: true,
      min: 3,
      max: 20,
      pattern: /^[a-zA-Z0-9_]+$/
    }
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email Address',
    validators: { 
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  {
    key: 'password',
    type: 'text',
    label: 'Password',
    validators: {
      required: true,
      min: 8
    }
  }
];

/**
 * Sectioned form model demonstrating section organization
 */
export const sectionedDemoModel: SectionedFormModel = {
  layout: {
    orientation: 'vertical',
    className: 'demo-sectioned-form'
  },
  sections: [
    {
      id: 'account',
      title: 'Account Information',
      description: 'Basic account setup information',
      layout: { 
        columns: 2,
        gap: '1rem'
      },
      fields: [
        {
          key: 'firstName',
          type: 'text',
          label: 'First Name',
          validators: { required: true }
        },
        {
          key: 'lastName',
          type: 'text',
          label: 'Last Name',
          validators: { required: true }
        },
        {
          key: 'username',
          type: 'text',
          label: 'Username',
          validators: { 
            required: true,
            min: 3,
            max: 20
          }
        },
        {
          key: 'email',
          type: 'text',
          label: 'Email Address',
          validators: { 
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          }
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      collapsible: true,
      collapsed: false,
      layout: {
        columns: 1,
        gap: '0.75rem'
      },
      fields: [
        {
          key: 'theme',
          type: 'select',
          label: 'Theme Preference',
          options: async () => [
            { value: 'light', label: 'Light Theme' },
            { value: 'dark', label: 'Dark Theme' },
            { value: 'auto', label: 'Auto (System)' }
          ]
        },
        {
          key: 'notifications',
          type: 'select',
          label: 'Email Notifications',
          options: async () => [
            { value: 'all', label: 'All Notifications' },
            { value: 'important', label: 'Important Only' },
            { value: 'none', label: 'None' }
          ]
        }
      ]
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Keep your account secure',
      collapsible: true,
      collapsed: true,
      className: 'security-section',
      fields: [
        {
          key: 'password',
          type: 'text',
          label: 'Password',
          validators: {
            required: true,
            min: 8
          }
        },
        {
          key: 'confirmPassword',
          type: 'text',
          label: 'Confirm Password',
          validators: {
            required: true,
            custom: (value: unknown, values?: Record<string, unknown>) => {
              if (values && value !== values.password) {
                return ['Passwords do not match'];
              }
              return [];
            }
          }
        }
      ]
    }
  ]
};

/**
 * Initial values for enhanced form demo
 */
export const enhancedFormInitialValues = {
  username: '',
  email: '',
  password: ''
};

/**
 * Initial values for sectioned form demo
 */
export const sectionedFormInitialValues = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  theme: 'auto',
  notifications: 'important',
  password: '',
  confirmPassword: ''
};

/**
 * Form submission handler
 */
export async function handleFormSubmission(values: Record<string, unknown>) {
  console.log('Form submitted with values:', values);
  
  // In a real app, this would make an API call
  // await fetch('/api/submit', { method: 'POST', body: JSON.stringify(values) });
  
  // Simulate success
  return { success: true, message: 'Form submitted successfully!' };
} 