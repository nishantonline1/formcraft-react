# createFormConfig API Example

This example demonstrates the `createFormConfig` function, which generates form configurations without React dependencies. This is perfect for server-side rendering, non-React environments, or when you need form configuration logic separate from UI components.

## Key Features Demonstrated

### 1. Configuration Generation

- Generate complete form configurations from FormModel
- Support for initial values and feature flags
- Dependency resolution without React state
- Validation rule processing

### 2. Framework Agnostic

- Works in Node.js server environments
- Compatible with Vue.js, Angular, or vanilla JavaScript
- No React dependencies required
- Perfect for API endpoints

### 3. Performance Benefits

- Pre-generate configurations at build time
- Reduce client-side processing
- Faster initial page loads
- Optimal for server-side rendering

## API Usage

```typescript
import { createFormConfig } from '@dynamic_forms/react';

const configResult = createFormConfig(formModel, {
  initialValues: { name: '', email: '' },
  flags: { betaFeatures: true },
  enableDependencies: true,
  enableValidation: true,
});

// Access generated configuration
console.log('Fields:', configResult.fields);
console.log('Dependencies:', configResult.dependencies);
console.log('Validation:', configResult.validation);
```

## Return Value

The function returns a `FormConfigResult` object containing:

- **config**: Complete enhanced form configuration
- **fields**: Array of processed field configurations
- **lookup**: Map for quick field lookups by path
- **dependencies**: Resolved dependency states
- **validation**: Validation utilities and rules
- **state**: Field state query functions

## Use Cases

### Server-Side Rendering

```typescript
// server.js
app.get('/form/:formId', (req, res) => {
  const model = getFormModel(req.params.formId);
  const config = createFormConfig(model, {
    initialValues: getUserData(req.user.id),
    flags: getUserFeatureFlags(req.user.id),
  });

  res.render('form', {
    formConfig: config.config,
    fields: config.fields,
  });
});
```

### API Endpoints

```typescript
// Provide form configurations via REST API
app.get('/api/form-config/:type', (req, res) => {
  const model = getFormModelByType(req.params.type);
  const result = createFormConfig(model, {
    initialValues: getDefaultValues(req.params.type),
    flags: getFeatureFlags(req.user?.plan),
  });

  res.json({
    fields: result.fields,
    dependencies: Array.from(result.dependencies.entries()),
    validation: result.validation,
  });
});
```

### Non-React Frameworks

```typescript
// Vue.js usage
import { createFormConfig } from '@dynamic_forms/react';

export default {
  data() {
    return {
      formConfig: null,
      formData: {},
    };
  },

  async created() {
    const result = createFormConfig(this.formModel, {
      initialValues: this.initialData,
    });

    this.formConfig = result.config;
    this.formData = result.config.initialValues;
  },
};
```

### Build-Time Generation

```typescript
// build-script.js
import { createFormConfig } from '@dynamic_forms/react';
import fs from 'fs';

const forms = ['registration', 'profile', 'settings'];

forms.forEach((formType) => {
  const model = require(`./models/${formType}.js`);
  const config = createFormConfig(model, {
    enableDependencies: true,
    enableValidation: true,
  });

  fs.writeFileSync(
    `./dist/configs/${formType}.json`,
    JSON.stringify(config.config, null, 2),
  );
});
```

## Interactive Features

This example includes:

1. **Live Configuration**: Modify initial values and see the configuration update
2. **Feature Flags**: Toggle flags to see their effect on field inclusion
3. **Dependency Visualization**: See how field dependencies are resolved
4. **Code Examples**: Real-world usage patterns and server-side examples

## Performance Considerations

- **Bundle Size**: ~15KB for core functionality only
- **Initialization**: Fast configuration generation without React overhead
- **Memory Usage**: Efficient field lookup and dependency resolution
- **Scalability**: Handles complex forms with hundreds of fields

## Migration from useForm

If you're currently using `useForm` and want to extract configuration logic:

```typescript
// Before: React-only usage
const form = useForm(formModel, { initialValues });

// After: Extract configuration logic
const configResult = createFormConfig(formModel, { initialValues });
// Use configResult.config with any UI framework
```

## Next Steps

- Try the [useFormConfig example](../useFormConfig/) for React integration
- Explore [Bundle Optimization](../bundle-optimization/) for performance tips
- See [Migration Patterns](../migration-patterns/) for upgrade strategies
