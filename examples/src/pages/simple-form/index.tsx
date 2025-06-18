import { SimpleFormComponent } from './components';

/**
 * Wrapper for the Simple Form Example.
 *
 * This component showcases a form with dynamic field dependencies,
 * real-time validation, and a state dashboard. It has been refactored to use
 * the `useEnhancedForm` hook for a cleaner implementation and adopts the
 * standardized, modern styling used across the examples.
 *
 * Key features demonstrated:
 * - Field dependencies (e.g., state dropdown populating cities).
 * - Real-time validation and form state tracking.
 * - Simplified hook implementation with `useEnhancedForm`.
 * - Consistent and modern UI/UX.
 */
export const SimpleFormWrapper = SimpleFormComponent;

// This file serves as the main entry point for the Simple Form example.
// It exports the top-level wrapper component. 