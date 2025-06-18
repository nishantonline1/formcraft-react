import type { FormModel } from 'react-form-builder-ts';

/**
 * Account types for dependency logic
 */
export const ACCOUNT_TYPES = {
  PERSONAL: 'personal',
  BUSINESS: 'business', 
  ENTERPRISE: 'enterprise'
} as const;

/**
 * Email validation function
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

/**
 * Tax ID validation function
 */
const validateTaxId = (value: unknown): string[] => {
  const taxId = String(value || '').trim();
  
  if (!taxId) {
    return []; // Optional field
  }
  
  if (!/^\d{2}-\d{7}$/.test(taxId)) {
    return ['Tax ID must be in format XX-XXXXXXX'];
  }
  
  return [];
};

/**
 * Employee count validation function
 */
const validateEmployeeCount = (value: unknown): string[] => {
  const count = Number(value);
  
  if (!value || isNaN(count)) {
    return ['Employee count is required'];
  }
  
  if (count < 1) {
    return ['Must have at least 1 employee'];
  }
  
  if (count > 100000) {
    return ['Please contact enterprise sales for large organizations'];
  }
  
  return [];
};

/**
 * Complete form model with all possible fields
 */
export const allFieldsModel: FormModel = [
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
      { value: 'enterprise', label: 'Enterprise Account' }
    ]
  },
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
  // Business-specific fields
  {
    key: 'companyName',
    type: 'text',
    label: 'Company Name',
    validators: {
      required: true
    }
  },
  {
    key: 'taxId',
    type: 'text',
    label: 'Tax ID / EIN',
    validators: {
      custom: validateTaxId
    }
  },
  {
    key: 'phone',
    type: 'text',
    label: 'Business Phone',
    validators: {
      required: true
    }
  },
  // Enterprise-specific fields
  {
    key: 'department',
    type: 'text',
    label: 'Department',
    validators: {
      required: true
    }
  },
  {
    key: 'employeeCount',
    type: 'number',
    label: 'Number of Employees',
    validators: {
      custom: validateEmployeeCount
    }
  }
];

/**
 * Initial form values
 */
export const initialDependenciesValues = {
  accountType: '',
  firstName: '',
  lastName: '',
  email: '',
  companyName: '',
  taxId: '',
  phone: '',
  department: '',
  employeeCount: ''
};

/**
 * Field visibility logic
 */
export const getVisibleFields = (accountType: string) => {
  const isBusinessAccount = accountType === 'business' || accountType === 'enterprise';
  const isEnterpriseAccount = accountType === 'enterprise';

  return allFieldsModel.filter(field => {
    // Always show basic fields
    if (['accountType', 'firstName', 'lastName', 'email'].includes(field.key)) {
      return true;
    }
    
    // Business fields (for business and enterprise)
    if (['companyName', 'taxId', 'phone'].includes(field.key)) {
      return isBusinessAccount;
    }
    
    // Enterprise-only fields
    if (['department', 'employeeCount'].includes(field.key)) {
      return isEnterpriseAccount;
    }
    
    return false;
  });
};

/**
 * Get field categories for dashboard
 */
export const getFieldCategories = (accountType: string) => {
  const visibleFields = ['accountType', 'firstName', 'lastName', 'email'];
  const requiredFields = ['accountType', 'firstName', 'lastName', 'email'];
  
  const isBusinessAccount = accountType === 'business' || accountType === 'enterprise';
  const isEnterpriseAccount = accountType === 'enterprise';

  if (isBusinessAccount) {
    visibleFields.push('companyName', 'taxId', 'phone');
    requiredFields.push('companyName', 'phone'); // taxId is optional
  }

  if (isEnterpriseAccount) {
    visibleFields.push('department', 'employeeCount');
    requiredFields.push('department', 'employeeCount');
  }

  return {
    visibleFields,
    requiredFields,
    isBusinessAccount,
    isEnterpriseAccount
  };
};

/**
 * Form submission handler
 */
export const handleDependenciesSubmit = async (values: any, accountType: string) => {
  console.log('🔗 Dependencies form submitted:', values);
  
  // Filter out values for hidden fields
  const filteredValues = { ...values };
  
  if (accountType !== 'business' && accountType !== 'enterprise') {
    delete filteredValues.companyName;
    delete filteredValues.taxId;
    delete filteredValues.phone;
  }
  
  if (accountType !== 'enterprise') {
    delete filteredValues.department;
    delete filteredValues.employeeCount;
  }
  
  console.log('📋 Filtered values (visible fields only):', filteredValues);
  return { success: true, data: filteredValues };
}; 