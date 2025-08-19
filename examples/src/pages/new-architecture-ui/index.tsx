import { NewArchitectureUIComponent } from './components';

/**
 * New Architecture UI Example
 *
 * This example demonstrates how to use the refactored form library with
 * the new architecture while still using the provided UI components.
 * It shows how to:
 * - Use useFormConfig for state management
 * - Import UI components from the separate entry point
 * - Combine core configuration with optional UI components
 * - Leverage the new modular architecture for better tree-shaking
 *
 * This approach is ideal for:
 * - Gradual migration from the old architecture
 * - Using some built-in components while customizing others
 * - Taking advantage of improved bundle optimization
 * - Modern React applications with the new architecture
 */
export const NewArchitectureUIWrapper = NewArchitectureUIComponent;