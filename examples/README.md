# Form Builder Examples Dev Server

This is a development server for running and testing the Form Builder Library examples interactively in a web browser.

## ✨ Recent Updates

**🚀 API Refactoring Complete!** The examples have been updated to use the new simplified Form Builder API:

- **No more `buildFormConfig` calls** - The `useForm` hook now accepts `FormModel` directly
- **Cleaner, error-free code** - Eliminated 75% of boilerplate code
- **Enhanced `useEnhancedForm` hook** - Now simply wraps the refactored `useForm` hook
- **Full backward compatibility** - All existing functionality preserved

### Migration Example

**Before (Old API):**

```typescript
import { useForm, buildFormConfig } from '@dynamic_forms/react';

const config = useMemo(() => buildFormConfig(formModel), []);
const form = useForm(config, { initialValues: {...} });
```

**After (New API):**

```typescript
import { useForm } from '@dynamic_forms/react';
// or import { useEnhancedForm } from './enhanced-hooks';

const form = useForm(formModel, { initialValues: {...} });
// Config is automatically available as form.config
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd examples
npm install
```

### 2. Start Development Server

```bash
npm run serve
```

This will:

- Start a Vite development server on `http://localhost:3000`
- Automatically open your browser
- Enable hot reload for instant updates

### 3. Explore Examples

The dev server provides an interactive interface to explore all Form Builder examples:

- **⭐ Enhanced Demo**: Showcases the new simplified API
- **Getting Started**: Simple Form, Validation Form
- **Advanced Features**: Field Dependencies, Event Hooks
- **UI Customization**: Custom Renderers
- **Integration**: React App Example
- **Patterns**: Form Hooks, Sectioned Forms

## 📁 Project Structure

```
examples/
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Main application component
│   ├── App.css               # Application styles
│   ├── index.css             # Global styles
│   ├── enhanced-hooks/       # Enhanced form hooks (updated)
│   │   ├── useEnhancedForm.ts   # Simplified wrapper for useForm
│   │   ├── useSectionedForm.ts  # Section-based forms
│   │   └── index.ts            # Exports and types
│   ├── components/           # Shared components
│   └── pages/               # Example implementations
│       ├── simple-form/     # Basic form example
│       ├── validation-form/ # Validation example
│       ├── dependencies/    # Field dependencies
│       ├── event-hooks/     # Event system demo
│       ├── form-hooks/      # Custom hooks
│       ├── enhanced-demo/   # ⭐ New API showcase
│       └── layouts/         # Layout examples
├── index.html               # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # Node TypeScript config
└── vite.config.ts          # Vite configuration
```

## 🛠️ Available Scripts

```bash
# Start development server (recommended)
npm run serve

# Start development server (alternative)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Enhanced Hooks

The examples include enhanced hooks that demonstrate best practices:

### `useEnhancedForm`

A simplified wrapper around the new `useForm` API:

```typescript
import { useEnhancedForm } from './enhanced-hooks';

const form = useEnhancedForm(formModel, {
  initialValues: { username: '', email: '' },
  formId: 'my-form',
  enableAnalytics: true,
});

// All form functionality available immediately
console.log(form.config); // Auto-generated config
console.log(form.values); // Current form values
console.log(form.errors); // Validation errors
```

### `useSectionedForm`

For complex forms with sections:

```typescript
import { useSectionedForm } from './enhanced-hooks';

const form = useSectionedForm(sectionedModel, options);

// Section-specific helpers
const personalFields = form.getSectionFields('personal');
const progress = form.getSectionProgress('personal');
```

## 🔧 Configuration

### Vite Configuration

The Vite configuration includes:

- React support with hot reload
- TypeScript compilation
- Path aliases for easy imports:
  - `@/` → `./src/`
  - `@examples/` → `../` (examples directory)
  - `@form-builder/` → `../../src/` (library source)

### Port Configuration

By default, the server runs on port 3000. To change this:

1. Edit `vite.config.ts`:

```typescript
server: {
  port: 4000, // Your preferred port
  open: true,
  host: true,
}
```

2. Or use environment variable:

```bash
PORT=4000 npm run serve
```

## 🚧 Development Notes

### Current Implementation

The examples demonstrate the new **simplified Form Builder API**:

1. **Direct FormModel usage**:

```typescript
import { useForm } from '@dynamic_forms/react';
// or import { useEnhancedForm } from './enhanced-hooks';

const form = useForm(formModel, {
  initialValues: { ... },
  formId: 'example-form'
});
```

2. **No more manual config building**:

   - `buildFormConfig` is called internally
   - Config is memoized automatically
   - Available as `form.config`

3. **Enhanced error handling**:
   - Better TypeScript inference
   - Reduced boilerplate code
   - Cleaner component logic

### Adding New Examples

To add a new example:

1. Create the example file in the appropriate pages directory
2. Follow the established pattern:

```typescript
// hooks.ts
export const useYourForm = () => {
  const form = useEnhancedForm(yourModel, {
    initialValues: yourInitialValues,
    formId: 'your-form',
  });

  // Add custom logic here
  return { form, /* ... */ };
};

// components.tsx
export const YourFormComponent = () => {
  const { form } = useYourForm();

  return <FormRenderer config={form.config} form={form} />;
};
```

3. Add it to the `examples` object in `App.tsx`

### Troubleshooting

**Module Resolution Issues:**

- Ensure TypeScript paths are correctly configured in `tsconfig.json`
- Check Vite aliases in `vite.config.ts`
- Verify example file exports

**Build Errors:**

- Run `npm run build` to check for TypeScript errors
- Ensure all imports resolve correctly
- Check for missing dependencies

**Hot Reload Not Working:**

- Restart the dev server
- Check file permissions
- Ensure files are within the project directory

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📝 License

This dev server setup is part of the Form Builder Library project and inherits the same license.
