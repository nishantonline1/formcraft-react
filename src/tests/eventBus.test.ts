import { 
  formEventBus, 
  createEventHooks, 
  trackEvent,
  EventListener 
} from '../events/eventBus';
import { FormValues } from '../types';

describe('Event Bus System', () => {
  beforeEach(() => {
    // Clear all listeners before each test
    formEventBus.removeAllListeners();
  });

  describe('EventBus Basic Functionality', () => {
    it('should subscribe and emit events', () => {
      const callback = jest.fn();
      const unsubscribe = formEventBus.on('form:init', callback);

      formEventBus.emit('form:init', {
        formId: 'test-form',
        initialValues: { field1: 'value1' },
        fieldCount: 1,
      });

      expect(callback).toHaveBeenCalledWith({
        formId: 'test-form',
        initialValues: { field1: 'value1' },
        fieldCount: 1,
      });

      // Test unsubscribe
      unsubscribe();
      formEventBus.emit('form:init', {
        formId: 'test-form-2',
        initialValues: {},
        fieldCount: 0,
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple listeners for the same event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      formEventBus.on('field:change', callback1);
      formEventBus.on('field:change', callback2);

      const payload = {
        fieldPath: 'test.field',
        fieldKey: 'testField',
        oldValue: 'old',
        newValue: 'new',
        formValues: { 'test.field': 'new' } as FormValues,
      };

      formEventBus.emit('field:change', payload);

      expect(callback1).toHaveBeenCalledWith(payload);
      expect(callback2).toHaveBeenCalledWith(payload);
    });

    it('should handle once listeners', () => {
      const callback = jest.fn();
      formEventBus.once('field:blur', callback);

      const payload = {
        fieldPath: 'test.field',
        fieldKey: 'testField',
        value: 'test',
        formValues: { 'test.field': 'test' } as FormValues,
      };

      // Emit twice
      formEventBus.emit('field:blur', payload);
      formEventBus.emit('field:blur', payload);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle off method', () => {
      const callback = jest.fn();
      formEventBus.on('form:submit', callback);

      const payload = {
        formId: 'test',
        values: { field1: 'value1' } as FormValues,
        isValid: true,
      };

      formEventBus.emit('form:submit', payload);
      expect(callback).toHaveBeenCalledTimes(1);

      formEventBus.off('form:submit', callback);
      formEventBus.emit('form:submit', payload);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should get event names and listener counts', () => {
      const callback = jest.fn();
      formEventBus.on('field:change', callback);
      formEventBus.on('field:blur', callback);

      expect(formEventBus.getEventNames()).toContain('field:change');
      expect(formEventBus.getEventNames()).toContain('field:blur');
      expect(formEventBus.getListenerCount('field:change')).toBe(1);
      expect(formEventBus.getListenerCount('field:blur')).toBe(1);
      expect(formEventBus.getListenerCount('form:init')).toBe(0);
    });

    it('should remove all listeners for specific event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      formEventBus.on('field:change', callback1);
      formEventBus.on('field:change', callback2);
      formEventBus.on('field:blur', callback1);

      expect(formEventBus.getListenerCount('field:change')).toBe(2);
      expect(formEventBus.getListenerCount('field:blur')).toBe(1);

      formEventBus.removeAllListeners('field:change');

      expect(formEventBus.getListenerCount('field:change')).toBe(0);
      expect(formEventBus.getListenerCount('field:blur')).toBe(1);
    });

    it('should remove all listeners', () => {
      const callback = jest.fn();
      formEventBus.on('field:change', callback);
      formEventBus.on('field:blur', callback);

      expect(formEventBus.getEventNames().length).toBeGreaterThan(0);

      formEventBus.removeAllListeners();

      expect(formEventBus.getEventNames().length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle synchronous errors in listeners gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const goodCallback = jest.fn();
      const badCallback = jest.fn(() => {
        throw new Error('Listener error');
      });

      formEventBus.on('form:init', goodCallback);
      formEventBus.on('form:init', badCallback);

      formEventBus.emit('form:init', {
        initialValues: {},
        fieldCount: 0,
      });

      expect(goodCallback).toHaveBeenCalled();
      expect(badCallback).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in event listener for "form:init":',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle asynchronous errors in listeners gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const asyncBadCallback: EventListener<'form:init'> = jest.fn(async () => {
        throw new Error('Async listener error');
      });

      formEventBus.on('form:init', asyncBadCallback);

      formEventBus.emit('form:init', {
        initialValues: {},
        fieldCount: 0,
      });

      expect(asyncBadCallback).toHaveBeenCalled();
      
      // Note: The async error handling is fire-and-forget, so we can't easily test
      // the console.error call in a synchronous test environment
      
      consoleSpy.mockRestore();
    });

    it('should handle emitting to non-existent event', () => {
      // Should not throw error
      expect(() => {
        formEventBus.emit('form:init', {
          initialValues: {},
          fieldCount: 0,
        });
      }).not.toThrow();
    });
  });

  describe('Event Hook Creators', () => {
    it('should create event hooks with correct bindings', () => {
      const hooks = createEventHooks();
      const callback = jest.fn();

      const unsubscribe = hooks.onFieldChange(callback);

      formEventBus.emit('field:change', {
        fieldPath: 'test',
        fieldKey: 'test',
        oldValue: 'old',
        newValue: 'new',
        formValues: { test: 'new' },
      });

      expect(callback).toHaveBeenCalled();

      unsubscribe();
      formEventBus.emit('field:change', {
        fieldPath: 'test2',
        fieldKey: 'test2',
        oldValue: 'old2',
        newValue: 'new2',
        formValues: { test2: 'new2' },
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should provide all expected hook methods', () => {
      const hooks = createEventHooks();

      expect(typeof hooks.onInit).toBe('function');
      expect(typeof hooks.onFieldChange).toBe('function');
      expect(typeof hooks.onFieldBlur).toBe('function');
      expect(typeof hooks.onFieldFocus).toBe('function');
      expect(typeof hooks.onFormSubmit).toBe('function');
      expect(typeof hooks.onValidation).toBe('function');
      expect(typeof hooks.onDependencyResolved).toBe('function');
    });
  });

  describe('trackEvent function', () => {
    it('should emit event to bus and call analytics callback', () => {
      const busCallback = jest.fn();
      const analyticsCallback = jest.fn();

      formEventBus.on('field:focus', busCallback);

      const payload = {
        fieldPath: 'test',
        fieldKey: 'test',
        value: 'test',
        formValues: { test: 'test' },
      };

      trackEvent('field:focus', payload, analyticsCallback);

      expect(busCallback).toHaveBeenCalledWith(payload);
      expect(analyticsCallback).toHaveBeenCalledWith('field:focus', payload);
    });

    it('should work without analytics callback', () => {
      const busCallback = jest.fn();
      formEventBus.on('form:validation', busCallback);

      const payload = {
        fieldPath: 'test',
        fieldKey: 'test',
        value: 'test',
        errors: [],
        isValid: true,
      };

      expect(() => {
        trackEvent('form:validation', payload);
      }).not.toThrow();

      expect(busCallback).toHaveBeenCalledWith(payload);
    });
  });

  describe('Event Payload Types', () => {
    it('should handle form:init event payload', () => {
      const callback = jest.fn();
      formEventBus.on('form:init', callback);

      formEventBus.emit('form:init', {
        formId: 'test-form',
        initialValues: { field1: 'value1', field2: 2 },
        fieldCount: 2,
      });

      expect(callback).toHaveBeenCalledWith({
        formId: 'test-form',
        initialValues: { field1: 'value1', field2: 2 },
        fieldCount: 2,
      });
    });

    it('should handle dependency:resolved event payload', () => {
      const callback = jest.fn();
      formEventBus.on('dependency:resolved', callback);

      formEventBus.emit('dependency:resolved', {
        fieldPath: 'dependent.field',
        fieldKey: 'dependentField',
        isVisible: true,
        isDisabled: false,
        dependsOn: ['trigger.field'],
      });

      expect(callback).toHaveBeenCalledWith({
        fieldPath: 'dependent.field',
        fieldKey: 'dependentField',
        isVisible: true,
        isDisabled: false,
        dependsOn: ['trigger.field'],
      });
    });

    it('should handle form:submit event payload with errors', () => {
      const callback = jest.fn();
      formEventBus.on('form:submit', callback);

      formEventBus.emit('form:submit', {
        formId: 'test-form',
        values: { field1: '' },
        isValid: false,
        errors: { field1: ['Required field'] },
      });

      expect(callback).toHaveBeenCalledWith({
        formId: 'test-form',
        values: { field1: '' },
        isValid: false,
        errors: { field1: ['Required field'] },
      });
    });
  });
}); 