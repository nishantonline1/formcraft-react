# React Form Builder Library

### 1. Introduction

The **React Form Builder** is a powerful, schema-driven library for declaratively building, managing, and rendering complex forms in React. It includes a robust state management hook, a flexible rendering engine, and an extensible plugin system, making it a complete solution for form-heavy applications.

**Key Features**:

- **Schema-Driven**: Define your entire form structure, including fields, types, and validation, with a declarative `FormModel`.
- **Integrated Renderer**: Comes with a built-in `FormRenderer` that intelligently renders fields based on the schema, with support for grid layouts and custom components.
- **Powerful `useForm` Hook**: A comprehensive hook that manages form state, validation, field dependencies, and event handling.
- **Dynamic Fields**: Conditionally show, hide, disable, or modify fields based on the values of other fields.
- **Extensible Plugins**: Register custom field types, validation rules, or rendering overrides to extend core functionality.
- **Analytics & Event Hooks**: Built-in event bus and callbacks for `onInit`, `onFieldChange`, `onBlur`, and `onSubmit` lifecycle events.
- **Feature Flagging**: Per-field and module-level toggles to conditionally enable functionality.
- **Internationalization**: Context-driven locale and message provider for multi-language support.

---

### 2. Getting Started: A Step-by-Step Guide

This guide walks through creating a complete user profile form. We recommend organizing your form logic into modules, with a clear separation of concerns.

#### Step 1: Create the Module Folder

First, create a directory for your new form module.

```bash
mkdir src/modules/user-profile
```

#### Step 2: Define the Model (`model.ts`)

Define the form's structure in `src/modules/user-profile/model.ts`. This schema is the single source of truth for your form's fields, types, and validation rules.

```typescript
// src/modules/user-profile/model.ts
import { FormModel } from 'react-form-builder-ts';

const userProfileModel: FormModel = [
  {
    key: 'fullName',
    type: 'text',
    label: 'Full Name',
    validators: { required: true, min: 2 },
    layout: { row: 0, col: 0, colSpan: 2 },
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email Address',
    validators: { required: true, pattern: /^\S+@\S+\.\S+$/ },
    layout: { row: 1, col: 0, colSpan: 2 },
  },
  {
    key: 'isDeveloper',
    type: 'checkbox',
    label: 'Are you a developer?',
    layout: { row: 2, col: 0 },
  },
  {
    key: 'primaryLanguage',
    type: 'select',
    label: 'Primary Language',
    dependencies: [
      {
        field: 'isDeveloper',
        condition: (isDev) => isDev === true,
        overrides: { hidden: false },
      },
    ],
    hidden: true, // Hidden by default
    options: () =>
      Promise.resolve([
        { value: 'js', label: 'JavaScript' },
        { value: 'py', label: 'Python' },
        { value: 'go', label: 'GoLang' },
      ]),
    layout: { row: 2, col: 1 },
  },
];

export default userProfileModel;
```

#### Step 3: Create the Form Hook (`hooks.ts`)

Create a custom hook in `src/modules/user-profile/hooks.ts` to encapsulate the form's logic. This hook will now directly use the `useForm` hook with the model.

```typescript
// src/modules/user-profile/hooks.ts
import { useForm } from 'react-form-builder-ts';
import userProfileModel from './model';

export function useUserProfileForm(initialValues: Record<string, any> = {}) {
  // useForm now takes the model directly
  const form = useForm(userProfileModel, { initialValues });

  const handleSubmit = async (values: Record<string, any>) => {
    console.log('Form Submitted:', values);
    // await api.save(values);
  };

  return {
    form,
    // The config is available on the form object
    config: form.config,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
```

#### Step 4: Create the Form Component (`index.tsx`)

Finally, create the main component in `src/modules/user-profile/index.tsx`. This component will use the custom hook and render the form using the `FormRenderer`.

```typescript
// src/modules/user-profile/index.tsx
import React from 'react';
import { FormRenderer, FormWrapper } from 'react-form-builder-ts';
import { useUserProfileForm } from './hooks';

export function UserProfileForm() {
  const { form, config, handleSubmit } = useUserProfileForm({
    fullName: 'John Doe',
    isDeveloper: true,
  });

  return (
    <FormWrapper title="User Profile">
      <form onSubmit={handleSubmit}>
        <FormRenderer config={config} form={form} />
        <button type="submit">Save Profile</button>
      </form>
    </FormWrapper>
  );
}
```

Now you can use the `UserProfileForm` component anywhere in your application.

---

### 3. API Reference

#### 3.1 `FormModel` & `FieldProps`

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

The `dependencies` array connects field properties to the state of another field.
`{ field: string, condition: (value) => boolean, overrides: Partial<FieldProps> }`

- `field`: The `key` of the field to depend on.
- `condition`: A function that receives the dependency field's value and returns `true` if the override should be applied.
- `overrides`: An object with `FieldProps` to apply when the condition is met (e.g., `{ hidden: false, disabled: true }`).

**Dynamic Options:**

`{ trigger: string[], loader: (values) => Promise<Array<{value, label}>> }`

- `trigger`: An array of field `key`s that should trigger a reload of the options.
- `loader`: A function that receives the entire form's `values` object and returns the new options.

#### 3.2 `useForm(model, options?)`

The core hook for managing form state. It now accepts the `FormModel` directly.

**Options:**

- `initialValues`: An object to populate the form's initial state.
- `flags`: A map of feature flags to conditionally include fields.
- `formId`: A string identifier for analytics events.
- `enableAnalytics`: Set to `false` to disable automatic event tracking.
- `eventHooks`: An object with callbacks (`onInit`, `onFieldChange`, `onFieldBlur`, `onFormSubmit`).

**Return Value (`UseFormReturn`):**

| Property              | Type                                     | Description                                                                                                 |
| --------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `config`              | `FormConfig`                             | The generated form configuration, now returned by the hook.                                                 |
| `values`              | `object`                                 | The current state of all form field values.                                                                 |
| `errors`              | `object`                                 | An object containing validation error messages for each field.                                              |
| `touched`             | `object`                                 | An object tracking which fields have been blurred.                                                          |
| `dependencies`        | `Map<string, object>`                    | A map of the resolved dependency states for each field.                                                     |
| `dynamicOptions`      | `Map<string, object[]>`                  | A map of the resolved options for fields using `dynamicOptions`.                                            |
| `isFieldVisible()`    | `(path: string) => boolean`              | A function to check if a field is currently visible, based on its `hidden` prop and dependency resolutions. |
| `isFieldDisabled()`   | `(path: string) => boolean`              | A function to check if a field is currently disabled.                                                       |
| `getEffectiveField()` | `(path: string) => ConfigField`          | A function that returns the field's configuration with all current dependency `overrides` applied.          |
| `handleChange()`      | `(path: string, value: any) => void`     | The handler for updating a field's value.                                                                   |
| `handleBlur()`        | `(path: string) => void`                 | The handler for marking a field as touched.                                                                 |
| `handleFocus()`       | `(path: string) => void`                 | The handler for field focus events.                                                                         |
| `addArrayItem()`      | `(path: string) => void`                 | Adds a new item to a field of `type: 'array'`.                                                              |
| `removeArrayItem()`   | `(path: string, index: number) => void`  | Removes an item from a field of `type: 'array'`.                                                            |
| `handleSubmit()`      | `(onSubmit) => (e?) => Promise<void>`    | A wrapper for your submit handler that runs validation first and prevents submission if invalid.            |
| `triggerValidation()` | `(fields: string[]) => Promise<boolean>` | Programmatically triggers validation for a subset of fields. Returns `true` if all are valid.               |

#### 3.3 `FormRenderer`

A component that renders the form based on a `config` and `form` object.

**Props:**

- `config`: The `FormConfig` object (now accessed from `form.config`).
- `form`: The object returned from the `useForm` hook.
- `renderers`: An object to override default renderers by field `type` (e.g., `{ text: MyCustomTextInput }`).
- `customRenderers`: An object to provide renderers for fields that have a `renderer` key in their schema (e.g., `{ myRenderer: MySpecialComponent }`).

#### 3.4 Providers

Wrap your application with these providers to enable their features.

- **`<FormProvider>`**: Provides internationalization context.
  - Props: `locale: string`, `messages: Record<string, string>`.
- **`<AnalyticsProvider>`**: Provides an event handler for analytics.
  - Props: `onEvent: (name, data) => void`.
- **`<FormWrapper>`**: A simple layout component.
  - Props: `title: string`, `loading?: boolean`.

#### 3.5 Plugin System

The library includes a plugin system to extend its core functionality.

**`FormPlugin` Interface:**

- `name: string`: A unique name for the plugin.
- `extendConfig?(model, config)`: A function to modify the `FormConfig`.
- `onValidate?(field, value)`: A function to add custom validation rules.
- `renderField?(field, form)`: A function to render a field, overriding the default renderer.

Use `registerPlugin(plugin)` to add a plugin and `unregisterPlugin(name)` to remove it.

---

### 4. Package Structure

The source code is organized as follows:

```text
/src
  /config          # buildFormConfig logic
  /events          # Event bus for analytics
  /hooks           # useForm hook
  /model           # Core TypeScript interfaces (FormModel, FieldProps)
  /performance     # Performance testing utilities
  /plugins         # Plugin API and registry
  /providers       # React context providers
  /tests           # Unit and integration tests
  /types           # Shared TypeScript types
  /ui              # FormRenderer and default input components
  /utils           # Pure utilities (validation, dependencies)
  index.ts         # Public exports
```
