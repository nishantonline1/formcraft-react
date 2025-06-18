# Form Builder Plugin System

The Form Builder includes a powerful plugin system that allows you to extend form functionality with custom validation, config modifications, and field rendering.

## Plugin Interface

```typescript
interface FormPlugin {
  name: string;
  extendConfig?(model: FormModel, config: FormConfig): FormConfig;
  onValidate?(field: ConfigField, value: unknown): string[];
  renderField?(
    field: ConfigField,
    form: UseFormReturn,
  ): React.JSX.Element | null;
}
```

## Core Functions

- `registerPlugin(plugin: FormPlugin)` - Register a plugin globally
- `unregisterPlugin(name: string)` - Remove a plugin by name
- `getRegisteredPlugins()` - Get all registered plugins
- `clearPlugins()` - Clear all plugins (useful for testing)

## Plugin Methods

### 1. `extendConfig` - Modify Form Configuration

Modify or augment the FormConfig before it's used by the form.

```typescript
const addDefaultsPlugin: FormPlugin = {
  name: 'add-defaults',
  extendConfig: (model, config) => ({
    ...config,
    fields: config.fields.map((field) => ({
      ...field,
      meta: {
        ...field.meta,
        timestamp: Date.now(),
        version: '1.0',
      },
    })),
  }),
};
```

### 2. `onValidate` - Custom Field Validation

Add custom validation logic that runs alongside built-in validators.

```typescript
const businessRulesPlugin: FormPlugin = {
  name: 'business-rules',
  onValidate: (field, value) => {
    const errors: string[] = [];

    // Custom email domain validation
    if (field.meta?.emailDomain && typeof value === 'string') {
      const requiredDomain = field.meta.emailDomain;
      if (!value.endsWith(`@${requiredDomain}`)) {
        errors.push(`Email must be from ${requiredDomain} domain`);
      }
    }

    // Password strength validation
    if (
      field.meta?.validation === 'strong-password' &&
      typeof value === 'string'
    ) {
      if (value.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
      if (!/[A-Z]/.test(value)) {
        errors.push('Password must contain uppercase letter');
      }
      if (!/[0-9]/.test(value)) {
        errors.push('Password must contain a number');
      }
    }

    return errors;
  },
};
```

### 3. `renderField` - Custom Field Rendering

Override default field rendering for special field types.

```typescript
const customRenderersPlugin: FormPlugin = {
  name: 'custom-renderers',
  renderField: (field, form) => {
    // Render color picker for color fields
    if (field.meta?.fieldType === 'color') {
      return (
        <div key={field.id}>
          <label>{field.label}</label>
          <input
            type="color"
            value={form.values[field.path] || '#000000'}
            onChange={(e) => form.handleChange(field.path, e.target.value)}
            onBlur={() => form.handleBlur(field.path)}
          />
        </div>
      );
    }

    // Render rich text editor for content fields
    if (field.meta?.fieldType === 'richtext') {
      return (
        <div key={field.id}>
          <label>{field.label}</label>
          <textarea
            value={form.values[field.path] || ''}
            onChange={(e) => form.handleChange(field.path, e.target.value)}
            onBlur={() => form.handleBlur(field.path)}
            className="rich-text-editor"
            rows={10}
          />
        </div>
      );
    }

    return null; // Let other plugins or default renderer handle
  }
};
```

## Built-in Plugins

### Email Validation Plugin

Validates email format for fields with `meta: { validation: 'email' }`.

### Phone Validation Plugin

Validates US phone number format for fields with `meta: { validation: 'phone' }`.

### Field Dependency Plugin

Processes field dependencies and adds metadata for conditional field display.

### Debug Plugin

Adds debug information for fields with `meta: { debug: true }`.

## Usage Examples

### Basic Plugin Registration

```typescript
import { registerPlugin, emailValidationPlugin } from '@org/form-builder';

// Register built-in plugin
registerPlugin(emailValidationPlugin);

// Register custom plugin
registerPlugin({
  name: 'my-custom-plugin',
  onValidate: (field, value) => {
    if (field.key === 'username' && value === 'admin') {
      return ['Username "admin" is reserved'];
    }
    return [];
  },
});
```

### Form Model with Plugin Features

```typescript
const userFormModel: FormModel = [
  {
    key: 'email',
    type: 'text',
    label: 'Work Email',
    validators: { required: true },
    meta: {
      validation: 'email',
      emailDomain: 'company.com',
    },
  },
  {
    key: 'password',
    type: 'text',
    label: 'Password',
    validators: { required: true },
    meta: { validation: 'strong-password' },
  },
  {
    key: 'favoriteColor',
    type: 'text',
    label: 'Favorite Color',
    meta: { fieldType: 'color' },
  },
];
```

### Plugin Lifecycle

1. **Config Building**: `extendConfig` methods run when `buildFormConfig()` is called
2. **Field Validation**: `onValidate` methods run during field validation
3. **Field Rendering**: `renderField` methods run when rendering fields (if using FormRenderer)

### Error Handling

Plugins are designed to fail gracefully:

- Config extension errors return the original config
- Validation errors are logged and ignored
- Rendering errors return null (fallback to default renderer)

### Testing Plugins

```typescript
import { clearPlugins, registerPlugin } from '@org/form-builder';

describe('My Plugin', () => {
  beforeEach(() => {
    clearPlugins(); // Start with clean slate
  });

  it('validates correctly', () => {
    registerPlugin(myPlugin);
    // ... test plugin behavior
  });
});
```

## Best Practices

1. **Unique Names**: Always use unique, descriptive plugin names
2. **Error Handling**: Don't throw errors; return empty arrays or null
3. **Performance**: Keep plugin logic lightweight
4. **Testing**: Test plugins in isolation with `clearPlugins()`
5. **Metadata**: Use `field.meta` for plugin-specific configuration
6. **Graceful Degradation**: Always handle missing or invalid data
