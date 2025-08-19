# 🚀 Core Configuration Only - Comprehensive Example

This example demonstrates the most powerful and flexible way to use the **@dynamic_forms/react** library through its core configuration approach. Perfect for developers who want maximum control over their form implementation while leveraging the library's advanced features.

---

## 📋 **What You'll Learn**

### **🎯 Core Concepts**

- **Field Definition Patterns**: Comprehensive field types and configurations
- **Validation Strategies**: Built-in validators, custom rules, and async validation
- **Dependency Management**: Complex conditional field relationships
- **Form State Control**: Advanced state management and form analytics
- **Type Safety**: Full TypeScript integration and type definitions

### **🏗️ Advanced Techniques**

- **Configuration Presets**: Switchable form configurations for different use cases
- **Test Scenarios**: Pre-built data scenarios for testing different flows
- **Field Introspection**: Runtime field metadata and analysis
- **Custom Validation**: Complex cross-field validation rules
- **Form Analytics**: Comprehensive form usage statistics

---

## 📚 **Comprehensive Field Definitions**

### **Text Fields with Advanced Validation**

```typescript
{
  key: 'firstName',
  type: 'text',
  label: 'First Name',
  placeholder: 'Enter your first name',
  validators: {
    required: true,
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s'-]+$/  // Only letters, spaces, hyphens, apostrophes
  },
  layout: { row: 1, col: 0 }
}
```

### **Select Fields with Async Options**

```typescript
{
  key: 'industry',
  type: 'select',
  label: 'Industry',
  placeholder: 'Select your industry',
  validators: { required: true },
  options: async () => [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    // ... more options loaded asynchronously
  ],
  dependencies: [
    {
      field: 'userType',
      condition: (value) => ['business', 'enterprise'].includes(value as string),
      overrides: { hidden: false }
    }
  ]
}
```

### **Array Fields for Multi-Selection**

```typescript
{
  key: 'requiredFeatures',
  type: 'array',
  label: 'Required Features',
  placeholder: 'Select all features you need',
  defaultValue: [],
  validators: { minItems: 1 },
  options: async () => [
    { value: 'analytics', label: 'Analytics & Reporting' },
    { value: 'integrations', label: 'Third-party Integrations' },
    { value: 'api', label: 'API Access' },
    // ... more feature options
  ],
  layout: { row: 6, col: 0, span: 2 }
}
```

### **Conditional Fields with Complex Dependencies**

```typescript
{
  key: 'customRequirements',
  type: 'text',
  label: 'Custom Requirements',
  placeholder: 'Describe any specific needs...',
  validators: { max: 500 },
  dependencies: [
    {
      field: 'userType',
      condition: (value) => value === 'enterprise',
      overrides: { hidden: false }
    }
  ]
}
```

---

## 🔧 **Advanced Usage Patterns**

### **1. Basic Implementation**

```typescript
import { useBasicCoreConfig } from './hooks';

const MyForm = () => {
  const form = useBasicCoreConfig();

  return (
    <form onSubmit={form.handleSubmit}>
      {form.config.fields
        .filter(field => form.isFieldVisible(field.path))
        .map(field => (
          <MyCustomInput
            key={field.key}
            field={field}
            value={form.values[field.key]}
            onChange={(value) => form.handleChange(field.key, value)}
            error={form.errors[field.key]}
          />
        ))}
      <button type="submit">Submit</button>
    </form>
  );
};
```

### **2. Advanced Implementation with Analytics**

```typescript
import { useAdvancedCoreConfig } from './hooks';

const AdvancedForm = () => {
  const {
    // Core form functionality
    config, values, errors, handleChange, handleSubmit,

    // Advanced features
    formAnalytics,
    currentPreset,
    switchPreset,
    loadTestScenario,
    fieldIntrospection,
    performAdvancedValidation
  } = useAdvancedCoreConfig();

  return (
    <div className="advanced-form">
      {/* Configuration Controls */}
      <div className="form-controls">
        <select
          value={currentPreset}
          onChange={(e) => switchPreset(e.target.value)}
        >
          <option value="minimal">Minimal</option>
          <option value="business">Business</option>
          <option value="enterprise">Enterprise</option>
        </select>

        <button onClick={() => loadTestScenario('smallBusiness')}>
          Load Test Data
        </button>
      </div>

      {/* Form Analytics Dashboard */}
      <div className="analytics-panel">
        <div>Completion: {formAnalytics.completionPercentage}%</div>
        <div>Validation Score: {formAnalytics.validationScore}%</div>
        <div>Visible Fields: {formAnalytics.visibleFields}</div>
      </div>

      {/* Dynamic Form Rendering */}
      <form onSubmit={handleSubmit}>
        {fieldIntrospection.getFieldsBySection().basic.map(fieldKey => (
          <AdvancedInput
            key={fieldKey}
            metadata={fieldIntrospection.getFieldMetadata(fieldKey)}
            value={values[fieldKey]}
            onChange={(value) => handleChange(fieldKey, value)}
          />
        ))}
      </form>
    </div>
  );
};
```

### **3. Standalone Configuration (Non-React)**

```typescript
import { useStandaloneConfig } from './hooks';

// This simulates usage outside of React components
const configResult = useStandaloneConfig();

// Access configuration data
console.log('Total fields:', configResult.stats.totalFields);
console.log('Conditional fields:', configResult.stats.conditionalFields);

// Field introspection
const emailField = configResult.getFieldByKey('email');
console.log('Email field config:', emailField);

// Validation
const validationErrors = configResult.validation.validateField(
  'email',
  'invalid-email',
);
console.log('Validation errors:', validationErrors);
```

---

## 🎨 **Configuration Presets**

### **Minimal Configuration**

Perfect for quick sign-ups or basic forms:

```typescript
const minimalFields = [
  'userType',
  'firstName',
  'lastName',
  'email',
  'agreesToTerms',
];
```

### **Business Configuration**

Comprehensive business information collection:

```typescript
const businessFields = [
  // Basic info + company details + budget + features
  'userType',
  'firstName',
  'lastName',
  'email',
  'phone',
  'companyName',
  'industry',
  'employeeCount',
  'monthlyBudget',
  'requiredFeatures',
  'implementationTimeline',
];
```

### **Enterprise Configuration**

Full feature set with advanced options:

```typescript
const enterpriseFields = [
  // All fields including custom requirements and advanced preferences
  // ... complete field set with conditional enterprise-only fields
];
```

---

## 🧪 **Test Scenarios**

### **Individual User**

```typescript
const individualUser = {
  userType: 'individual',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  agreesToTerms: true,
  // ... additional individual-specific data
};
```

### **Small Business**

```typescript
const smallBusiness = {
  userType: 'business',
  firstName: 'Jane',
  lastName: 'Smith',
  companyName: 'Small Business Inc.',
  industry: 'retail',
  employeeCount: '11-50',
  monthlyBudget: 299,
  requiredFeatures: ['analytics', 'integrations'],
  // ... business-specific configuration
};
```

### **Enterprise Client**

```typescript
const enterpriseClient = {
  userType: 'enterprise',
  companyName: 'Enterprise Solutions Corp',
  industry: 'technology',
  employeeCount: '1000+',
  monthlyBudget: 5000,
  requiredFeatures: [
    'analytics',
    'api',
    'support',
    'customization',
    'security',
  ],
  customRequirements: 'Need SOC 2 compliance and custom SSO integration',
  // ... enterprise-specific requirements
};
```

---

## ✅ **Custom Validation Rules**

### **Enterprise Requirements Validation**

```typescript
const validateEnterpriseRequirements = (values: FormData): string[] => {
  const errors: string[] = [];

  if (values.userType === 'enterprise') {
    if (!values.companyName) {
      errors.push('Company name is required for enterprise accounts');
    }
    if (!values.monthlyBudget || values.monthlyBudget < 1000) {
      errors.push('Enterprise accounts require minimum $1,000/month budget');
    }
  }

  return errors;
};
```

### **Budget-Feature Alignment**

```typescript
const validateBudgetFeatureAlignment = (values: FormData): string[] => {
  const premiumFeatures = ['api', 'customization', 'support', 'compliance'];
  const selectedPremium =
    values.requiredFeatures?.filter((f) => premiumFeatures.includes(f)) || [];

  if (selectedPremium.length > 0 && values.monthlyBudget < 500) {
    return ['Premium features require minimum $500/month budget'];
  }

  return [];
};
```

### **Async Email Uniqueness**

```typescript
const validateEmailUniqueness = async (email: string): Promise<string[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const existingEmails = ['admin@example.com', 'test@demo.com'];

  if (existingEmails.includes(email.toLowerCase())) {
    return ['This email address is already registered'];
  }

  return [];
};
```

---

## 📊 **Form Analytics & Introspection**

### **Form Statistics**

```typescript
const formAnalytics = {
  totalFields: 15,
  visibleFields: 12,
  completedFields: 8,
  completionPercentage: 67,
  validationScore: 85,

  fieldsByType: {
    text: 6,
    select: 5,
    number: 2,
    checkbox: 3,
    array: 2,
  },

  conditionalFields: 8,
  activeConditionalFields: 5,
};
```

### **Field Introspection**

```typescript
const fieldMetadata = fieldIntrospection.getFieldMetadata('email');
// Returns:
{
  key: 'email',
  type: 'text',
  label: 'Email Address',
  isVisible: true,
  isDisabled: false,
  currentValue: 'user@example.com',
  hasError: false,
  isTouched: true,
  validators: { required: true, pattern: /.../ }
}
```

---

## 🎯 **Best Practices**

### **✅ Field Definition**

- Use descriptive labels and helpful placeholders
- Implement appropriate validation for each field type
- Organize fields with logical layout properties
- Define clear dependency relationships

### **✅ Validation Strategy**

- Combine built-in validators with custom rules
- Use async validation sparingly for better performance
- Provide clear, user-friendly error messages
- Implement progressive validation (basic → advanced)

### **✅ Performance Optimization**

- Use configuration presets to minimize bundle size
- Implement lazy loading for complex field options
- Cache expensive computations with useMemo
- Optimize re-renders with proper dependency arrays

### **✅ Type Safety**

- Define comprehensive TypeScript interfaces
- Use typed form data throughout the application
- Leverage intellisense for better developer experience
- Maintain type consistency across components

---

## 🚀 **Integration Patterns**

### **With Existing UI Libraries**

```typescript
// Material-UI Integration
const MaterialFormField = ({ field, value, onChange, error }) => {
  const Component = fieldTypeMap[field.type] || TextField;

  return (
    <Component
      label={field.label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error?.[0]}
      required={field.validators?.required}
      {...field.materialProps}
    />
  );
};
```

### **With State Management**

```typescript
// Redux Integration
const useFormWithRedux = () => {
  const dispatch = useDispatch();
  const form = useAdvancedCoreConfig();

  useEffect(() => {
    dispatch(updateFormState(form.values));
  }, [form.values, dispatch]);

  return form;
};
```

### **Server-Side Rendering**

```typescript
// Next.js Integration
export async function getServerSideProps() {
  const configResult = createFormConfig(coreConfigFormModel);

  return {
    props: {
      initialConfig: configResult,
      initialValues: getInitialValuesFromAPI(),
    },
  };
}
```

---

## 📈 **Use Cases**

### **🎯 Perfect For:**

- **Custom Design Systems**: When you need complete UI control
- **Bundle Size Optimization**: Include only the configuration logic you need
- **Complex Form Logic**: Advanced validation and dependency management
- **Multi-Step Forms**: Progressive form building with preset switching
- **Form Builders**: Building tools that generate forms dynamically

### **💡 When to Choose This Approach:**

- You have specific UI/UX requirements
- Bundle size is critical for your application
- You need advanced form analytics and introspection
- You're building a form management system
- You want maximum flexibility and control

---

## 🔗 **Related Examples**

- **[Simple Form](../simple-form/)**: Basic form implementation with UI components
- **[Validation Form](../validation-form/)**: Focus on validation patterns
- **[Dependencies](../dependencies/)**: Complex field dependency examples
- **[Sectioned Form](../sectioned-form/)**: Multi-section form organization

---

_This comprehensive example showcases the full power of the core configuration approach, providing you with the foundation to build sophisticated, type-safe, and highly customizable forms._
