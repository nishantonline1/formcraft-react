import { FormValues, FormValue } from '../types';

/**
 * Event payload types for different form events
 */
export interface FormEventPayloads {
  'form:init': {
    formId?: string;
    initialValues: FormValues;
    fieldCount: number;
  };
  'field:change': {
    fieldPath: string;
    fieldKey: string;
    oldValue: FormValue;
    newValue: FormValue;
    formValues: FormValues;
  };
  'field:blur': {
    fieldPath: string;
    fieldKey: string;
    value: FormValue;
    formValues: FormValues;
  };
  'field:focus': {
    fieldPath: string;
    fieldKey: string;
    value: FormValue;
    formValues: FormValues;
  };
  'form:submit': {
    formId?: string;
    values: FormValues;
    isValid: boolean;
    errors?: Record<string, string[]>;
  };
  'form:validation': {
    fieldPath: string;
    fieldKey: string;
    value: FormValue;
    errors: string[];
    isValid: boolean;
  };
  'dependency:resolved': {
    fieldPath: string;
    fieldKey: string;
    isVisible: boolean;
    isDisabled: boolean;
    dependsOn: string[];
  };
}

/**
 * Event listener function type
 */
export type EventListener<T extends keyof FormEventPayloads> = (
  payload: FormEventPayloads[T]
) => void | Promise<void>;

/**
 * Event bus for managing form events
 */
class EventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Map<string, Set<EventListener<any>>> = new Map();

  /**
   * Subscribe to an event
   */
  on<T extends keyof FormEventPayloads>(
    event: T,
    listener: EventListener<T>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  /**
   * Subscribe to an event for one-time execution
   */
  once<T extends keyof FormEventPayloads>(
    event: T,
    listener: EventListener<T>
  ): () => void {
    const wrappedListener = (payload: FormEventPayloads[T]) => {
      listener(payload);
      this.off(event, wrappedListener);
    };
    
    return this.on(event, wrappedListener);
  }

  /**
   * Unsubscribe from an event
   */
  off<T extends keyof FormEventPayloads>(
    event: T,
    listener: EventListener<T>
  ): void {
    this.listeners.get(event)?.delete(listener);
  }

  /**
   * Emit an event to all listeners
   */
  emit<T extends keyof FormEventPayloads>(
    event: T,
    payload: FormEventPayloads[T]
  ): void {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return;

    // Execute all listeners
    eventListeners.forEach(listener => {
      try {
        const result = listener(payload);
        // Handle async listeners
        if (result instanceof Promise) {
          result.catch(error => {
            console.error(`Error in async event listener for "${event}":`, error);
          });
        }
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error);
      }
    });
  }

  /**
   * Remove all listeners for a specific event
   */
  removeAllListeners<T extends keyof FormEventPayloads>(event?: T): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get all event names that have listeners
   */
  getEventNames(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Get listener count for an event
   */
  getListenerCount<T extends keyof FormEventPayloads>(event: T): number {
    return this.listeners.get(event)?.size || 0;
  }
}

// Global event bus instance
export const formEventBus = new EventBus();

/**
 * Hook creator functions for easy event subscription
 */
export const createEventHooks = () => ({
  onInit: (callback: EventListener<'form:init'>) => 
    formEventBus.on('form:init', callback),
  
  onFieldChange: (callback: EventListener<'field:change'>) => 
    formEventBus.on('field:change', callback),
  
  onFieldBlur: (callback: EventListener<'field:blur'>) => 
    formEventBus.on('field:blur', callback),
  
  onFieldFocus: (callback: EventListener<'field:focus'>) => 
    formEventBus.on('field:focus', callback),
  
  onFormSubmit: (callback: EventListener<'form:submit'>) => 
    formEventBus.on('form:submit', callback),
  
  onValidation: (callback: EventListener<'form:validation'>) => 
    formEventBus.on('form:validation', callback),
  
  onDependencyResolved: (callback: EventListener<'dependency:resolved'>) => 
    formEventBus.on('dependency:resolved', callback),
});

/**
 * Analytics integration helpers
 */
export const trackEvent = <T extends keyof FormEventPayloads>(
  event: T,
  payload: FormEventPayloads[T],
  analyticsCallback?: (eventName: string, data: Record<string, unknown>) => void
): void => {
  // Emit to event bus
  formEventBus.emit(event, payload);
  
  // Track analytics if callback provided
  if (analyticsCallback) {
    analyticsCallback(event, payload as Record<string, unknown>);
  }
}; 