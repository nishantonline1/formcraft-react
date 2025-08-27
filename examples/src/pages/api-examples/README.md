# API Examples

This directory contains comprehensive examples for each major API in the React Form Builder Library. Each example demonstrates practical usage patterns and best practices.

## Examples Overview

### Core Functions

- **[createFormConfig](./createFormConfig/)** - Configuration generation without React
- **[useFormConfig](./useFormConfig/)** - Enhanced React hook examples

### UI Components

- **[FormRenderer](./FormRenderer/)** - Form rendering with custom renderers
- **[Individual Components](./individual-components/)** - Using specific field components

### Advanced Features

- **[Dynamic Options](./dynamic-options/)** - Loading options based on other fields
- **[Field Dependencies](./field-dependencies/)** - Conditional field behavior
- **[Array Fields](./array-fields/)** - Managing dynamic arrays
- **[Custom Validation](./custom-validation/)** - Complex validation scenarios

### Performance & Optimization

- **[Bundle Optimization](./bundle-optimization/)** - Minimizing bundle sizes
- **[Performance Monitoring](./performance-monitoring/)** - Tracking form performance

### Migration Examples

- **[Migration Patterns](./migration-patterns/)** - Before/after migration examples

## Running the Examples

Each example is a self-contained React component that can be run independently:

```bash
# Navigate to examples directory
cd examples

# Install dependencies
npm install

# Start development server
npm run dev

# Navigate to API Examples in the browser
# http://localhost:5173/api-examples
```

## Example Structure

Each example follows this structure:

```
example-name/
├── index.tsx          # Main component
├── model.ts           # Form model definition
├── hooks.ts           # Custom hooks (if needed)
├── components.tsx     # Custom components (if needed)
├── styles.css         # Styling
└── README.md          # Detailed explanation
```

## Key Learning Points

### 1. Configuration-First Approach

Learn how to generate form configurations that work with any UI framework.

### 2. React Integration

Understand how to use the enhanced React hooks for better developer experience.

### 3. Bundle Optimization

See how to minimize bundle sizes by importing only what you need.

### 4. Performance Best Practices

Learn techniques for optimizing form performance and user experience.

### 5. Migration Strategies

Understand how to migrate from older versions while maintaining compatibility.

## Best Practices Demonstrated

- **Separation of Concerns**: Model, logic, and UI are clearly separated
- **Type Safety**: Full TypeScript support with proper type definitions
- **Performance**: Optimized rendering and state management
- **Accessibility**: Proper form accessibility patterns
- **Testing**: Examples include test patterns and utilities

## Getting Help

If you need help with any of the examples:

1. Check the README in each example directory
2. Review the main [API Documentation](../../API_DOCUMENTATION.md)
3. Consult the [Migration Guide](../../../MIGRATION_GUIDE.md)
4. Open an issue on GitHub for specific questions
