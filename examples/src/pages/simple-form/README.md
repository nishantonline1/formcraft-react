# Simple Form Example

This example demonstrates the Form Builder library's native dependency system with a clean, maintainable architecture.

## Architecture

The example follows a proper separation of concerns pattern:

```
simple-form/
├── model.ts         # Form configuration, data, and API simulation
├── hooks.ts         # Custom hooks for form logic and state management
├── components.tsx   # Reusable UI components
├── index.tsx        # Main export and documentation
└── README.md        # This file
```

## Features Demonstrated

### 🔗 **Dependency System**

- **Category → SubCategory**: SubCategory enables when Category is selected
- **SubCategory → Item**: Item enables when SubCategory is selected
- **SubCategory → Related Parts**: Related Parts enables when SubCategory is selected

### 📊 **Dynamic Options**

- Categories: Static options loaded on mount
- SubCategories: Dynamic options loaded based on selected Category
- Items: Dynamic options loaded based on selected SubCategory
- Related Parts: Dynamic options loaded based on selected SubCategory

### 🎯 **State Management**

- Form validation with real-time feedback
- Field enabling/disabling based on dependencies
- Dynamic options loading and caching
- Comprehensive form statistics tracking

### 🎨 **UI Components**

- **FormRenderer**: Automatic field rendering with grid layout
- **FormStatusDashboard**: Real-time visualization of form state
- **SubmitButton**: Smart submit button with validation state

## File Breakdown

### `model.ts`

Contains all form-related data and configuration:

- **Type Definitions**: TypeScript interfaces for type safety
- **Mock Data**: Simulated API data for all field options
- **API Functions**: Async functions that simulate real API calls
- **Form Model**: Complete FormBuilder configuration with dependencies
- **Initial Values**: Default form state

### `hooks.ts`

Custom hooks that encapsulate form logic:

- **`useSimpleForm()`**: Main hook that sets up form configuration and state
- **`useFormStats()`**: Calculates form statistics and metrics
- **`useFormValidation()`**: Manages form validation state

### `components.tsx`

Reusable UI components:

- **`FormStatusDashboard`**: Shows real-time form state and statistics
- **`SubmitButton`**: Submit button with validation feedback
- **`SimpleFormComponent`**: Main form component that combines everything

### `index.tsx`

Main entry point:

- **`SimpleFormWrapper`**: Primary export for use in App.tsx
- **Re-exports**: All components, hooks, and model exports for flexibility

## Usage Examples

### Basic Usage

```tsx
import { SimpleFormWrapper } from './examples/simple-form';

function App() {
  return <SimpleFormWrapper />;
}
```

### Custom Implementation

```tsx
import { useSimpleForm, FormStatusDashboard } from './examples/simple-form';

function CustomForm() {
  const { config, form, handleSubmit } = useSimpleForm();

  return (
    <div>
      <FormRenderer config={config} form={form} />
      <FormStatusDashboard form={form} config={config} />
    </div>
  );
}
```

### Using Individual Components

```tsx
import {
  SubmitButton,
  useFormValidation,
  simpleFormModel,
} from './examples/simple-form';

// Use just the submit button with your own form
function MyForm() {
  const validation = useFormValidation(myForm);
  return <SubmitButton form={myForm} onSubmit={myHandler} />;
}
```

## Key Concepts

### **Dependency Configuration**

```typescript
{
  key: 'subCategory',
  dependencies: [
    {
      field: 'category',
      condition: (value) => !!value && value !== '',
      overrides: { disabled: false },
    },
  ],
}
```

### **Dynamic Options**

```typescript
{
  key: 'item',
  dynamicOptions: {
    trigger: ['subCategory'],
    loader: loadItems,
  },
}
```

### **Layout Grid**

```typescript
{
  key: 'category',
  layout: { row: 0, col: 0 },  // First row, first column
}
```

## Benefits

1. **Maintainable**: Clear separation of concerns makes code easy to understand and modify
2. **Reusable**: Components and hooks can be used individually in other forms
3. **Type Safe**: Full TypeScript support with proper type definitions
4. **Testable**: Each file has a single responsibility and can be tested independently
5. **Scalable**: Easy to add new fields, dependencies, or customize behavior
6. **Performance**: Optimized with proper memoization and dependency tracking

This structure serves as a template for building complex forms with the Form Builder library while maintaining clean, professional code organization.
