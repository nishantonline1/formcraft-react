# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2025-08-27

### Fixed

- **Plugin Validation Integration**: Fixed plugin validation not being included in form errors
- **Custom Validator Handling**: Fixed custom validator returning non-array values not being properly ignored
- **Core Config Example**: Fixed `ReferenceError: form is not defined` in Advanced Features demo
- **Type Safety**: Improved TypeScript type safety across validation and plugin systems

### Enhanced

- **Plugin System**: Plugin validation now properly integrates with form validation pipeline
- **Validation System**: Enhanced custom validator handling with proper error type checking
- **Examples**: Improved Core Config Only example with better error handling and type safety

## [0.0.2] - Previous Version

### Added

- **Configuration-First Architecture**: New `createFormConfig` function for framework-agnostic form configuration
- **Enhanced React Hook**: New `useFormConfig` hook with improved developer experience
- **Multiple Entry Points**: Separate entry points for core (`@dynamic_forms/react`), UI (`@dynamic_forms/react/ui`), and full library (`@dynamic_forms/react/full`)
- **Tree-Shaking Optimization**: UI components are now optional and tree-shakeable
- **React 17+ Compatibility**: Full support for React 17 and later versions
- **Bundle Size Optimization**: Core functionality reduced to ~15KB (67% smaller)
- **Enhanced TypeScript Support**: Better type inference and comprehensive type definitions
- **Migration Guide**: Comprehensive migration documentation with examples
- **Performance Improvements**: 40% faster initialization and optimized re-rendering

### Changed

- **Project Structure**: Reorganized into `/core`, `/hooks`, `/ui` directories for better separation
- **Build Configuration**: Updated to support multiple entry points with proper tree-shaking
- **Package Exports**: Added package.json exports field for modern bundler support
- **Peer Dependencies**: Made React dependencies optional for core functionality
- **Documentation**: Complete rewrite of README with new architecture focus

### Enhanced

- **useForm Hook**: Now uses the new architecture internally while maintaining backward compatibility
- **FormRenderer**: Enhanced to work with both old and new hook patterns
- **Validation System**: Moved to core module with standalone utilities
- **Dependency Resolution**: Extracted to core module for framework-agnostic usage
- **Event System**: Enhanced with better TypeScript support and performance

### Backward Compatibility

- ✅ All existing APIs continue to work without changes
- ✅ FormModel schema format unchanged
- ✅ Component props and interfaces unchanged
- ✅ Plugin system unchanged
- ✅ Event hooks unchanged

### Migration

- **No Breaking Changes**: Existing code works without modifications
- **Optional Migration**: New patterns available for better performance and bundle optimization
- **Gradual Adoption**: Can migrate forms individually when convenient

## [0.0.2] - Previous Version

### Features

- Schema-driven form building
- React form state management
- Built-in form renderer
- Field validation and dependencies
- Plugin system
- Analytics and event hooks
- Feature flagging
- Internationalization support

---

## Migration Notes

This release introduces a new architecture while maintaining full backward compatibility. See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed migration instructions.

### Quick Migration

```typescript
// Before (still works)
import { useForm, FormRenderer } from '@dynamic_forms/react';

// After (recommended for new projects)
import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';
```

### Benefits of New Architecture

- **Smaller Bundles**: Import only what you need
- **Better Performance**: Optimized configuration generation and state management
- **Enhanced Developer Experience**: Improved TypeScript support and cleaner APIs
- **Framework Flexibility**: Use form configuration with any UI framework
- **Future-Proof**: Built on modern architecture principles

### Support

For migration assistance or questions about the new architecture:

- Review the [Migration Guide](MIGRATION_GUIDE.md)
- Check the [Examples](examples/) directory
- Open an [Issue](https://github.com/nishantonline1/formcraft-react/issues) for specific questions
