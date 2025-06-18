# Advanced Validation Form Example

This example demonstrates comprehensive validation patterns using the Form Builder Library with multiple validation rules per field and real-time feedback.

## 🎯 **Features Demonstrated**

- ✅ **Email Validation** - Format validation with regex patterns
- ✅ **Password Strength** - Complex validation with multiple criteria
- ✅ **Age Range Validation** - Custom numeric validation with constraints
- ✅ **Username Rules** - Format, length, and character validation
- ✅ **Real-time Dashboard** - Live validation status and statistics
- ✅ **Smart Error Messages** - Priority-based error display
- ✅ **Cross-field Validation** - Password confirmation checking
- ✅ **Form State Management** - Complete submission state tracking

## 📁 **Architecture**

```
validation-form/
├── model.ts          # Form configuration and validation logic
├── hooks.ts          # Custom hooks for state management
├── components.tsx    # UI components and dashboard
├── index.tsx        # Main export and documentation
└── README.md        # This documentation
```

## 🔧 **Usage**

```tsx
import { ValidationFormWrapper } from './pages/validation-form';

function App() {
  return <ValidationFormWrapper />;
}
```

## 📊 **Validation Rules**

### Email Validation

- Required field
- Valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)

### Password Validation

- Required field
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Age Validation

- Required field
- Minimum age: 18
- Maximum age: 120
- Must be a valid number

### Username Validation

- Required field
- 3-20 characters length
- Only letters, numbers, and underscores
- Cannot start with a number

## 🎛️ **Components**

### `ValidationStatusDashboard`

Real-time dashboard showing:

- Valid vs total fields
- Error count
- Touched fields
- Completion percentage

### `ValidationSubmitButton`

Smart submit button that:

- Disables when form has errors
- Shows appropriate feedback messages
- Handles form submission state

### `ValidationDebugInfo`

Development panel displaying:

- Current form values
- Validation errors
- Touched field states

## 🪝 **Custom Hooks**

### `useValidationForm()`

Main hook providing:

- Form configuration
- Form state management
- Submit handler

### `useValidationStats()`

Statistics hook calculating:

- Field counts and percentages
- Validation metrics
- Completion status

### `useValidationState()`

State hook determining:

- Submit eligibility
- Form interaction state
- Error presence

## 💡 **Key Concepts**

1. **Modular Validation** - Each field has its own validation function
2. **Real-time Feedback** - Instant validation as user types
3. **Priority Errors** - Show most important error first
4. **State Tracking** - Complete form interaction monitoring
5. **Reusable Logic** - Hooks and functions can be reused

## 🚀 **Extension Points**

- Add new validation rules in `model.ts`
- Extend dashboard metrics in `hooks.ts`
- Create custom components in `components.tsx`
- Implement cross-field validation patterns

## 📝 **Example Validation Function**

```typescript
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
```
