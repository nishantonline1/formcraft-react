# React Form Builder Library

## Table of Contents

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [Quick Start Guide](#3-quick-start-guide)
4. [API Reference](#4-api-reference)
5. [Architecture & Bundle Optimization](#5-architecture--bundle-optimization)
6. [Migration Guide](#6-migration-guide)
7. [Examples](#7-examples)
8. [TypeScript Support](#8-typescript-support)
9. [React Compatibility](#9-react-compatibility)
10. [Performance](#10-performance)

---

## 1. Introduction

The **React Form Builder** is a powerful, configuration-first library for building complex forms in React 17+ applications. The library has been refactored to prioritize form configuration generation over component rendering, making it lightweight, framework-agnostic at its core, and optimized for modern development workflows.

**Key Features**:

- **Configuration-First Architecture**: Generate form configurations that work with any UI framework or custom components
- **Optional UI Components**: Import rendering components only when needed for optimal bundle sizes
- **React 17+ Compatible**: Full support for React 17 and later versions
- **Schema-Driven**: Define your entire form structure, including fields, types, and validation, with a declarative `FormModel`
- **Lightweight Core**: Use just the configuration engine without React dependencies
- **Tree-Shakeable**: Import only the functionality you need
- **Powerful Hooks**: Choose between `useFormConfig` (new) or `useForm` (backward compatible)
- **Dynamic Fields**: Conditionally show, hide, disable, or modify fields based on the values of other fields
- **Extensible Plugins**: Register custom field types, validation rules, or rendering overrides to extend core functionality
- **Analytics & Event Hooks**: Built-in event bus and callbacks for form lifecycle events
- **Multiple Entry Points**: Import from core, UI, or full library based on your needs

---

## 2. Installation

Install the package using your favorite package manager:

**NPM**

```bash
npm install @dynamic_forms/react
```

**Yarn**

```bash
yarn add @dynamic_forms/react
```

**Peer Dependencies**

The library supports React 17+ and has optional peer dependencies:

```bash
# Required for React hooks and UI components
npm install react@>=17.0.0 react-dom@>=17.0.0

# Optional for TypeScript projects
npm install @types/react @types/react-dom
```

**Note**: React dependencies are optional when using only the core configuration functionality.

---

## 3. Quick Start Guide

The library offers three usage patterns depending on your needs:

#### Option 1: Configuration-Only (Minimal Bundle)

Perfect for custom UI frameworks or minimal bundle sizes:

```typescript
import { createFormConfig } from '@dynamic_forms/react';

// Define your form model
const userProfileModel = [
  {
    key: 'fullName',
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

// Generate configuration (works without React)
const configResult = createFormConfig(userProfileModel, {
  initialValues: { fullName: '', email: '' },
  enableDependencies: true,
  enableValidation: true,
});

// Use with your custom UI components
console.log('Fields:', configResult.fields);
console.log('Validation:', configResult.validation);
```

#### Option 2: React Hook with Custom UI

Use React state management with your own components:

```typescript
import { useFormConfig } from '@dynamic_forms/react';

function MyCustomForm() {
  const form = useFormConfig(userProfileModel, {
    initialValues: { fullName: '', email: '' }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {form.fields
        .filter(field => form.isFieldVisible(field.path))
        .map(field => (
          <MyCustomInput
            key={field.path}
            field={field}
            value={form.values[field.path]}
            onChange={(value) => form.setValue(field.path, value)}
            error={form.errors[field.path]}
          />
        ))}
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Option 3: Full Library with UI Components

Use the complete library with built-in components:

```typescript
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';

function UserProfileForm() {
  const form = useFormConfig(userProfileModel, {
    initialValues: { fullName: 'John Doe', email: '' }
  });

  const handleSubmit = async (values) => {
    console.log('Form Submitted:', values);
    // await api.save(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormRenderer form={form} config={form.config} />
      <button type="submit">Save Profile</button>
    </form>
  );
}
```

### Import Paths

The library provides multiple entry points for different use cases:

```typescript
// Core functionality (always available)
import { createFormConfig, useFormConfig } from '@dynamic_forms/react';

// UI components (optional, tree-shakeable)
import { FormRenderer } from '@dynamic_forms/react/ui';

// Everything together (backward compatibility)
import { useForm, FormRenderer } from '@dynamic_forms/react/full';
```

---

## 4. API Reference

#### 4.1 Core Functions

##### `createFormConfig(model, options?)`

Generates form configuration without React dependencies. Perfect for server-side rendering or non-React environments.

**Parameters:**

- `model`: `FormModel` - The form schema definition
- `options`: `FormConfigOptions` (optional)
  - `flags`: `Record<string, boolean>` - Feature flags for conditional fields
  - `initialValues`: `FormValues` - Initial form values
  - `enableDependencies`: `boolean` - Enable dependency resolution (default: true)
  - `enableValidation`: `boolean` - Enable validation rules (default: true)

**Returns:** `FormConfigResult`

- `config`: Complete form configuration
- `fields`: Array of processed field configurations
- `lookup`: Field lookup map by path
- `dependencies`: Dependency resolution map
- `validation`: Validation utilities
- `state`: Field state query functions

```typescript
import { createFormConfig } from '@dynamic_forms/react';

const result = createFormConfig(formModel, {
  initialValues: { name: '', email: '' },
  enableDependencies: true,
});
```

##### `useFormConfig(model, options?)`

React hook for form state management with the new architecture.

**Parameters:**

- `model`: `FormModel` - The form schema definition
- `options`: `UseFormConfigOptions` (optional)
  - All `FormConfigOptions` plus:
  - `formId`: `string` - Unique form identifier for analytics
  - `enableAnalytics`: `boolean` - Enable event tracking
  - `eventHooks`: `EventHooks` - Lifecycle event callbacks

**Returns:** `UseFormConfigReturn`

- All `FormConfigResult` properties plus:
- `values`: Current form values
- `errors`: Validation errors
- `touched`: Touched field states
- `dynamicOptions`: Resolved dynamic options
- State management functions (`setValue`, `setTouched`, etc.)
- Event handlers (`handleChange`, `handleBlur`, etc.)
- Form actions (`handleSubmit`, `triggerValidation`, etc.)

```typescript
import { useFormConfig } from '@dynamic_forms/react';

const form = useFormConfig(formModel, {
  initialValues: { name: '', email: '' },
  formId: 'user-profile',
  eventHooks: {
    onFieldChange: (path, value) => console.log(`${path} changed`),
  },
});
```

#### 4.2 Backward Compatibility

##### `useForm(model, options?)`

The original hook, now enhanced to work with the new architecture while maintaining full backward compatibility.

**Parameters:** Same as `useFormConfig`
**Returns:** `UseFormReturn` - Same interface as before

```typescript
import { useForm } from '@dynamic_forms/react';

// Works exactly as before
const form = useForm(formModel, { initialValues });
```

#### 4.3 UI Components (Optional)

Import from `@dynamic_forms/react/ui` for optional rendering components:

##### `FormRenderer`

**Props:**

- `form`: Form object from `useFormConfig` or `useForm`
- `config`: Form configuration (available as `form.config`)
- `renderers`: Custom field type renderers
- `customRenderers`: Named custom renderers

```typescript
import { FormRenderer } from '@dynamic_forms/react/ui';

<FormRenderer form={form} config={form.config} />
```

##### Field Components

Individual field renderers available for custom usage:

- `TextInput`, `NumberInput`, `Dropdown`, `DatePicker`, `CheckboxInput`, `ArrayFieldWrapper`

#### 4.4 `FormModel` & `FieldProps`

The `FormModel` is an array of `FieldProps` objects that defines the form schema.

**`FieldProps` Interface:**

| Property         | Type                                                                | Description                                                                                               |
| ---------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `key`            | `string`                                                            | **Required.** The unique identifier and key for the field's value in the form state.                      |
| `type`           | `'text' \| 'number' \| 'select' \| 'date' \| 'array' \| 'checkbox'` | **Required.** The type of field to render.                                                                |
| `label`          | `string`                                                            | **Required.** The display label for the form field.                                                       |
| `validators`     | `object`                                                            | Validation rules for the field. See [Validators](#validators) section below.                              |
| `layout`         | `object`                                                            | Grid layout properties: `row`, `col`, `rowSpan`, `colSpan`, `className`.                                  |
| `disabled`       | `boolean`                                                           | If `true`, the field is disabled. Can be overridden by the `dependencies` engine.                         |
| `hidden`         | `boolean`                                                           | If `true`, the field is not rendered. Can be overridden by the `dependencies` engine.                     |
| `options`        | `() => Promise<Array<{value, label}>>`                              | A function that returns a promise resolving to an array of options for a `select` field.                  |
| `dynamicOptions` | `object`                                                            | Load `select` options dynamically based on other field values. See [Dynamic Options](#dynamic-options).   |
| `dependencies`   | `Array<object>`                                                     | Rules to dynamically modify this field based on another field's value. See [Dependencies](#dependencies). |
| `itemModel`      | `FormModel`                                                         | For fields of `type: 'array'`, this defines the schema for each item in the array.                        |
| `renderer`       | `string`                                                            | A key to map this field to a custom renderer passed to `FormRenderer`.                                    |
| `meta`           | `Record<string, any>`                                               | An object for arbitrary annotations (e.g., analytics IDs).                                                |
| `flags`          | `Record<string, boolean>`                                           | A map of feature flags; the field is only included if all flags are `true`.                               |

**Validators:**

The `validators` object supports the following keys:
`required`, `min`, `max`, `minItems`, `maxItems`, `pattern: RegExp`, `custom: (value) => string[]`, `decimal_places`.

**Dependencies:**

The `dependencies` object connects field properties to the state of other fields. The system supports both single-field and multi-field dependencies using a unified approach.

**Dependency Format:**
`{ fields: string[], condition: (watchedValues, formValues) => boolean, overrides: Partial<FieldProps> }`

- `fields`: An array of field `key`s to watch (use `["singleField"]` for single-field dependencies)
- `condition`: A function that receives watched values (only the specified fields) and all form values, returning `true` if the override should be applied
- `overrides`: An object with `FieldProps` to apply when the condition is met

**Examples:**

```typescript
// Single-field dependency
{
  key: 'conditionalField',
  type: 'text',
  label: 'Conditional Field',
  hidden: true,
  dependencies: {
    fields: ['showField'],
    condition: (watchedValues) => watchedValues.showField === true,
    overrides: { hidden: false }
  }
}

// Multi-field dependency
{
  key: 'adminPanel',
  type: 'text',
  label: 'Admin Panel',
  hidden: true,
  dependencies: {
    fields: ['userRole', 'isActive'],
    condition: (watchedValues) => {
      return watchedValues.userRole === 'admin' && watchedValues.isActive === true;
    },
    overrides: { hidden: false }
  }
}
```

**Dynamic Options:**

`{ trigger: string[], loader: (values) => Promise<Array<{value, label}>> }`

- `trigger`: An array of field `key`s that should trigger a reload of the options.
- `loader`: A function that receives the entire form's `values` object and returns the new options.

#### 4.5 Providers (Optional)

Import from `@dynamic_forms/react/ui` for optional providers:

- **`<FormProvider>`**: Provides internationalization context.
  - Props: `locale: string`, `messages: Record<string, string>`.
- **`<AnalyticsProvider>`**: Provides an event handler for analytics.
  - Props: `onEvent: (name, data) => void`.
- **`<FormWrapper>`**: A simple layout component.
  - Props: `title: string`, `loading?: boolean`.

#### 4.6 Plugin System

The library includes a plugin system to extend its core functionality.

**`FormPlugin` Interface:**

- `name: string`: A unique name for the plugin.
- `extendConfig?(model, config)`: A function to modify the `FormConfig`.
- `onValidate?(field, value)`: A function to add custom validation rules.
- `renderField?(field, form)`: A function to render a field, overriding the default renderer.

Use `registerPlugin(plugin)` to add a plugin and `unregisterPlugin(name)` to remove it.

---

## 5. Architecture & Bundle Optimization

#### 5.1 Entry Points

The library provides three entry points for different use cases:

```typescript
// Main entry point - Core functionality only
import { createFormConfig, useFormConfig } from '@dynamic_forms/react';

// UI entry point - Optional rendering components
import { FormRenderer } from '@dynamic_forms/react/ui';

// Full entry point - Everything together (backward compatibility)
import { useForm, FormRenderer } from '@dynamic_forms/react/full';
```

#### 5.2 Bundle Size Optimization

| Import Pattern | Bundle Impact | Use Case                                     |
| -------------- | ------------- | -------------------------------------------- |
| Core only      | ~15KB         | Configuration generation, custom UI          |
| Core + UI      | ~45KB         | Full featured forms with built-in components |
| Full library   | ~45KB         | Backward compatibility, gradual migration    |

#### 5.3 Tree Shaking

The library is optimized for tree shaking:

```typescript
// Only includes createFormConfig and dependencies
import { createFormConfig } from '@dynamic_forms/react';

// Only includes useFormConfig and React dependencies
import { useFormConfig } from '@dynamic_forms/react';

// Only includes specific UI components
import { TextInput, Dropdown } from '@dynamic_forms/react/ui';
```

#### 5.4 Package Structure

```text
/src
  /core            # Core configuration logic (framework-agnostic)
    /config        # Form configuration generation
    /validation    # Field validation utilities
    /dependencies  # Dependency resolution
    /state         # State management utilities
    /types         # Core type definitions
  /hooks           # React hooks (minimal React dependency)
  /ui              # Optional UI components (tree-shakeable)
    /renderers     # Individual field renderers
  /providers       # Optional React providers
  /plugins         # Plugin system
  /events          # Event system
  /model           # Form model interfaces
  /types           # Shared TypeScript types
  /utils           # Shared utilities
  index.ts         # Main entry point (core-first)
  ui.ts            # UI components entry point
  full.ts          # Complete library entry point
```

---

## 6. Migration Guide

#### 6.1 Backward Compatibility

**✅ No Breaking Changes** - Your existing code continues to work without modifications:

```typescript
// This still works exactly as before
import { useForm, FormRenderer } from '@dynamic_forms/react';

const form = useForm(formModel, { initialValues });
```

#### 6.2 Migration Options

1. **No Migration Required**: Keep using existing patterns
2. **Gradual Migration**: Adopt new patterns for new forms
3. **Full Migration**: Optimize all forms for better performance

#### 6.3 Quick Migration Example

**Before (still supported):**

```typescript
import { useForm, FormRenderer } from '@dynamic_forms/react';
const form = useForm(formModel, { initialValues });
```

**After (recommended):**

```typescript
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';
const form = useFormConfig(formModel, { initialValues });
```

#### 6.4 Detailed Migration Guide

For comprehensive migration instructions, examples, and troubleshooting, see:

**📖 [Complete Migration Guide](MIGRATION_GUIDE.md)**

The migration guide covers:

- Detailed migration strategies
- Bundle size optimization
- TypeScript migration
- Performance improvements
- Common issues and solutions
- Testing migration
- Migration checklist

---

## 7. Examples

The library includes comprehensive examples demonstrating different usage patterns:

- **Core Configuration Only**: Minimal bundle, custom UI components
- **New Architecture with UI**: Using `useFormConfig` with built-in components
- **Backward Compatibility**: Using existing `useForm` patterns
- **Advanced Features**: Dependencies, validation, dynamic options, analytics

Run the examples:

```bash
npm run examples:serve
```

---

## 8. TypeScript Support

The library is built with TypeScript and provides comprehensive type definitions:

```typescript
import type {
  FormModel,
  FieldProps,
  UseFormConfigReturn,
  FormConfigResult,
  ValidationRule,
  DependencyResolution,
} from '@dynamic_forms/react';
```

All entry points include proper TypeScript definitions with full IntelliSense support.

---

## 9. React Compatibility

- **React 17+**: Full support for React 17 and later versions
- **React 18**: Optimized for React 18 features
- **Server-Side Rendering**: Core functionality works without React
- **Concurrent Features**: Compatible with React 18 concurrent features

---

## 10. Performance

The refactored architecture provides significant performance improvements:

- **Smaller bundles**: Import only what you need
- **Faster initialization**: Optimized configuration generation
- **Better tree shaking**: Unused code is eliminated
- **Reduced re-renders**: Improved state management

Run performance tests:

```bash
npm run perf:test
```

---

## Quick Reference

For detailed API documentation, see **📖 [API Reference](API_REFERENCE.md)**

### Import Patterns

```typescript
// Core functionality only (minimal bundle)
import { createFormConfig, useFormConfig } from '@dynamic_forms/react';

// UI components (optional)
import { FormRenderer } from '@dynamic_forms/react/ui';

// Backward compatibility (everything)
import { useForm, FormRenderer } from '@dynamic_forms/react/full';
```

### Basic Usage

```typescript
// Configuration-first approach
const form = useFormConfig(formModel, { initialValues });

// With UI components
<FormRenderer form={form} config={form.config} />

// Custom UI
{form.fields.map(field => (
  <MyInput
    key={field.path}
    field={field}
    value={form.values[field.path]}
    onChange={(value) => form.setValue(field.path, value)}
  />
))}
```

### Bundle Sizes

| Import Pattern | Size  | Use Case               |
| -------------- | ----- | ---------------------- |
| Core only      | ~15KB | Custom UI, server-side |
| Core + UI      | ~45KB | Full-featured forms    |
| Full library   | ~45KB | Backward compatibility |

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](README.md)
- 🚀 [Examples](examples/)
- 🐛 [Issues](https://github.com/nishantonline1/formcraft-react/issues)
- 💬 [Discussions](https://github.com/nishantonline1/formcraft-react/discussions)
