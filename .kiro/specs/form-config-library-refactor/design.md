# Design Document

## Overview

The refactored React Form Builder library will be restructured as a configuration-first library that separates core form logic from UI rendering components. The primary focus shifts from being a complete form rendering solution to being a powerful form configuration generator that can work with any UI framework while maintaining React 17+ compatibility.

### Key Design Principles

1. **Configuration-First Architecture**: The main export will be form configuration generation, not components
2. **Optional UI Components**: Rendering components become optional, tree-shakeable imports
3. **Framework Agnostic Core**: Core logic works independently of React rendering
4. **Backward Compatibility**: Existing schemas and APIs remain unchanged
5. **Bundle Size Optimization**: Clear separation allows minimal imports for configuration-only usage

## Architecture

### Core Architecture Changes

The library will be restructured into three distinct layers:

```
┌─────────────────────────────────────────┐
│           Application Layer             │
│  (Consumer's custom UI components)      │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Optional UI Layer               │
│  (FormRenderer, Input Components)       │
│         [Tree-shakeable]                │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│          Core Logic Layer               │
│  (Configuration, Validation, State)     │
│         [Always included]               │
└─────────────────────────────────────────┘
```

### Module Structure Redesign

```
/src
  /core                    # Core configuration logic (always included)
    /config               # buildFormConfig and related utilities
    /validation           # Field validation logic
    /dependencies         # Dependency resolution
    /state               # Form state management utilities
    /types               # Core type definitions
    index.ts             # Core exports

  /hooks                  # React hooks (minimal React dependency)
    useFormConfig.ts     # New lightweight config-only hook
    useForm.ts          # Enhanced existing hook
    index.ts

  /ui                     # Optional UI components (tree-shakeable)
    /renderers           # Individual field renderers
    FormRenderer.tsx     # Main form renderer
    index.ts            # UI exports

  /providers             # Optional React providers
    index.ts

  /plugins               # Plugin system
    index.ts

  /events                # Event system
    index.ts

  /utils                 # Shared utilities
    index.ts

  index.ts              # Main entry point (config-first exports)
  ui.ts                 # Separate UI entry point
  full.ts               # Complete library entry point
```

## Components and Interfaces

### Core Configuration Engine

#### Primary Export: `createFormConfig`

```typescript
export interface FormConfigOptions {
  flags?: Record<string, boolean>;
  initialValues?: FormValues;
  enableDependencies?: boolean;
  enableValidation?: boolean;
}

export interface FormConfigResult {
  config: FormConfig;
  fields: ConfigField[];
  lookup: Record<string, ConfigField>;
  dependencies: Map<string, DependencyResolution>;
  validation: {
    validateField: (path: string, value: FormValue) => string[];
    validateAll: (values: FormValues) => ValidationErrors;
  };
  state: {
    getFieldVisibility: (path: string, values: FormValues) => boolean;
    getFieldDisabled: (path: string, values: FormValues) => boolean;
    getEffectiveField: (path: string, values: FormValues) => ConfigField;
  };
}

export function createFormConfig(
  model: FormModel,
  options?: FormConfigOptions,
): FormConfigResult;
```

#### Enhanced `useFormConfig` Hook

```typescript
export interface UseFormConfigOptions extends FormConfigOptions {
  formId?: string;
  enableAnalytics?: boolean;
  eventHooks?: EventHooks;
}

export interface UseFormConfigReturn extends FormConfigResult {
  values: FormValues;
  errors: ValidationErrors;
  touched: TouchedFields;
  dynamicOptions: Map<string, OptionItem[]>;

  // State management
  setValue: (path: string, value: FormValue) => void;
  setTouched: (path: string, touched?: boolean) => void;
  setError: (path: string, errors: string[]) => void;

  // Computed properties
  isFieldVisible: (path: string) => boolean;
  isFieldDisabled: (path: string) => boolean;
  getEffectiveField: (path: string) => ConfigField;

  // Actions
  handleChange: (path: string, value: FormValue) => void;
  handleBlur: (path: string) => void;
  handleFocus: (path: string) => void;
  handleSubmit: (onSubmit: SubmitHandler) => SubmitFunction;

  // Array operations
  addArrayItem: (path: string) => void;
  removeArrayItem: (path: string, index: number) => void;

  // Validation
  triggerValidation: (fields?: string[]) => Promise<boolean>;

  // Utilities
  reset: (values?: FormValues) => void;
  isDirty: boolean;
  isValid: boolean;
}

export function useFormConfig(
  model: FormModel,
  options?: UseFormConfigOptions,
): UseFormConfigReturn;
```

### Backward Compatibility Layer

The existing `useForm` hook will be maintained as a wrapper around `useFormConfig`:

```typescript
export function useForm(
  model: FormModel,
  options?: UseFormOptions,
): UseFormReturn {
  const configResult = useFormConfig(model, options);

  return {
    config: configResult.config,
    values: configResult.values,
    errors: configResult.errors,
    touched: configResult.touched,
    dependencies: configResult.dependencies,
    dynamicOptions: configResult.dynamicOptions,
    isFieldVisible: configResult.isFieldVisible,
    isFieldDisabled: configResult.isFieldDisabled,
    getEffectiveField: configResult.getEffectiveField,
    handleChange: configResult.handleChange,
    handleBlur: configResult.handleBlur,
    handleFocus: configResult.handleFocus,
    addArrayItem: configResult.addArrayItem,
    removeArrayItem: configResult.removeArrayItem,
    handleSubmit: configResult.handleSubmit,
    triggerValidation: configResult.triggerValidation,
  };
}
```

### Optional UI Components

UI components will be moved to separate entry points and made completely optional:

```typescript
// From '@dynamic_forms/react/ui'
export { FormRenderer } from './FormRenderer';
export {
  TextInput,
  NumberInput,
  Dropdown,
  DatePicker,
  CheckboxInput,
  ArrayFieldWrapper,
} from './renderers';
export type {
  FieldRenderer,
  FieldRendererProps,
  FormRendererProps,
} from './FormRenderer';
```

### Entry Points Design

#### Main Entry Point (`index.ts`)

```typescript
// Core configuration exports (always included)
export { createFormConfig, useFormConfig } from './core';
export type {
  FormConfigResult,
  UseFormConfigReturn,
  FormConfigOptions,
} from './core';

// Model and type exports
export * from './model';
export * from './types';

// Utility exports
export * from './utils';

// Backward compatibility (wraps core functionality)
export { useForm } from './hooks';
export type { UseFormReturn } from './hooks';

// Plugin system
export * from './plugins';

// Event system
export * from './events';
```

#### UI Entry Point (`ui.ts`)

```typescript
// Optional UI components
export * from './ui';
export * from './providers';
```

#### Full Library Entry Point (`full.ts`)

```typescript
// Everything together for backward compatibility
export * from './index';
export * from './ui';
```

## Data Models

### Enhanced FormConfig Structure

```typescript
export interface FormConfig {
  fields: ConfigField[];
  lookup: Record<string, ConfigField>;
  metadata: {
    fieldCount: number;
    hasArrayFields: boolean;
    hasDependencies: boolean;
    hasValidation: boolean;
    requiredFields: string[];
    optionalFields: string[];
  };
  computed: {
    dependencyGraph: Map<string, string[]>;
    validationRules: Map<string, ValidationRule[]>;
    defaultValues: FormValues;
  };
}
```

### State Management Models

```typescript
export interface FormState {
  values: FormValues;
  errors: ValidationErrors;
  touched: TouchedFields;
  dirty: Record<string, boolean>;
  submitted: boolean;
  isSubmitting: boolean;
}

export interface ComputedState {
  visibleFields: Set<string>;
  disabledFields: Set<string>;
  requiredFields: Set<string>;
  validFields: Set<string>;
  invalidFields: Set<string>;
}
```

## Error Handling

### Validation Error Structure

```typescript
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  fieldErrors: Record<string, ValidationError[]>;
}
```

### Error Boundaries

```typescript
export interface FormErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

export function FormErrorBoundary(
  props: FormErrorBoundaryProps,
): React.JSX.Element;
```

## Testing Strategy

### Unit Testing Approach

1. **Core Logic Tests**: Test configuration generation, validation, and dependency resolution independently
2. **Hook Tests**: Test React hooks with React Testing Library
3. **Component Tests**: Test UI components in isolation
4. **Integration Tests**: Test complete form workflows

### Test Structure

```
/src
  /core
    __tests__/
      config.test.ts
      validation.test.ts
      dependencies.test.ts
  /hooks
    __tests__/
      useFormConfig.test.ts
      useForm.test.ts
  /ui
    __tests__/
      FormRenderer.test.tsx
      renderers/
        TextInput.test.tsx
        ...
  /integration
    __tests__/
      complete-form.test.tsx
      backward-compatibility.test.tsx
```

### Performance Testing

```typescript
export interface PerformanceMetrics {
  configGenerationTime: number;
  validationTime: number;
  dependencyResolutionTime: number;
  renderTime: number;
  memoryUsage: number;
}

export function measureFormPerformance(
  model: FormModel,
  operations: number,
): Promise<PerformanceMetrics>;
```

## Migration Strategy

### Phase 1: Core Refactoring

- Extract core logic to `/core` directory
- Create `createFormConfig` function
- Implement `useFormConfig` hook
- Maintain existing exports for backward compatibility

### Phase 2: UI Separation

- Move UI components to separate entry points
- Update build configuration for multiple entry points
- Implement tree-shaking optimizations
- Create migration documentation

### Phase 3: Documentation and Examples

- Update README with new architecture
- Create migration guides
- Update examples to show both approaches
- Performance benchmarking documentation

### Backward Compatibility Guarantees

1. **Existing `useForm` hook**: Will continue to work exactly as before
2. **FormModel schemas**: No changes required to existing schemas
3. **Component APIs**: FormRenderer and field components maintain same props
4. **Import paths**: Main imports remain the same, new imports are additive

### Breaking Changes (Major Version)

1. **Default export change**: Main export becomes `createFormConfig` instead of mixed exports
2. **Bundle structure**: UI components require explicit import from `/ui` entry point
3. **Peer dependencies**: React becomes optional for core functionality

## Implementation Notes

### Build Configuration

```typescript
// tsup.config.ts
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    external: ['react', 'react-dom'],
  },
  {
    entry: ['src/ui.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/ui',
    external: ['react', 'react-dom'],
  },
  {
    entry: ['src/full.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/full',
    external: ['react', 'react-dom'],
  },
]);
```

### Package.json Updates

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./ui": {
      "types": "./dist/ui/ui.d.ts",
      "import": "./dist/ui/ui.js",
      "require": "./dist/ui/ui.cjs"
    },
    "./full": {
      "types": "./dist/full/full.d.ts",
      "import": "./dist/full/full.js",
      "require": "./dist/full/full.cjs"
    }
  },
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    }
  }
}
```

This design maintains full backward compatibility while enabling the new configuration-first architecture that meets all the requirements for React 17+ compatibility, optional UI components, and bundle size optimization.
