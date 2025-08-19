import type { FormModel } from '@dynamic_forms/react';

/**
 * Comprehensive Form Model for Core Configuration Demonstration
 * 
 * This model showcases various field types, validation patterns, and dependency relationships
 * that can be used with the form builder's core configuration approach.
 * 
 * Field Types Demonstrated:
 * - Text fields with pattern validation
 * - Select fields with async options
 * - Number fields with range validation
 * - Checkbox fields for boolean values
 * - Array fields for multi-select scenarios
 * - Conditional fields based on dependencies
 * 
 * Advanced Features:
 * - Cross-field dependencies
 * - Dynamic validation rules
 * - Async option loading
 * - Computed field visibility
 * - Custom validation messages
 */
export const coreConfigFormModel: FormModel = [
  // === BASIC INFORMATION SECTION ===
  {
    key: 'userType',
    type: 'select',
    label: 'User Type',
    placeholder: 'Choose your account type',
    defaultValue: '',
    validators: {
      required: true
    },
    options: async () => [
      { value: 'individual', label: 'Individual User' },
      { value: 'business', label: 'Small Business' },
      { value: 'enterprise', label: 'Enterprise' },
      { value: 'nonprofit', label: 'Non-Profit Organization' }
    ],
    layout: { row: 0, col: 0 }
  },
  
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter your first name',
    validators: {
      required: true,
      min: 2,
      max: 50,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    layout: { row: 1, col: 0 }
  },
  
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Enter your last name',
    validators: {
      required: true,
      min: 2,
      max: 50,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    layout: { row: 1, col: 1 }
  },
  
  {
    key: 'email',
    type: 'text',
    label: 'Email Address',
    placeholder: 'user@example.com',
    validators: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    layout: { row: 2, col: 0 }
  },
  
  {
    key: 'phone',
    type: 'text',
    label: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
    validators: {
      pattern: /^[\+]?[1-9][\d\s\-\(\)]+$/
    },
    layout: { row: 2, col: 1 }
  },
  
  // === ORGANIZATION DETAILS (Conditional Section) ===
  {
    key: 'companyName',
    type: 'text',
    label: 'Company/Organization Name',
    placeholder: 'Enter your company name',
    validators: {
      required: true,
      min: 2,
      max: 100
    },
    dependencies: [
      {
        field: 'userType',
        condition: (value) => ['business', 'enterprise', 'nonprofit'].includes(value as string),
        overrides: { hidden: false }
      }
    ],
    layout: { row: 3, col: 0 }
  },
  
  {
    key: 'industry',
    type: 'select',
    label: 'Industry',
    placeholder: 'Select your industry',
    validators: {
      required: true
    },
    options: async () => [
      { value: 'technology', label: 'Technology' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'finance', label: 'Finance' },
      { value: 'education', label: 'Education' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'retail', label: 'Retail' },
      { value: 'nonprofit', label: 'Non-Profit' },
      { value: 'other', label: 'Other' }
    ],
    dependencies: [
      {
        field: 'userType',
        condition: (value) => ['business', 'enterprise', 'nonprofit'].includes(value as string),
        overrides: { hidden: false }
      }
    ],
    layout: { row: 3, col: 1 }
  },
  
  {
    key: 'employeeCount',
    type: 'select',
    label: 'Number of Employees',
    placeholder: 'Select company size',
    validators: {
      required: true
    },
    options: async () => [
      { value: '1-10', label: '1-10 employees' },
      { value: '11-50', label: '11-50 employees' },
      { value: '51-200', label: '51-200 employees' },
      { value: '201-1000', label: '201-1000 employees' },
      { value: '1000+', label: '1000+ employees' }
    ],
    dependencies: [
      {
        field: 'userType',
        condition: (value) => ['business', 'enterprise'].includes(value as string),
        overrides: { hidden: false }
      }
    ],
    layout: { row: 4, col: 0 }
  },
  
  {
    key: 'annualRevenue',
    type: 'select',
    label: 'Annual Revenue',
    placeholder: 'Select revenue range',
    options: async () => [
      { value: 'under-100k', label: 'Under $100K' },
      { value: '100k-1m', label: '$100K - $1M' },
      { value: '1m-10m', label: '$1M - $10M' },
      { value: '10m-100m', label: '$10M - $100M' },
      { value: 'over-100m', label: 'Over $100M' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ],
    dependencies: [
      {
        field: 'userType',
        condition: (value) => value === 'enterprise',
        overrides: { hidden: false }
      }
    ],
    layout: { row: 4, col: 1 }
  },
  
  // === BUDGET AND FEATURES SECTION ===
  {
    key: 'monthlyBudget',
    type: 'number',
    label: 'Monthly Budget ($)',
    placeholder: 'Enter your monthly budget',
    validators: {
      required: true,
      min: 50,
      max: 100000
    },
    dependencies: [
      {
        field: 'userType',
        condition: (value) => ['business', 'enterprise'].includes(value as string),
        overrides: { hidden: false }
      }
    ],
    layout: { row: 5, col: 0 }
  },
  
  {
    key: 'paymentFrequency',
    type: 'select',
    label: 'Preferred Payment Frequency',
    defaultValue: 'monthly',
    options: async () => [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'annually', label: 'Annually' }
    ],
    dependencies: [
      {
        field: 'monthlyBudget',
        condition: (value) => value && Number(value) > 0,
        overrides: { hidden: false }
      }
    ],
    layout: { row: 5, col: 1 }
  },
  
  {
    key: 'requiredFeatures',
    type: 'array',
    label: 'Required Features',
    placeholder: 'Select all features you need',
    defaultValue: [],
    validators: {
      minItems: 1
    },
    options: async () => [
      { value: 'analytics', label: 'Analytics & Reporting' },
      { value: 'integrations', label: 'Third-party Integrations' },
      { value: 'api', label: 'API Access' },
      { value: 'support', label: '24/7 Support' },
      { value: 'training', label: 'Training & Onboarding' },
      { value: 'customization', label: 'Custom Development' },
      { value: 'security', label: 'Advanced Security' },
      { value: 'compliance', label: 'Compliance Tools' }
    ],
    dependencies: [
      {
        field: 'userType',
        condition: (value) => ['business', 'enterprise'].includes(value as string),
        overrides: { hidden: false }
      }
    ],
    layout: { row: 6, col: 0, span: 2 }
  },
  
  // === PREFERENCES SECTION ===
  {
    key: 'communicationPreferences',
    type: 'array',
    label: 'Communication Preferences',
    placeholder: 'How would you like to be contacted?',
    defaultValue: ['email'],
    options: async () => [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'sms', label: 'SMS' },
      { value: 'newsletter', label: 'Newsletter' },
      { value: 'product-updates', label: 'Product Updates' }
    ],
    layout: { row: 7, col: 0 }
  },
  
  {
    key: 'timezone',
    type: 'select',
    label: 'Timezone',
    placeholder: 'Select your timezone',
    defaultValue: 'UTC',
    options: async () => [
      { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
      { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
      { value: 'UTC-6', label: 'Central Time (UTC-6)' },
      { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
      { value: 'UTC', label: 'UTC' },
      { value: 'UTC+1', label: 'Central European Time (UTC+1)' },
      { value: 'UTC+8', label: 'Asia/Singapore (UTC+8)' }
    ],
    layout: { row: 7, col: 1 }
  },
  
  // === BOOLEAN PREFERENCES ===
  {
    key: 'agreesToTerms',
    type: 'checkbox',
    label: 'I agree to the Terms of Service and Privacy Policy',
    validators: {
      required: true
    },
    layout: { row: 8, col: 0, span: 2 }
  },
  
  {
    key: 'subscribesToNewsletter',
    type: 'checkbox',
    label: 'Subscribe to our newsletter for updates and tips',
    defaultValue: false,
    layout: { row: 9, col: 0, span: 2 }
  },
  
  {
    key: 'allowsDataSharing',
    type: 'checkbox',
    label: 'Allow anonymized usage data to help improve our services',
    defaultValue: true,
    layout: { row: 10, col: 0, span: 2 }
  },
  
  // === CONDITIONAL ADVANCED SECTION ===
  {
    key: 'customRequirements',
    type: 'text',
    label: 'Custom Requirements',
    placeholder: 'Describe any specific needs or requirements...',
    validators: {
      max: 500
    },
    dependencies: [
      {
        field: 'userType',
        condition: (value) => value === 'enterprise',
        overrides: { hidden: false }
      }
    ],
    layout: { row: 11, col: 0, span: 2 }
  },
  
  {
    key: 'implementationTimeline',
    type: 'select',
    label: 'Preferred Implementation Timeline',
    placeholder: 'When do you need this implemented?',
    options: async () => [
      { value: 'immediate', label: 'Immediately' },
      { value: '1-month', label: 'Within 1 month' },
      { value: '3-months', label: 'Within 3 months' },
      { value: '6-months', label: 'Within 6 months' },
      { value: 'flexible', label: 'Timeline is flexible' }
    ],
    dependencies: [
      {
        field: 'userType',
        condition: (value) => ['business', 'enterprise'].includes(value as string),
        overrides: { hidden: false }
      }
    ],
    layout: { row: 12, col: 0 }
  },
  
  {
    key: 'contactMethod',
    type: 'select',
    label: 'Preferred Contact Method for Follow-up',
    defaultValue: 'email',
    options: async () => [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone Call' },
      { value: 'video', label: 'Video Call' },
      { value: 'no-contact', label: 'No follow-up needed' }
    ],
    layout: { row: 12, col: 1 }
  }
];

/**
 * Initial form values with comprehensive defaults
 * These values are used to initialize the form state
 */
export const initialValues = {
  // Basic Information
  userType: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  
  // Organization Details (initially hidden)
  companyName: '',
  industry: '',
  employeeCount: '',
  annualRevenue: '',
  
  // Budget and Features
  monthlyBudget: 0,
  paymentFrequency: 'monthly',
  requiredFeatures: [],
  
  // Preferences
  communicationPreferences: ['email'],
  timezone: 'UTC',
  
  // Boolean Preferences
  agreesToTerms: false,
  subscribesToNewsletter: false,
  allowsDataSharing: true,
  
  // Advanced (Enterprise)
  customRequirements: '',
  implementationTimeline: '',
  contactMethod: 'email'
};

/**
 * Type definition for form data
 * This provides type safety when working with form values
 */
export interface CoreConfigFormData {
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  employeeCount: string;
  annualRevenue: string;
  monthlyBudget: number;
  paymentFrequency: string;
  requiredFeatures: string[];
  communicationPreferences: string[];
  timezone: string;
  agreesToTerms: boolean;
  subscribesToNewsletter: boolean;
  allowsDataSharing: boolean;
  customRequirements: string;
  implementationTimeline: string;
  contactMethod: string;
}

/**
 * Example validation rules for custom validation
 * Shows how to implement complex validation logic
 */
export const customValidationRules = {
  /**
   * Validates that enterprise users have provided company information
   */
  validateEnterpriseRequirements: (values: Partial<CoreConfigFormData>): string[] => {
    const errors: string[] = [];
    
    if (values.userType === 'enterprise') {
      if (!values.companyName) {
        errors.push('Company name is required for enterprise accounts');
      }
      if (!values.industry) {
        errors.push('Industry selection is required for enterprise accounts');
      }
      if (!values.monthlyBudget || values.monthlyBudget < 1000) {
        errors.push('Enterprise accounts require a minimum budget of $1,000/month');
      }
    }
    
    return errors;
  },
  
  /**
   * Validates email uniqueness (simulated)
   */
  validateEmailUniqueness: async (email: string): Promise<string[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingEmails = [
      'admin@example.com',
      'test@demo.com',
      'user@sample.org'
    ];
    
    if (existingEmails.includes(email.toLowerCase())) {
      return ['This email address is already registered'];
    }
    
    return [];
  },
  
  /**
   * Cross-field validation for budget and features
   */
  validateBudgetFeatureAlignment: (values: Partial<CoreConfigFormData>): string[] => {
    const errors: string[] = [];
    const { monthlyBudget, requiredFeatures } = values;
    
    if (monthlyBudget && requiredFeatures) {
      const premiumFeatures = ['api', 'customization', 'support', 'compliance'];
      const selectedPremiumFeatures = requiredFeatures.filter(f => premiumFeatures.includes(f));
      
      if (selectedPremiumFeatures.length > 0 && monthlyBudget < 500) {
        errors.push('Premium features require a minimum budget of $500/month');
      }
    }
    
    return errors;
  }
};

/**
 * Field configuration helpers
 * Utility functions to work with the form model
 */
export const fieldHelpers = {
  /**
   * Get all fields of a specific type
   */
  getFieldsByType: (type: string) => {
    return coreConfigFormModel.filter(field => field.type === type);
  },
  
  /**
   * Get fields that have dependencies
   */
  getConditionalFields: () => {
    return coreConfigFormModel.filter(field => field.dependencies && field.dependencies.length > 0);
  },
  
  /**
   * Get field by key
   */
  getFieldByKey: (key: string) => {
    return coreConfigFormModel.find(field => field.key === key);
  },
  
  /**
   * Get all required fields
   */
  getRequiredFields: () => {
    return coreConfigFormModel.filter(field => field.validators?.required);
  },
  
  /**
   * Get field groups by layout row
   */
  getFieldsByRow: () => {
    const rows: Record<number, typeof coreConfigFormModel> = {};
    
    coreConfigFormModel.forEach(field => {
      const row = field.layout?.row ?? 0;
      if (!rows[row]) rows[row] = [];
      rows[row].push(field);
    });
    
    return rows;
  }
};

/**
 * Example scenarios for testing different form configurations
 * These demonstrate various use cases and edge cases
 */
export const testScenarios = {
  individualUser: {
    userType: 'individual',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    communicationPreferences: ['email'],
    timezone: 'UTC-5',
    agreesToTerms: true,
    subscribesToNewsletter: true,
    allowsDataSharing: false,
    contactMethod: 'email'
  },
  
  smallBusiness: {
    userType: 'business',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@smallbiz.com',
    companyName: 'Small Business Inc.',
    industry: 'retail',
    employeeCount: '11-50',
    monthlyBudget: 299,
    paymentFrequency: 'monthly',
    requiredFeatures: ['analytics', 'integrations'],
    communicationPreferences: ['email', 'phone'],
    timezone: 'UTC-8',
    agreesToTerms: true,
    implementationTimeline: '1-month',
    contactMethod: 'phone'
  },
  
  enterpriseClient: {
    userType: 'enterprise',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@enterprise.com',
    companyName: 'Enterprise Solutions Corp',
    industry: 'technology',
    employeeCount: '1000+',
    annualRevenue: 'over-100m',
    monthlyBudget: 5000,
    paymentFrequency: 'annually',
    requiredFeatures: ['analytics', 'api', 'support', 'customization', 'security', 'compliance'],
    communicationPreferences: ['email', 'phone'],
    timezone: 'UTC-5',
    agreesToTerms: true,
    customRequirements: 'Need SOC 2 compliance and custom SSO integration',
    implementationTimeline: '3-months',
    contactMethod: 'video'
  },
  
  nonprofit: {
    userType: 'nonprofit',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria@nonprofit.org',
    companyName: 'Community Help Foundation',
    industry: 'nonprofit',
    communicationPreferences: ['email', 'newsletter'],
    timezone: 'UTC-7',
    agreesToTerms: true,
    subscribesToNewsletter: true,
    contactMethod: 'email'
  }
};

/**
 * Configuration presets for different use cases
 * Shows how to customize the form model for specific scenarios
 */
export const configurationPresets = {
  /**
   * Minimal configuration for quick setup
   */
  minimal: coreConfigFormModel.filter(field => 
    ['userType', 'firstName', 'lastName', 'email', 'agreesToTerms'].includes(field.key)
  ),
  
  /**
   * Business-focused configuration
   */
  business: coreConfigFormModel.filter(field => 
    !['customRequirements'].includes(field.key)
  ),
  
  /**
   * Full enterprise configuration
   */
  enterprise: coreConfigFormModel, // Full model
  
  /**
   * Individual user configuration (hides business fields)
   */
  individual: coreConfigFormModel.filter(field => {
    const businessFields = ['companyName', 'industry', 'employeeCount', 'annualRevenue', 
                          'monthlyBudget', 'paymentFrequency', 'requiredFeatures', 
                          'customRequirements', 'implementationTimeline'];
    return !businessFields.includes(field.key);
  })
};

export { coreConfigFormModel as default };