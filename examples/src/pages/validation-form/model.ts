import type { FormModel } from '@dynamic_forms/react';

/**
 * Custom validation functions for advanced validation patterns
 */

/**
 * Email validation with comprehensive format checking
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
 * Password strength validation with multiple criteria
 */
const validatePassword = (value: unknown): string[] => {
  const password = String(value || '');
  const errors: string[] = [];
  
  if (!password) {
    return ['Password is required'];
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return errors;
};

/**
 * Age validation with range checking
 */
const validateAge = (value: unknown): string[] => {
  const age = Number(value);
  
  if (!value || isNaN(age)) {
    return ['Age is required'];
  }
  
  if (age < 18) {
    return ['Must be at least 18 years old'];
  }
  
  if (age > 120) {
    return ['Must be less than 120 years old'];
  }
  
  return [];
};

/**
 * Username validation with format and length rules
 */
const validateUsername = (value: unknown): string[] => {
  const username = String(value || '').trim();
  
  if (!username) {
    return ['Username is required'];
  }
  
  if (username.length < 3) {
    return ['Username must be at least 3 characters'];
  }
  
  if (username.length > 20) {
    return ['Username must be less than 20 characters'];
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return ['Username can only contain letters, numbers, and underscores'];
  }
  
  if (/^[0-9]/.test(username)) {
    return ['Username cannot start with a number'];
  }
  
  return [];
};

/**
 * Confirm password validation (simplified - in real app would check against password field)
 */
const validateConfirmPassword = (value: unknown): string[] => {
  const confirmPassword = String(value || '');
  
  if (!confirmPassword) {
    return ['Please confirm your password'];
  }
  
  // Note: In real implementation, we'd need access to other field values
  // This is a simplified version for demonstration
  return [];
};

/**
 * Advanced validation form model with comprehensive validation rules
 */
export const validationFormModel: FormModel = [
  {
    key: 'email',
    type: 'text',
    label: 'Email Address',
    validators: {
      custom: validateEmail
    }
  },
  {
    key: 'password',
    type: 'text', // Note: In real app, you'd want type: 'password'
    label: 'Password',
    validators: {
      custom: validatePassword
    }
  },
  {
    key: 'confirmPassword',
    type: 'text',
    label: 'Confirm Password',
    validators: {
      custom: validateConfirmPassword
    }
  },
  {
    key: 'age',
    type: 'number',
    label: 'Age',
    validators: {
      custom: validateAge
    }
  },
  {
    key: 'username',
    type: 'text',
    label: 'Username',
    validators: {
      custom: validateUsername
    }
  }
];

/**
 * Initial form values
 */
export const initialValidationValues = {
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  username: ''
};

/**
 * Form submission handler
 */
export const handleValidationSubmit = async (values: any) => {
  console.log('🔍 Advanced validation form submitted:', values);
  
  // Cross-field validation for password confirmation
  if (values.password !== values.confirmPassword) {
    console.log('❌ Passwords do not match');
    return { success: false, error: 'Passwords do not match' };
  }
  
  console.log('✅ All validations passed!');
  return { success: true, data: values };
};

/**
 * Export validation functions for testing or reuse
 */
export const validationFunctions = {
  validateEmail,
  validatePassword,
  validateAge,
  validateUsername,
  validateConfirmPassword
}; 