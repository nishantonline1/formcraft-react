import { CoreConfigOnlyComponent } from './components';

/**
 * Core Configuration Only Example
 *
 * This example demonstrates how to use the form library's core configuration
 * functionality without any UI components. It shows how to:
 * - Use useForm for standalone configuration generation
 * - Use useForm for React integration without UI components
 * - Build custom UI components using the configuration data
 * - Access validation, dependencies, and state management independently
 *
 * This approach is ideal for:
 * - Custom UI frameworks
 * - Minimal bundle sizes
 * - Server-side rendering scenarios
 * - Integration with existing component libraries
 */
export const CoreConfigOnlyWrapper = CoreConfigOnlyComponent;