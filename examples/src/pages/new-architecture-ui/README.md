# New Architecture with UI Components Example

This example demonstrates the refactored form library using the new architecture while still leveraging the provided UI components. It shows how to use `useFormConfig` with the optional UI components for improved modularity and better tree-shaking.

## Key Features Demonstrated

- **useFormConfig Hook**: The new lightweight hook for form state management
- **Optional UI Components**: Importing UI components from the separate entry point
- **Enhanced Modularity**: Clear separation between core logic and UI components
- **Tree-Shaking Optimization**: Only include the components you actually use
- **Improved Developer Experience**: Better TypeScript support and cleaner APIs

## Architecture Improvements

### New Hook: `useFormConfig`

The new `useFormConfig` hook provides:

- Direct FormModel acceptance (no manual config building)
- Built-in state management for values, errors, touched states
- Computed properties for field visibility and disabled states
- Action handlers for form interactions
- Enhanced event hooks and analytics support

```typescript
import { useFormConfig } from '@dynamic_forms/react';

const form = useFormConfig(formModel, {
  initialValues: { projectType: '', projectName: '' },
  formId: 'my-form',
  enableAnalytics: true,
  eventHooks: {
    onFieldChange: (path, value) => console.log(`${path} changed to:`, value),
  },
});
```

### Separate UI Entry Point

UI components are now imported from a separate entry point for better tree-shaking:

```typescript
import { FormRenderer } from '@dynamic_forms/react/ui';
```

This allows bundlers to:

- Exclude UI components when not needed
- Optimize bundle sizes for configuration-only usage
- Provide better code splitting opportunities

## Benefits Over Previous Architecture

### 1. Better Bundle Optimization

- Core logic and UI components are separated
- Tree-shaking can remove unused UI components
- Smaller bundles for configuration-only usage

### 2. Improved Developer Experience

- No manual `buildFormConfig` calls needed
- Direct FormModel support in hooks
- Better TypeScript inference
- Cleaner, more intuitive APIs

### 3. Enhanced Modularity

- Clear separation of concerns
- Optional UI components
- Framework-agnostic core
- Easier testing and maintenance

### 4. Backward Compatibility

- Existing `useForm` hook still works
- Same FormModel format
- Same component APIs
- Gradual migration path

## Usage Patterns

### Basic Form with New Architecture

```typescript
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';

const MyForm = () => {
  const form = useFormConfig(formModel, {
    initialValues: { name: '', email: '' }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormRenderer form={form} config={form.config} />
      <button type="submit" disabled={!form.formState.canSubmit}>
        Submit
      </button>
    </form>
  );
};
```

### Advanced Form with Analytics and Events

```typescript
const form = useFormConfig(formModel, {
  initialValues,
  formId: 'project-form',
  enableAnalytics: true,
  eventHooks: {
    onFieldChange: (path, value) => {
      analytics.track('field_changed', { field: path, value });
    },
    onFieldFocus: (path) => {
      analytics.track('field_focused', { field: path });
    },
  },
});
```

## Migration Guide

### From Old Architecture

```typescript
// OLD: Manual config building
const config = useMemo(() => buildFormConfig(formModel), []);
const form = useForm(config, { initialValues });

// NEW: Direct model usage
const form = useFormConfig(formModel, { initialValues });
```

### Import Changes

```typescript
// OLD: Everything from main entry
import { FormRenderer, useForm } from '@dynamic_forms/react';

// NEW: Separate entry points
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';
```

## Example Features

This example includes:

### 1. Complex Form Model

- Multiple field types (text, dropdown, number, array, date, checkbox)
- Dynamic dependencies between fields
- Conditional field visibility
- Dynamic options based on other field values

### 2. Advanced State Management

- Form completion tracking
- Real-time validation
- Project cost estimation
- Risk assessment calculations
- Team productivity metrics

### 3. Rich UI Components

- Tabbed interface (Form Builder / Project Analysis)
- Progress indicators
- Real-time statistics
- Interactive form fields
- Responsive design

### 4. Analytics and Events

- Field change tracking
- Focus/blur event handling
- Form submission analytics
- Custom event hooks

## When to Use This Approach

### Ideal For:

- **Gradual Migration**: Moving from old to new architecture
- **Hybrid Approach**: Using some built-in components with custom ones
- **Full-Featured Forms**: Leveraging all library capabilities
- **Rapid Development**: Quick form building with provided components

### Benefits:

- Faster development with pre-built components
- Consistent UI across forms
- Full feature set available
- Easy customization and theming
- Comprehensive validation and state management

This example demonstrates the best of both worlds: the improved architecture with the convenience of pre-built UI components.
