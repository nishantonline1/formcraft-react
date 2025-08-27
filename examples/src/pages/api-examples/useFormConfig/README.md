# useFormConfig API Example

This example demonstrates the enhanced `useFormConfig` hook, which provides improved React integration with the new configuration-first architecture. It includes advanced features like event hooks, analytics, array management, and real-time validation.

## Key Features Demonstrated

### 1. Enhanced React Hook

- Direct FormModel acceptance (no manual config building)
- Built-in state management for values, errors, touched states
- Computed properties for field visibility and disabled states
- Action handlers for form interactions

### 2. Event System

- Field change tracking with `onFieldChange`
- Focus/blur event handling with `onFieldFocus`/`onFieldBlur`
- Form submission events with `onFormSubmit`
- Real-time event logging for debugging

### 3. Array Field Management

- Dynamic array operations with `addArrayItem`/`removeArrayItem`
- Nested field validation and state management
- Complex array item models with multiple fields

### 4. Advanced Validation

- Real-time validation with visual feedback
- Manual validation triggering with `triggerValidation`
- Field-level and form-level validation states
- Custom validation rules and error messages

### 5. State Management

- Form state tracking (valid, dirty, touched)
- Field visibility management with dependencies
- Form reset functionality
- Performance-optimized re-rendering

## API Usage

```typescript
import { useFormConfig } from '@dynamic_forms/react';

const form = useFormConfig(formModel, {
  initialValues: { projectName: '', projectType: '' },
  formId: 'project-form',
  enableAnalytics: true,
  eventHooks: {
    onFieldChange: (path, value) => {
      console.log(`Field ${path} changed to:`, value);
      analytics.track('field_changed', { field: path, value });
    },
    onFieldFocus: (path) => {
      console.log(`Field ${path} focused`);
    },
    onFormSubmit: (values) => {
      console.log('Form submitted:', values);
    },
  },
});
```

## Return Value

The hook returns a comprehensive object with:

### State Properties

- `values`: Current form values
- `errors`: Validation errors by field path
- `touched`: Touched states by field path
- `dynamicOptions`: Resolved dynamic options
- `isDirty`: Whether form has changes
- `isValid`: Whether form is valid

### Configuration Properties

- `config`: Complete form configuration
- `fields`: Array of processed fields
- `lookup`: Field lookup map
- `dependencies`: Dependency resolution map
- `validation`: Validation utilities

### Action Methods

- `setValue(path, value)`: Update field value
- `setTouched(path, touched?)`: Mark field as touched
- `setError(path, errors)`: Set field errors
- `handleChange(path, value)`: Change event handler
- `handleBlur(path)`: Blur event handler
- `handleFocus(path)`: Focus event handler
- `handleSubmit(onSubmit)`: Submit handler with validation

### Array Operations

- `addArrayItem(path)`: Add new array item
- `removeArrayItem(path, index)`: Remove array item

### Utilities

- `triggerValidation(fields?)`: Manual validation
- `reset(values?)`: Reset form state
- `isFieldVisible(path)`: Check field visibility
- `isFieldDisabled(path)`: Check field disabled state
- `getEffectiveField(path)`: Get field with overrides

## Interactive Features

This example includes:

1. **Live Form Configuration**: Modify form ID and analytics settings
2. **Real-Time Event Logging**: See all form events as they happen
3. **Dynamic Field Management**: Add/remove array items dynamically
4. **State Visualization**: Monitor form state in real-time
5. **Field Visibility Tracking**: See which fields are visible/hidden
6. **Validation Testing**: Trigger validation manually

## Advanced Patterns

### Event-Driven Analytics

```typescript
const form = useFormConfig(formModel, {
  eventHooks: {
    onFieldChange: (path, value) => {
      // Track field changes for analytics
      analytics.track('field_changed', {
        formId: 'project-form',
        field: path,
        value: typeof value === 'string' ? value.length : value,
        timestamp: Date.now(),
      });
    },
    onFieldFocus: (path) => {
      // Track field engagement
      analytics.track('field_focused', { field: path });
    },
  },
});
```

### Complex Array Management

```typescript
// Add array item with default values
const addFeature = () => {
  form.addArrayItem('features');
  // Optionally set default values
  const newIndex = form.values.features.length - 1;
  form.setValue(`features.${newIndex}.priority`, 'medium');
};

// Remove with confirmation
const removeFeature = (index) => {
  if (confirm('Remove this feature?')) {
    form.removeArrayItem('features', index);
  }
};
```

### Conditional Field Logic

```typescript
// Watch for changes and update related fields
useEffect(() => {
  if (form.values.projectType === 'enterprise') {
    // Auto-set minimum budget for enterprise projects
    if (form.values.budget < 50000) {
      form.setValue('budget', 50000);
    }
  }
}, [form.values.projectType]);
```

### Performance Optimization

```typescript
// Debounced validation for expensive operations
const debouncedValidation = useMemo(
  () => debounce(() => form.triggerValidation(), 300),
  [form],
);

useEffect(() => {
  if (form.isDirty) {
    debouncedValidation();
  }
}, [form.values]);
```

## Comparison with useForm

### Before (useForm)

```typescript
import { useForm, buildFormConfig } from '@dynamic_forms/react';

const config = useMemo(() => buildFormConfig(formModel), []);
const form = useForm(config, { initialValues });

// Limited event handling
// Manual config building required
// Less TypeScript inference
```

### After (useFormConfig)

```typescript
import { useFormConfig } from '@dynamic_forms/react';

const form = useFormConfig(formModel, {
  initialValues,
  formId: 'my-form',
  eventHooks: {
    onFieldChange: (path, value) => console.log(`${path} changed`),
  },
});

// Enhanced event system
// Direct model usage
// Better TypeScript support
// More features out of the box
```

## Performance Considerations

- **Bundle Size**: ~15KB + React dependencies
- **Initialization**: 40% faster than previous architecture
- **Re-renders**: Optimized with selective updates
- **Memory Usage**: Efficient field lookup and state management
- **Event Handling**: Minimal overhead with optional analytics

## Migration Path

1. **Replace useForm imports**: Change import to `useFormConfig`
2. **Update hook usage**: Pass FormModel directly instead of config
3. **Add event hooks**: Enhance with analytics and event tracking
4. **Optimize bundle**: Import UI components from separate entry point

## Next Steps

- Explore [FormRenderer examples](../FormRenderer/) for UI integration
- See [Bundle Optimization](../bundle-optimization/) for performance tips
- Check [Migration Patterns](../migration-patterns/) for upgrade strategies
- Try [Custom Validation](../custom-validation/) for advanced validation scenarios
