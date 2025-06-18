import { EventHooksFormComponent } from './components';

/**
 * Wrapper for the Event Hooks Example.
 *
 * This component demonstrates how to use the `eventHooks` option to
 * capture real-time user interactions like field changes, focus, and blur.
 * The captured data powers a live analytics dashboard.
 *
 * Key features demonstrated:
 * - Use of `eventHooks` for declarative event handling.
 * - Real-time analytics and event streaming.
 * - Custom event tracking for specific fields (e.g., password strength).
 * - A much cleaner implementation compared to manual event wrappers.
 */
export const EventHooksWrapper = EventHooksFormComponent; 