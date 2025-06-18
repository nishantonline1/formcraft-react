// Using `any` as a workaround for a persistent build issue with FormModel import.
// import type { FormModel } from '@dynamic_forms/react';
type FormModel = any[];

/**
 * Step interface for multi-step form
 */
export interface FormStep {
  id: string;
  title: string;
  completed: boolean;
}

/**
 * Personal information validation functions
 */
const validateEmail = (value: unknown): string[] => {
  const email = String(value || '').trim();
  
  if (!email) {
    return ['Email is required'];
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ['Please enter a valid email address'];
  }
  
  return [];
};

const validatePhone = (value: unknown): string[] => {
  const phone = String(value || '').trim();
  
  if (!phone) {
    return ['Phone number is required'];
  }
  
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return ['Please enter a valid phone number'];
  }
  
  return [];
};

/**
 * Bio validation function
 */
const validateBio = (value: unknown): string[] => {
  const bio = String(value || '').trim();
  
  if (bio.length > 500) {
    return ['Bio must be less than 500 characters'];
  }
  
  return [];
};

/**
 * Step 1: Personal Information Form Model
 */
export const personalInfoModel: FormModel = [
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    validators: {
      required: true
    }
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    validators: {
      required: true
    }
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email Address',
    validators: {
      custom: validateEmail
    }
  },
  {
    key: 'phone',
    type: 'text',
    label: 'Phone Number',
    validators: {
      custom: validatePhone
    }
  }
];

/**
 * Step 2: Account Preferences Form Model
 */
export const accountPreferencesModel: FormModel = [
  {
    key: 'accountType',
    type: 'select',
    label: 'Account Type',
    validators: {
      required: true
    },
    options: async () => [
      { value: 'personal', label: 'Personal Account' },
      { value: 'business', label: 'Business Account' },
      { value: 'premium', label: 'Premium Account' }
    ]
  },
  {
    key: 'preferences',
    type: 'select',
    label: 'Communication Preferences',
    validators: {
      required: true
    },
    options: async () => [
      { value: 'email', label: 'Email Only' },
      { value: 'sms', label: 'SMS Only' },
      { value: 'both', label: 'Email & SMS' },
      { value: 'none', label: 'No Communications' }
    ]
  },
  {
    key: 'bio',
    type: 'text',
    label: 'About You',
    validators: {
      custom: validateBio
    }
  }
];

/**
 * Combined model for the entire multi-step form
 */
export const multiStepFormModel: FormModel = [
  ...personalInfoModel,
  ...accountPreferencesModel,
  // Add fields from other steps if they exist
  {
    key: 'address',
    type: 'text',
    label: 'Address',
    validators: { required: true },
  },
  {
    key: 'city',
    type: 'text',
    label: 'City',
    validators: { required: true },
  },
  {
    key: 'zipCode',
    type: 'text',
    label: 'Zip Code',
    validators: { required: true, pattern: /^\d{5}$/ },
  },
  {
    key: 'username',
    type: 'text',
    label: 'Username',
    validators: { required: true, min: 3 },
  },
  {
    key: 'password',
    type: 'text',
    label: 'Password',
    validators: { required: true, min: 8 },
  },
];

/**
 * Initial values for each step
 */
export const initialPersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
};

export const initialAccountPreferences = {
  accountType: '',
  preferences: '',
  bio: ''
};

/**
 * Combined initial values for the entire form
 */
export const initialMultiStepValues = {
  ...initialPersonalInfo,
  ...initialAccountPreferences,
  address: '',
  city: '',
  zipCode: '',
  username: '',
  password: '',
};

/**
 * Form submission handler
 */
export const handleMultiStepSubmit = async (formData: Record<string, any>) => {
  console.log('🚀 Multi-step form submitted:', formData);
  
  // Simulate API call
  await new Promise(resolve => resolve(undefined));
  
  return { success: true, data: formData };
}; 