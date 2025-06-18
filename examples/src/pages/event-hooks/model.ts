import type { FormModel } from 'react-form-builder-ts';

/**
 * Analytics event tracking interface
 */
export interface AnalyticsEvent {
  id: string;
  type: string;
  field?: string;
  value?: unknown;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Event types for tracking
 */
export const EVENT_TYPES = {
  FIELD_CHANGE: 'field_change',
  FIELD_FOCUS: 'field_focus',
  FIELD_BLUR: 'field_blur',
  VALIDATION_ERROR: 'validation_error',
  EMAIL_DOMAIN_ENTERED: 'email_domain_entered',
  PASSWORD_STRENGTH_CHECK: 'password_strength_check',
  FORM_SUBMIT_ATTEMPT: 'form_submit_attempt',
  FORM_SUBMIT_SUCCESS: 'form_submit_success'
} as const;

/**
 * Username validation function
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
  
  return [];
};

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
 * Password validation function
 */
const validatePassword = (value: unknown): string[] => {
  const password = String(value || '');
  
  if (!password) {
    return ['Password is required'];
  }
  
  if (password.length < 8) {
    return ['Password must be at least 8 characters'];
  }
  
  return [];
};

/**
 * Events form model with comprehensive tracking
 */
export const eventsFormModel: FormModel = [
  {
    key: 'username',
    type: 'text',
    label: 'Username',
    validators: {
      custom: validateUsername
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
    key: 'password',
    type: 'text', // Note: In real app, you'd want type: 'password'
    label: 'Password',
    validators: {
      custom: validatePassword
    }
  },
  {
    key: 'terms',
    type: 'select',
    label: 'I agree to the Terms of Service',
    validators: {
      required: true
    },
    options: async () => [
      { value: 'true', label: 'Yes, I agree' },
      { value: 'false', label: 'No' }
    ]
  }
];

/**
 * Initial form values
 */
export const initialEventValues = {
  username: '',
  email: '',
  password: '',
  terms: false
};

/**
 * Creates a new analytics event object
 */
export const createAnalyticsEvent = (
  type: string, 
  field?: string, 
  value?: unknown, 
  metadata: Record<string, unknown> = {}
): AnalyticsEvent => ({
  id: `${Date.now()}-${Math.random()}`,
  type,
  timestamp: new Date(),
  field,
  value,
  metadata
});

/**
 * Password strength analysis
 */
export const analyzePasswordStrength = (password: string) => ({
  length: password.length,
  hasNumbers: /\d/.test(password),
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  score: calculatePasswordScore(password)
});

/**
 * Calculate password strength score
 */
const calculatePasswordScore = (password: string): number => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  return score;
};

/**
 * Email domain extraction
 */
export const extractEmailDomain = (email: string): string | null => {
  const match = email.match(/@(.+)$/);
  return match ? match[1] : null;
};

/**
 * Handles form submission and generates a submission event
 */
export const handleEventSubmit = async (values: any, analyticsEvents: AnalyticsEvent[]) => {
  console.log('🔥 Event hooks form submitted:', values);
  
  const submitEvent = createAnalyticsEvent(
    EVENT_TYPES.FORM_SUBMIT_SUCCESS, 
    undefined, 
    values, 
    {
      totalEvents: analyticsEvents.length,
      completionTime: Date.now() - (analyticsEvents[0]?.timestamp.getTime() || Date.now()),
      fieldInteractions: analyticsEvents.filter(e => e.type === EVENT_TYPES.FIELD_CHANGE).length,
      validationErrors: analyticsEvents.filter(e => e.type === EVENT_TYPES.VALIDATION_ERROR).length
    }
  );
  
  return { success: true, data: values, analyticsEvent: submitEvent };
}; 