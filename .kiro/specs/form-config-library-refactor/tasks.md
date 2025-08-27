# Implementation Plan

- [x] 1. Create core configuration engine foundation
  - Extract buildFormConfig logic into new core module structure
  - Create core types and interfaces for the new architecture
  - Implement createFormConfig function as the primary configuration generator
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Implement core validation and dependency utilities
  - Move validation logic from utils to core module with enhanced interface
  - Extract dependency resolution logic into core module
  - Create standalone utility functions that work without React context
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 3. Create new useFormConfig hook
  - Implement lightweight React hook that wraps createFormConfig
  - Add state management for values, errors, touched, and dynamic options
  - Include computed properties and action handlers
  - _Requirements: 2.1, 2.2, 5.1, 5.2, 5.3, 5.4_

- [x] 4. Refactor existing useForm hook for backward compatibility
  - Modify useForm to use useFormConfig internally
  - Ensure all existing return properties and methods remain identical
  - Maintain exact same API surface for backward compatibility
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 5. Restructure project directories and move files
  - Create new /src/core directory structure
  - Move relevant files to core, maintaining imports
  - Update internal import paths throughout the codebase
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 6. Create separate entry points for different use cases
  - Create main index.ts with core-first exports
  - Create ui.ts entry point for optional UI components
  - Create full.ts entry point for complete backward compatibility
  - _Requirements: 4.1, 4.2, 4.3, 6.1, 6.2, 6.3_

- [x] 7. Update build configuration for multiple entry points
  - Modify tsup.config.ts to build multiple entry points
  - Configure proper external dependencies for each entry point
  - Ensure tree-shaking works correctly for UI components
  - _Requirements: 4.2, 6.1, 6.2, 6.4_

- [x] 8. Update package.json exports and peer dependencies
  - Configure exports field for multiple entry points
  - Make React peer dependencies optional with peerDependenciesMeta
  - Update main, types, and module fields appropriately
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 9. Create comprehensive unit tests for core functionality
  - Write tests for createFormConfig function with various scenarios
  - Test validation and dependency utilities independently
  - Test useFormConfig hook with React Testing Library
  - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.2, 5.3_

- [x] 10. Create integration tests for backward compatibility
  - Test that existing useForm hook works identically to before
  - Test that FormRenderer works with both old and new hooks
  - Test complete form workflows with both approaches
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 11. Update examples to demonstrate both usage patterns
  - Create example showing core configuration-only usage
  - Create example showing UI components with new architecture
  - Update existing examples to work with refactored structure
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 12. Update documentation and README
  - Update README to reflect new configuration-first approach
  - Document new import paths and usage patterns
  - Create migration guide for upgrading from current version
  - _Requirements: 7.1, 7.2, 7.3, 7.4_
