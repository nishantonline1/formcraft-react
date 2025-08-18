# API Reference

Quick reference for the React Form Builder Library's new configuration-first architecture.

## Core Functions

### `createFormConfig(model, options?)`

Generate form configuration without React dependencies.

```typescript
import { createFormConfig } from '@dynamic_forms/react';

const result = createFormConfig(formModel, {
  initialValues: { name: '', email: '' },
  enableDependencies: true,
  enableValidation: true,
  flags: { advancedFeatures: true },
});

// Returns: FormConfigResult
// - config: Complete form configuration
// - fields: Array of processed fields
// - lookup: Field lookup map
// - dependencies: Dependency resolution map
// - validation: Validation utilities
// - state: Field state query functions
```

### `useFormConfig(model, options?)`

React hook for form state management with enhanced features.

```typescript
import { useFormConfig } from '@dynamic_forms/react';

const form = useFormConfig(formModel, {
  initialValues: { name: '', email: '' },
  formId: 'user-profile',
  enableAnalytics: true,
  eventHooks: {
    onFieldChange: (path, value) => console.log(`${path} changed`),
    onFieldFocus: (path) => console.log(`${path} focused`),
    onFieldBlur: (path) => console.log(`${path} blurred`),
    onFormSubmit: (values) => console.log('Form submitted', values),
  },
});

// Returns: UseFormConfigReturn (extends FormConfigResult)
// - All FormConfigResult properties plus:
// - values: Current form values
// - errors: Validation errors
// - touched: Touched field states
// - dynamicOptions: Resolved dynamic options
// - setValue(path, value): Update field value
// - setTouched(path, touched?): Mark field as touched
// - setError(path, errors): Set field errors
// - handleChange(path, value): Change handler
// - handleBlur(path): Blur handler
// - handleFocus(path): Focus handler
// - handleSubmit(onSubmit): Submit handler with validation
// - addArrayItem(path): Add array item
// - removeArrayItem(path, index): Remove array item
// - triggerValidation(fields?): Trigger validation
// - reset(values?): Reset form
// - isFieldVisible(path): Check field visibility
// - isFieldDisabled(path): Check field disabled state
// - getEffectiveField(path): Get field with overrides applied
// - isDirty: Form has changes
// - isValid: Form is valid
```

## Backward Compatibility

### `useForm(model, options?)`

Original hook with enhanced internal implementation.

```typescript
import { useForm } from '@dynamic_forms/react';

const form = useForm(formModel, { initialValues });
// Returns: UseFormReturn (same interface as before)
```

## UI Components (Optional)

Import from `@dynamic_forms/react/ui`:

### `FormRenderer`

```typescript
import { FormRenderer } from '@dynamic_forms/react/ui';

<FormRenderer
  form={form}
  config={form.config}
  renderers={{
    text: MyCustomTextInput,
    select: MyCustomDropdown
  }}
  customRenderers={{
    specialField: MySpecialComponent
  }}
/>
```

### Field Components

```typescript
import {
  TextInput,
  NumberInput,
  Dropdown,
  DatePicker,
  CheckboxInput,
  ArrayFieldWrapper,
} from '@dynamic_forms/react/ui';
```

### Providers

```typescript
import {
  FormProvider,
  AnalyticsProvider,
  FormWrapper
} from '@dynamic_forms/react/ui';

<FormProvider locale="en" messages={messages}>
  <AnalyticsProvider onEvent={handleAnalyticsEvent}>
    <FormWrapper title="My Form" loading={isLoading}>
      {/* Your form content */}
    </FormWrapper>
  </AnalyticsProvider>
</FormProvider>
```

## Types

### Core Types

```typescript
import type {
  FormModel,
  FieldProps,
  FormConfigResult,
  FormConfigOptions,
  UseFormConfigReturn,
  UseFormConfigOptions,
  ValidationRule,
  DependencyResolution,
  EventHooks,
  OptionItem,
  FormValues,
  ValidationErrors,
  TouchedFields,
} from '@dynamic_forms/react';
```

### UI Types

```typescript
import type {
  FormRendererProps,
  FieldRenderer,
  FieldRendererProps,
} from '@dynamic_forms/react/ui';
```

## FormModel Schema

### Basic Field

```typescript
{
  key: 'fieldName',
  type: 'text' | 'number' | 'select' | 'date' | 'array' | 'checkbox',
  label: 'Field Label',
  validators: {
    required: true,
    min: 2,
    max: 100,
    pattern: /regex/,
    custom: (value) => value === 'valid' ? [] : ['Invalid value']
  },
  layout: {
    row: 0,
    col: 0,
    colSpan: 2,
    rowSpan: 1,
    className: 'custom-class'
  },
  disabled: false,
  hidden: false,
  meta: {
    analyticsId: 'field-analytics-id',
    customData: 'any-value'
  },
  flags: {
    featureFlag: true
  }
}
```

### Select Field with Options

```typescript
{
  key: 'selectField',
  type: 'select',
  label: 'Select Option',
  options: () => Promise.resolve([
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ])
}
```

### Dynamic Options

```typescript
{
  key: 'dynamicSelect',
  type: 'select',
  label: 'Dynamic Select',
  dynamicOptions: {
    trigger: ['otherField'],
    loader: (values) => {
      if (values.otherField === 'type1') {
        return Promise.resolve([
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' }
        ]);
      }
      return Promise.resolve([]);
    }
  }
}
```

### Field Dependencies

```typescript
{
  key: 'conditionalField',
  type: 'text',
  label: 'Conditional Field',
  hidden: true, // Hidden by default
  dependencies: [
    {
      field: 'triggerField',
      condition: (value) => value === 'show',
      overrides: {
        hidden: false,
        disabled: false,
        validators: { required: true }
      }
    }
  ]
}
```

### Array Field

```typescript
{
  key: 'arrayField',
  type: 'array',
  label: 'Array Field',
  itemModel: [
    {
      key: 'itemName',
      type: 'text',
      label: 'Item Name',
      validators: { required: true }
    },
    {
      key: 'itemValue',
      type: 'number',
      label: 'Item Value'
    }
  ]
}
```

## Entry Points

### Main Entry Point

```typescript
// Core functionality only
import { createFormConfig, useFormConfig } from '@dynamic_forms/react';
```

### UI Entry Point

```typescript
// Optional UI components
import { FormRenderer } from '@dynamic_forms/react/ui';
```

### Full Entry Point

```typescript
// Everything together (backward compatibility)
import { useForm, FormRenderer } from '@dynamic_forms/react/full';
```

## Bundle Sizes

| Import Pattern     | Approximate Size | Use Case                            |
| ------------------ | ---------------- | ----------------------------------- |
| Core only          | ~15KB            | Configuration generation, custom UI |
| Core + Specific UI | ~25KB            | Selective component usage           |
| Core + Full UI     | ~45KB            | Complete form solution              |
| Full library       | ~45KB            | Backward compatibility              |

## Performance Tips

1. **Use core-only imports** when building custom UI
2. **Import specific UI components** instead of the entire UI package
3. **Enable tree-shaking** in your bundler configuration
4. **Use formId** for better performance tracking
5. **Disable analytics** if not needed: `enableAnalytics: false`

## Migration Quick Reference

```typescript
// Before (still works)
import { useForm, FormRenderer } from '@dynamic_forms/react';
const form = useForm(formModel, options);

// After (recommended)
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';
const form = useFormConfig(formModel, options);
```

For detailed migration instructions, see [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md).
