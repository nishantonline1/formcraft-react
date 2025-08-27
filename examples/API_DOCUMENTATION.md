# API Documentation with Examples

This document provides comprehensive API documentation with working examples for the React Form Builder Library's new configuration-first architecture.

## Table of Contents

1. [Core Functions](#core-functions)
2. [React Hooks](#react-hooks)
3. [UI Components](#ui-components)
4. [FormModel Schema](#formmodel-schema)
5. [Advanced Features](#advanced-features)
6. [Migration Examples](#migration-examples)
7. [Performance Optimization](#performance-optimization)

---

## Core Functions

### `createFormConfig(model, options?)`

Generate form configuration without React dependencies. Perfect for server-side rendering or non-React environments.

#### Example: Basic Configuration Generation

```typescript
import { createFormConfig } from '@dynamic_forms/react';

const userModel = [
  {
    key: 'name',
    type: 'text',
    label: 'Full Name',
    validators: { required: true, min: 2 },
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email Address',
    validators: { required: true, pattern: /^\S+@\S+\.\S+$/ },
  },
];

const configResult = createFormConfig(userModel, {
  initialValues: { name: '', email: '' },
  enableDependencies: true,
  enableValidation: true,
  flags: { advancedFeatures: true },
});

// Access generated configuration
console.log('Fields:', configResult.fields);
console.log('Validation:', configResult.validation);
console.log('Dependencies:', configResult.dependencies);
```

#### Example: Server-Side Usage

```typescript
// server.js - Node.js server
import { createFormConfig } from '@dynamic_forms/react';

function generateFormForUser(userId, userPreferences) {
  const dynamicModel = buildModelBasedOnUser(userId, userPreferences);

  const config = createFormConfig(dynamicModel, {
    initialValues: getUserData(userId),
    flags: getUserFeatureFlags(userId),
  });

  return {
    formConfig: config.config,
    fields: config.fields,
    validation: config.validation,
  };
}

// Use with any frontend framework
app.get('/api/form-config/:userId', (req, res) => {
  const formData = generateFormForUser(req.params.userId, req.query);
  res.json(formData);
});
```

#### Return Value: `FormConfigResult`

```typescript
interface FormConfigResult {
  config: EnhancedFormConfig; // Complete form configuration
  fields: ConfigField[]; // Array of processed fields
  lookup: Map<string, ConfigField>; // Field lookup by path
  dependencies: Map<string, DependencyResolution>; // Dependency states
  validation: ValidationUtilities; // Validation functions
  state: FieldStateQueries; // State query functions
}
```

---

## React Hooks

### `useFormConfig(model, options?)`

Enhanced React hook for form state management with the new architecture.

#### Example: Basic Form with New Hook

```typescript
import React from 'react';
import { useFormConfig } from '@dynamic_forms/react';

const contactModel = [
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
    key: 'phone',
    type: 'text',
    label: 'Phone Number',
    validators: { pattern: /^\d{10}$/ }
  }
];

function ContactForm() {
  const form = useFormConfig(contactModel, {
    initialValues: { firstName: '', lastName: '', phone: '' },
    formId: 'contact-form',
    enableAnalytics: true
  });

  const handleSubmit = async (values) => {
    console.log('Submitting:', values);
    // await api.saveContact(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {form.fields.map(field => (
        <div key={field.path}>
          <label>{field.label}</label>
          <input
            type="text"
            value={form.values[field.path] || ''}
            onChange={(e) => form.setValue(field.path, e.target.value)}
            onBlur={() => form.setTouched(field.path, true)}
          />
          {form.errors[field.path] && (
            <span className="error">{form.errors[field.path][0]}</span>
          )}
        </div>
      ))}
      <button type="submit" disabled={!form.isValid}>
        Submit
      </button>
    </form>
  );
}
```

#### Example: Advanced Form with Event Hooks

```typescript
import React from 'react';
import { useFormConfig } from '@dynamic_forms/react';

function AdvancedForm() {
  const form = useFormConfig(formModel, {
    initialValues: { projectType: '', budget: 0 },
    formId: 'project-form',
    enableAnalytics: true,
    eventHooks: {
      onFieldChange: (path, value) => {
        console.log(`Field ${path} changed to:`, value);
        // Track analytics
        analytics.track('field_changed', { field: path, value });
      },
      onFieldFocus: (path) => {
        console.log(`Field ${path} focused`);
        // Show help text or tooltips
        showFieldHelp(path);
      },
      onFieldBlur: (path) => {
        console.log(`Field ${path} blurred`);
        // Hide help text
        hideFieldHelp(path);
      },
      onFormSubmit: (values) => {
        console.log('Form submitted with values:', values);
        analytics.track('form_submitted', { formId: 'project-form', values });
      }
    }
  });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Form fields */}
      <div className="form-stats">
        <p>Form Valid: {form.isValid ? 'Yes' : 'No'}</p>
        <p>Form Dirty: {form.isDirty ? 'Yes' : 'No'}</p>
        <p>Fields Touched: {Object.keys(form.touched).length}</p>
      </div>
    </form>
  );
}
```

#### Return Value: `UseFormConfigReturn`

```typescript
interface UseFormConfigReturn extends FormConfigResult {
  // State
  values: FormValues; // Current form values
  errors: ValidationErrors; // Validation errors
  touched: TouchedFields; // Touched field states
  dynamicOptions: Map<string, OptionItem[]>; // Resolved dynamic options

  // Computed Properties
  isDirty: boolean; // Form has changes
  isValid: boolean; // Form is valid

  // State Management
  setValue: (path: string, value: any) => void;
  setTouched: (path: string, touched?: boolean) => void;
  setError: (path: string, errors: string[]) => void;

  // Event Handlers
  handleChange: (path: string, value: any) => void;
  handleBlur: (path: string) => void;
  handleFocus: (path: string) => void;
  handleSubmit: (onSubmit: SubmitHandler) => SubmitFunction;

  // Array Operations
  addArrayItem: (path: string) => void;
  removeArrayItem: (path: string, index: number) => void;

  // Utilities
  triggerValidation: (fields?: string[]) => Promise<boolean>;
  reset: (values?: FormValues) => void;
  isFieldVisible: (path: string) => boolean;
  isFieldDisabled: (path: string) => boolean;
  getEffectiveField: (path: string) => ConfigField;
}
```

### `useForm(model, options?)` - Backward Compatibility

The original hook, enhanced internally but maintaining the same interface.

#### Example: Existing Code (Still Works)

```typescript
import React from 'react';
import { useForm } from '@dynamic_forms/react';

function ExistingForm() {
  // This code works exactly as before
  const form = useForm(formModel, {
    initialValues: { name: '', email: '' }
  });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Same form implementation as before */}
    </form>
  );
}
```

---

## UI Components

### `FormRenderer`

Renders forms based on configuration and form state.

#### Example: Basic Form Rendering

```typescript
import React from 'react';
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';

function BasicFormWithRenderer() {
  const form = useFormConfig(formModel, {
    initialValues: { name: '', email: '', type: '' }
  });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormRenderer
        form={form}
        config={form.config}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Example: Custom Field Renderers

```typescript
import React from 'react';
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';

// Custom text input component
function CustomTextInput({ field, value, onChange, onBlur, error, touched }) {
  return (
    <div className="custom-field">
      <label className="custom-label">{field.label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`custom-input ${error && touched ? 'error' : ''}`}
        placeholder={field.placeholder}
      />
      {error && touched && (
        <div className="custom-error">{error[0]}</div>
      )}
    </div>
  );
}

// Custom dropdown component
function CustomDropdown({ field, value, onChange, onBlur, options }) {
  return (
    <div className="custom-dropdown">
      <label>{field.label}</label>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormWithCustomRenderers() {
  const form = useFormConfig(formModel, { initialValues });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormRenderer
        form={form}
        config={form.config}
        renderers={{
          text: CustomTextInput,
          select: CustomDropdown
        }}
      />
    </form>
  );
}
```

#### Example: Named Custom Renderers

```typescript
import React from 'react';
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';

// Special field component for specific use cases
function SpecialFieldRenderer({ field, value, onChange, form }) {
  return (
    <div className="special-field">
      <h3>{field.label}</h3>
      <div className="special-controls">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" onClick={() => onChange('auto-generated-value')}>
          Auto Generate
        </button>
      </div>
      <small>This is a special field with custom behavior</small>
    </div>
  );
}

const formModelWithCustomRenderer = [
  {
    key: 'normalField',
    type: 'text',
    label: 'Normal Field'
  },
  {
    key: 'specialField',
    type: 'text',
    label: 'Special Field',
    renderer: 'specialRenderer' // Maps to customRenderers
  }
];

function FormWithNamedRenderers() {
  const form = useFormConfig(formModelWithCustomRenderer, { initialValues });

  return (
    <FormRenderer
      form={form}
      config={form.config}
      customRenderers={{
        specialRenderer: SpecialFieldRenderer
      }}
    />
  );
}
```

### Individual Field Components

Import specific field components for custom usage.

#### Example: Using Individual Components

```typescript
import React from 'react';
import { useFormConfig } from '@dynamic_forms/react';
import {
  TextInput,
  NumberInput,
  Dropdown,
  CheckboxInput
} from '@dynamic_forms/react/ui';

function CustomFormLayout() {
  const form = useFormConfig(formModel, { initialValues });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="form-section">
        <h2>Personal Information</h2>
        <TextInput
          field={form.getEffectiveField('firstName')}
          value={form.values.firstName}
          onChange={(value) => form.setValue('firstName', value)}
          onBlur={() => form.setTouched('firstName', true)}
          error={form.errors.firstName}
          touched={form.touched.firstName}
        />
        <TextInput
          field={form.getEffectiveField('lastName')}
          value={form.values.lastName}
          onChange={(value) => form.setValue('lastName', value)}
          onBlur={() => form.setTouched('lastName', true)}
          error={form.errors.lastName}
          touched={form.touched.lastName}
        />
      </div>

      <div className="form-section">
        <h2>Preferences</h2>
        <Dropdown
          field={form.getEffectiveField('country')}
          value={form.values.country}
          onChange={(value) => form.setValue('country', value)}
          options={form.dynamicOptions.get('country') || []}
        />
        <CheckboxInput
          field={form.getEffectiveField('newsletter')}
          value={form.values.newsletter}
          onChange={(value) => form.setValue('newsletter', value)}
        />
      </div>
    </form>
  );
}
```

### Providers

#### Example: Using Providers

```typescript
import React from 'react';
import {
  FormProvider,
  AnalyticsProvider,
  FormWrapper
} from '@dynamic_forms/react/ui';

const messages = {
  'validation.required': 'This field is required',
  'validation.email': 'Please enter a valid email address',
  'validation.min': 'Minimum length is {min} characters'
};

function handleAnalyticsEvent(eventName, data) {
  console.log('Analytics Event:', eventName, data);
  // Send to your analytics service
  analytics.track(eventName, data);
}

function AppWithProviders() {
  return (
    <FormProvider locale="en" messages={messages}>
      <AnalyticsProvider onEvent={handleAnalyticsEvent}>
        <div className="app">
          <FormWrapper title="User Registration" loading={false}>
            <MyFormComponent />
          </FormWrapper>
        </div>
      </AnalyticsProvider>
    </FormProvider>
  );
}
```

---

## FormModel Schema

### Basic Field Types

#### Text Field

```typescript
{
  key: 'username',
  type: 'text',
  label: 'Username',
  placeholder: 'Enter your username',
  validators: {
    required: true,
    min: 3,
    max: 20,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  layout: {
    row: 0,
    col: 0,
    colSpan: 1
  },
  meta: {
    analyticsId: 'username-field',
    helpText: 'Username must be 3-20 characters, letters, numbers, and underscores only'
  }
}
```

#### Number Field

```typescript
{
  key: 'age',
  type: 'number',
  label: 'Age',
  validators: {
    required: true,
    min: 18,
    max: 120
  },
  layout: {
    row: 1,
    col: 0,
    colSpan: 1
  }
}
```

#### Select Field with Static Options

```typescript
{
  key: 'country',
  type: 'select',
  label: 'Country',
  validators: { required: true },
  options: () => Promise.resolve([
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' }
  ])
}
```

#### Date Field

```typescript
{
  key: 'birthDate',
  type: 'date',
  label: 'Date of Birth',
  validators: {
    required: true,
    custom: (value) => {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 18 ? [] : ['Must be at least 18 years old'];
    }
  }
}
```

#### Checkbox Field

```typescript
{
  key: 'agreeToTerms',
  type: 'checkbox',
  label: 'I agree to the Terms and Conditions',
  validators: {
    custom: (value) => value === true ? [] : ['You must agree to the terms']
  }
}
```

### Advanced Field Features

#### Dynamic Options

```typescript
{
  key: 'state',
  type: 'select',
  label: 'State/Province',
  validators: { required: true },
  dynamicOptions: {
    trigger: ['country'], // Reload when country changes
    loader: async (values) => {
      if (values.country === 'us') {
        return [
          { value: 'ca', label: 'California' },
          { value: 'ny', label: 'New York' },
          { value: 'tx', label: 'Texas' }
        ];
      } else if (values.country === 'ca') {
        return [
          { value: 'on', label: 'Ontario' },
          { value: 'bc', label: 'British Columbia' },
          { value: 'qc', label: 'Quebec' }
        ];
      }
      return [];
    }
  }
}
```

#### Field Dependencies

```typescript
{
  key: 'otherIncome',
  type: 'number',
  label: 'Other Income Amount',
  hidden: true, // Hidden by default
  validators: { required: true, min: 0 },
  dependencies: [
    {
      field: 'hasOtherIncome',
      condition: (value) => value === true,
      overrides: {
        hidden: false, // Show when hasOtherIncome is true
        validators: { required: true, min: 1 }
      }
    }
  ]
}
```

#### Array Fields

```typescript
{
  key: 'workExperience',
  type: 'array',
  label: 'Work Experience',
  validators: { minItems: 1, maxItems: 5 },
  itemModel: [
    {
      key: 'company',
      type: 'text',
      label: 'Company Name',
      validators: { required: true }
    },
    {
      key: 'position',
      type: 'text',
      label: 'Position',
      validators: { required: true }
    },
    {
      key: 'startDate',
      type: 'date',
      label: 'Start Date',
      validators: { required: true }
    },
    {
      key: 'endDate',
      type: 'date',
      label: 'End Date'
    },
    {
      key: 'current',
      type: 'checkbox',
      label: 'Current Position'
    }
  ]
}
```

#### Feature Flags

```typescript
{
  key: 'betaFeature',
  type: 'text',
  label: 'Beta Feature Field',
  flags: {
    betaFeatures: true, // Only show if betaFeatures flag is enabled
    premiumUser: true   // AND premiumUser flag is enabled
  }
}
```

### Custom Validation

#### Complex Validation Example

```typescript
{
  key: 'password',
  type: 'text',
  label: 'Password',
  validators: {
    required: true,
    min: 8,
    custom: (value) => {
      const errors = [];

      if (!/[A-Z]/.test(value)) {
        errors.push('Password must contain at least one uppercase letter');
      }

      if (!/[a-z]/.test(value)) {
        errors.push('Password must contain at least one lowercase letter');
      }

      if (!/\d/.test(value)) {
        errors.push('Password must contain at least one number');
      }

      if (!/[!@#$%^&*]/.test(value)) {
        errors.push('Password must contain at least one special character');
      }

      return errors;
    }
  }
}
```

---

## Advanced Features

### Form State Management

#### Example: Managing Complex Form State

```typescript
import React, { useEffect } from 'react';
import { useFormConfig } from '@dynamic_forms/react';

function ComplexFormStateExample() {
  const form = useFormConfig(formModel, {
    initialValues: { projectType: '', budget: 0, features: [] },
    formId: 'project-calculator'
  });

  // Watch for changes and update related fields
  useEffect(() => {
    if (form.values.projectType === 'enterprise') {
      // Auto-set minimum budget for enterprise projects
      if (form.values.budget < 50000) {
        form.setValue('budget', 50000);
      }
    }
  }, [form.values.projectType]);

  // Calculate estimated timeline based on features
  const estimatedTimeline = React.useMemo(() => {
    const baseTime = form.values.projectType === 'enterprise' ? 12 : 6;
    const featureTime = (form.values.features || []).length * 2;
    return baseTime + featureTime;
  }, [form.values.projectType, form.values.features]);

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Form fields */}
      </form>

      <div className="form-insights">
        <h3>Project Insights</h3>
        <p>Estimated Timeline: {estimatedTimeline} weeks</p>
        <p>Form Completion: {Math.round((Object.keys(form.touched).length / form.fields.length) * 100)}%</p>
        <p>Validation Status: {form.isValid ? 'Valid' : 'Invalid'}</p>
      </div>
    </div>
  );
}
```

### Array Field Management

#### Example: Dynamic Array Operations

```typescript
import React from 'react';
import { useFormConfig } from '@dynamic_forms/react';

const teamMemberModel = [
  {
    key: 'teamMembers',
    type: 'array',
    label: 'Team Members',
    validators: { minItems: 1, maxItems: 10 },
    itemModel: [
      {
        key: 'name',
        type: 'text',
        label: 'Name',
        validators: { required: true }
      },
      {
        key: 'role',
        type: 'select',
        label: 'Role',
        validators: { required: true },
        options: () => Promise.resolve([
          { value: 'developer', label: 'Developer' },
          { value: 'designer', label: 'Designer' },
          { value: 'manager', label: 'Project Manager' }
        ])
      },
      {
        key: 'email',
        type: 'text',
        label: 'Email',
        validators: { required: true, pattern: /^\S+@\S+\.\S+$/ }
      }
    ]
  }
];

function TeamManagementForm() {
  const form = useFormConfig(teamMemberModel, {
    initialValues: {
      teamMembers: [
        { name: '', role: '', email: '' } // Start with one empty member
      ]
    }
  });

  const addTeamMember = () => {
    form.addArrayItem('teamMembers');
  };

  const removeTeamMember = (index) => {
    form.removeArrayItem('teamMembers', index);
  };

  const teamMembers = form.values.teamMembers || [];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <h2>Team Members ({teamMembers.length})</h2>

      {teamMembers.map((member, index) => (
        <div key={index} className="team-member">
          <h3>Member {index + 1}</h3>

          <input
            type="text"
            placeholder="Name"
            value={member.name || ''}
            onChange={(e) => form.setValue(`teamMembers.${index}.name`, e.target.value)}
          />

          <select
            value={member.role || ''}
            onChange={(e) => form.setValue(`teamMembers.${index}.role`, e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Project Manager</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            value={member.email || ''}
            onChange={(e) => form.setValue(`teamMembers.${index}.email`, e.target.value)}
          />

          {teamMembers.length > 1 && (
            <button type="button" onClick={() => removeTeamMember(index)}>
              Remove Member
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addTeamMember} disabled={teamMembers.length >= 10}>
        Add Team Member
      </button>

      <button type="submit" disabled={!form.isValid}>
        Save Team
      </button>
    </form>
  );
}
```

### Validation Management

#### Example: Custom Validation with Dependencies

```typescript
import React from 'react';
import { useFormConfig } from '@dynamic_forms/react';

const registrationModel = [
  {
    key: 'email',
    type: 'text',
    label: 'Email',
    validators: {
      required: true,
      pattern: /^\S+@\S+\.\S+$/,
      custom: async (value) => {
        // Async validation - check if email exists
        try {
          const response = await fetch(`/api/check-email?email=${value}`);
          const data = await response.json();
          return data.exists ? ['Email already exists'] : [];
        } catch (error) {
          return ['Unable to verify email'];
        }
      }
    }
  },
  {
    key: 'password',
    type: 'text',
    label: 'Password',
    validators: {
      required: true,
      min: 8,
      custom: (value) => {
        const errors = [];
        if (!/[A-Z]/.test(value)) errors.push('Must contain uppercase letter');
        if (!/[a-z]/.test(value)) errors.push('Must contain lowercase letter');
        if (!/\d/.test(value)) errors.push('Must contain number');
        return errors;
      }
    }
  },
  {
    key: 'confirmPassword',
    type: 'text',
    label: 'Confirm Password',
    validators: {
      required: true,
      custom: (value, allValues) => {
        return value === allValues.password ? [] : ['Passwords do not match'];
      }
    }
  }
];

function RegistrationForm() {
  const form = useFormConfig(registrationModel, {
    initialValues: { email: '', password: '', confirmPassword: '' }
  });

  // Trigger validation for confirmPassword when password changes
  React.useEffect(() => {
    if (form.values.password && form.touched.confirmPassword) {
      form.triggerValidation(['confirmPassword']);
    }
  }, [form.values.password]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {form.fields.map(field => (
        <div key={field.path}>
          <label>{field.label}</label>
          <input
            type={field.key.includes('password') ? 'password' : 'text'}
            value={form.values[field.path] || ''}
            onChange={(e) => form.setValue(field.path, e.target.value)}
            onBlur={() => form.setTouched(field.path, true)}
          />
          {form.errors[field.path] && form.touched[field.path] && (
            <div className="errors">
              {form.errors[field.path].map((error, index) => (
                <div key={index} className="error">{error}</div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button type="submit" disabled={!form.isValid}>
        Register
      </button>
    </form>
  );
}
```

---

## Migration Examples

### From Old to New Architecture

#### Before: Old Pattern

```typescript
import React, { useMemo } from 'react';
import { useForm, buildFormConfig, FormRenderer } from '@dynamic_forms/react';

function OldPatternForm() {
  // Old: Manual config building
  const config = useMemo(() => buildFormConfig(formModel), []);
  const form = useForm(config, { initialValues });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormRenderer config={config} form={form} />
    </form>
  );
}
```

#### After: New Pattern

```typescript
import React from 'react';
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';

function NewPatternForm() {
  // New: Direct model usage with enhanced features
  const form = useFormConfig(formModel, {
    initialValues,
    formId: 'my-form',
    eventHooks: {
      onFieldChange: (path, value) => console.log(`${path} changed to:`, value)
    }
  });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormRenderer form={form} config={form.config} />
    </form>
  );
}
```

### Bundle Optimization Migration

#### Before: Everything Imported

```typescript
// Old: Everything from main entry (45KB bundle)
import {
  useForm,
  FormRenderer,
  TextInput,
  Dropdown,
  FormProvider,
} from '@dynamic_forms/react';
```

#### After: Selective Imports

```typescript
// New: Selective imports (15KB core + only needed UI components)
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';

// Or even more selective
import { useFormConfig } from '@dynamic_forms/react';
import { TextInput, Dropdown } from '@dynamic_forms/react/ui';
```

---

## Performance Optimization

### Bundle Size Optimization

#### Example: Configuration-Only Usage

```typescript
// Minimal bundle - only configuration logic (~15KB)
import { createFormConfig } from '@dynamic_forms/react';

// Use with any UI framework
function generateFormConfig(userType) {
  const model = getModelForUserType(userType);

  return createFormConfig(model, {
    initialValues: getInitialValues(userType),
    flags: getFeatureFlags(userType),
  });
}

// Use with Vue.js, Angular, or vanilla JavaScript
const config = generateFormConfig('premium');
```

#### Example: Selective UI Component Usage

```typescript
// Only import the components you need
import { useFormConfig } from '@dynamic_forms/react';
import { TextInput, Dropdown } from '@dynamic_forms/react/ui';

function OptimizedForm() {
  const form = useFormConfig(formModel, { initialValues });

  return (
    <form>
      {form.fields.map(field => {
        if (field.type === 'text') {
          return (
            <TextInput
              key={field.path}
              field={field}
              value={form.values[field.path]}
              onChange={(value) => form.setValue(field.path, value)}
            />
          );
        }

        if (field.type === 'select') {
          return (
            <Dropdown
              key={field.path}
              field={field}
              value={form.values[field.path]}
              onChange={(value) => form.setValue(field.path, value)}
              options={form.dynamicOptions.get(field.path) || []}
            />
          );
        }

        return null;
      })}
    </form>
  );
}
```

### Performance Monitoring

#### Example: Form Performance Tracking

```typescript
import React, { useEffect } from 'react';
import { useFormConfig } from '@dynamic_forms/react';

function PerformanceTrackedForm() {
  const form = useFormConfig(formModel, {
    initialValues,
    formId: 'performance-form',
    enableAnalytics: true,
    eventHooks: {
      onFieldChange: (path, value) => {
        // Track field change performance
        performance.mark(`field-change-${path}-start`);

        // Your change logic here

        performance.mark(`field-change-${path}-end`);
        performance.measure(
          `field-change-${path}`,
          `field-change-${path}-start`,
          `field-change-${path}-end`
        );
      },
      onFormSubmit: (values) => {
        // Track form submission performance
        const entries = performance.getEntriesByType('measure');
        const formMetrics = entries.filter(entry =>
          entry.name.startsWith('field-change-')
        );

        console.log('Form Performance Metrics:', formMetrics);
      }
    }
  });

  // Monitor form initialization performance
  useEffect(() => {
    const initTime = performance.now();
    console.log(`Form initialized in ${initTime}ms`);
  }, []);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Form content */}
    </form>
  );
}
```

---

## Complete Working Examples

See the following example implementations in the `examples/src/pages/` directory:

1. **[Core Config Only](./src/pages/core-config-only/)** - Configuration-first approach with custom UI
2. **[New Architecture UI](./src/pages/new-architecture-ui/)** - Using `useFormConfig` with built-in components
3. **[Advanced Form](./src/pages/advanced-form/)** - Complex form with all features
4. **[Dependencies](./src/pages/dependencies/)** - Field dependencies and conditional logic
5. **[Validation Form](./src/pages/validation-form/)** - Custom validation examples
6. **[Event Hooks](./src/pages/event-hooks/)** - Event handling and analytics
7. **[Sectioned Form](./src/pages/sectioned-form/)** - Multi-section forms

Each example includes:

- Complete working code
- Detailed README with explanations
- Performance considerations
- Migration notes where applicable

---

## Additional Resources

- **[Main README](../README.md)** - Overview and quick start
- **[Migration Guide](../MIGRATION_GUIDE.md)** - Detailed migration instructions
- **[API Reference](../API_REFERENCE.md)** - Quick API reference
- **[Changelog](../CHANGELOG.md)** - Version history and changes

For more examples and use cases, explore the `examples/src/pages/` directory in this repository.
