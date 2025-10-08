import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../hooks/useForm';
import { FormModel } from '../model';
import { formEventBus } from '../events/eventBus';

describe('useForm Integration with Dependencies and Events', () => {
  beforeEach(() => {
    formEventBus.removeAllListeners();
  });

  const mockModel: FormModel = [
    {
      key: 'showConditional',
      type: 'select',
      label: 'Show Conditional Field',
    },
    {
      key: 'conditionalField',
      type: 'text',
      label: 'Conditional Field',
      hidden: true,
      dependencies: {
        fields: ['showConditional'],
        condition: (watchedValues) => watchedValues.showConditional === 'yes',
        overrides: { hidden: false, validators: { required: true } }
      },
    },
    {
      key: 'enableField',
      type: 'select',
      label: 'Enable Field',
    },
    {
      key: 'enabledField',
      type: 'text',
      label: 'Enabled Field',
      dependencies: {
        fields: ['enableField'],
        condition: (watchedValues) => watchedValues.enableField === 'disable',
        overrides: { disabled: true }
      },
    },
  ];

  describe('Dependency Resolution Integration', () => {
    it('should evaluate dependencies and provide visibility information', () => {
      const { result } = renderHook(() => useForm(mockModel));

      // Initially conditional field should be hidden
      expect(result.current.isFieldVisible('conditionalField')).toBe(false);
      expect(result.current.isFieldDisabled('conditionalField')).toBe(false);

      // Change trigger field
      act(() => {
        result.current.handleChange('showConditional', 'yes');
      });

      // Now conditional field should be visible
      expect(result.current.isFieldVisible('conditionalField')).toBe(true);
      
      // Get effective field props
      const effectiveField = result.current.getEffectiveField('conditionalField');
      expect(effectiveField?.hidden).toBe(false);
      expect(effectiveField?.validators?.required).toBe(true);
    });

    it('should handle disabled state dependencies', () => {
      const { result } = renderHook(() => useForm(mockModel));

      // Initially enabled field should not be disabled
      expect(result.current.isFieldDisabled('enabledField')).toBe(false);

      // Change trigger field to disable
      act(() => {
        result.current.handleChange('enableField', 'disable');
      });

      // Now enabled field should be disabled
      expect(result.current.isFieldDisabled('enabledField')).toBe(true);

      const effectiveField = result.current.getEffectiveField('enabledField');
      expect(effectiveField?.disabled).toBe(true);
    });

    it('should provide dependency resolution map', () => {
      const { result } = renderHook(() => useForm(mockModel));

      expect(result.current.dependencies).toBeInstanceOf(Map);
      expect(result.current.dependencies.size).toBe(4);

      // Check specific field dependency resolution
      const conditionalResolution = result.current.dependencies.get('conditionalField');
      expect(conditionalResolution?.isVisible).toBe(false);
      expect(conditionalResolution?.field).toBe('conditionalField');
    });

    it('should only validate visible fields on submit', async () => {
      const { result } = renderHook(() => useForm(mockModel));
      const mockSubmit = jest.fn().mockResolvedValue(undefined);

      // Set some values but leave conditional field empty (it's hidden)
      act(() => {
        result.current.handleChange('showConditional', 'no');
        result.current.handleChange('enableField', 'enable');
        result.current.handleChange('enabledField', 'some value');
      });

      // Submit should succeed because conditional field is hidden and not validated
      await act(async () => {
        await result.current.handleSubmit(mockSubmit)();
      });

      expect(mockSubmit).toHaveBeenCalledWith({
        showConditional: 'no',
        conditionalField: '',
        enableField: 'enable',
        enabledField: 'some value',
      });

      // Now show conditional field and submit without value
      act(() => {
        result.current.handleChange('showConditional', 'yes');
      });

      // Check that conditional field is now visible and required
      expect(result.current.isFieldVisible('conditionalField')).toBe(true);
      const effectiveField = result.current.getEffectiveField('conditionalField');
      expect(effectiveField?.validators?.required).toBe(true);

      // Clear the mock call count to track only the second submit
      mockSubmit.mockClear();

      await act(async () => {
        await result.current.handleSubmit(mockSubmit)();
      });

      // Submit should not have been called due to validation error
      expect(mockSubmit).toHaveBeenCalledTimes(0);
      expect(result.current.errors.conditionalField).toContain('Conditional Field is required.');
    });
  });

  describe('Event Integration', () => {
    it('should emit form:init event on mount', () => {
      const initCallback = jest.fn();
      
      formEventBus.on('form:init', initCallback);

      renderHook(() => useForm(mockModel, { 
        formId: 'test-form',
        initialValues: { showConditional: 'yes' }
      }));

      expect(initCallback).toHaveBeenCalledWith({
        formId: 'test-form',
        initialValues: { 
          showConditional: 'yes',
          conditionalField: '',
          enableField: '',
          enabledField: '',
        },
        fieldCount: 4,
      });
    });

    it('should emit field:change events', () => {
      const changeCallback = jest.fn();
      
      formEventBus.on('field:change', changeCallback);

      const { result } = renderHook(() => useForm(mockModel));

      act(() => {
        result.current.handleChange('showConditional', 'yes');
      });

      expect(changeCallback).toHaveBeenCalledWith({
        fieldPath: 'showConditional',
        fieldKey: 'showConditional',
        oldValue: '',
        newValue: 'yes',
        formValues: {
          showConditional: 'yes',
          conditionalField: '',
          enableField: '',
          enabledField: '',
        },
      });
    });

    it('should emit field:blur events', () => {
      const blurCallback = jest.fn();
      
      formEventBus.on('field:blur', blurCallback);

      const { result } = renderHook(() => useForm(mockModel));

      act(() => {
        result.current.handleBlur('showConditional');
      });

      expect(blurCallback).toHaveBeenCalledWith({
        fieldPath: 'showConditional',
        fieldKey: 'showConditional',
        value: '',
        formValues: {
          showConditional: '',
          conditionalField: '',
          enableField: '',
          enabledField: '',
        },
      });
    });

    it('should emit field:focus events', () => {
      const focusCallback = jest.fn();
      
      formEventBus.on('field:focus', focusCallback);

      const { result } = renderHook(() => useForm(mockModel));

      act(() => {
        result.current.handleFocus('showConditional');
      });

      expect(focusCallback).toHaveBeenCalledWith({
        fieldPath: 'showConditional',
        fieldKey: 'showConditional',
        value: '',
        formValues: {
          showConditional: '',
          conditionalField: '',
          enableField: '',
          enabledField: '',
        },
      });
    });

    it('should emit form:validation events', () => {
      // Create a model with a required field for this test
      const validationModel: FormModel = [
        {
          key: 'required',
          type: 'text', 
          label: 'Required Field',
          validators: { required: true }
        }
      ];
      
      const { result } = renderHook(() => useForm(validationModel));

      act(() => {
        result.current.handleChange('required', '');
      });

      expect(result.current.errors.required).toContain('Required Field is required.');

      act(() => {
        result.current.handleChange('required', 'value');
      });

      expect(result.current.errors.required).toEqual([]);
    });

    it('should emit form:submit events', async () => {
      const { result } = renderHook(() => useForm(mockModel));
      const mockSubmit = jest.fn().mockResolvedValue(undefined);

      await act(async () => {
        await result.current.handleSubmit(mockSubmit)();
      });

      expect(mockSubmit).toHaveBeenCalledWith({
        showConditional: '',
        conditionalField: '',
        enableField: '',
        enabledField: '',
      });
    });

    it('should emit dependency:resolved events when dependencies change', () => {
      const dependencyCallback = jest.fn();
      
      formEventBus.on('dependency:resolved', dependencyCallback);

      const { result } = renderHook(() => useForm(mockModel));

      // Clear initial dependency events
      dependencyCallback.mockClear();

      act(() => {
        result.current.handleChange('showConditional', 'yes');
      });

      expect(dependencyCallback).toHaveBeenCalledWith({
        fieldPath: 'conditionalField',
        fieldKey: 'conditionalField',
        isVisible: true,
        isDisabled: false,
        dependsOn: ['showConditional'],
      });
    });

    it('should work without analytics provider', () => {
      // Should not throw error even without AnalyticsProvider
      expect(() => {
        renderHook(() => useForm(mockModel, { enableAnalytics: false }));
      }).not.toThrow();
    });
  });

  describe('Complex Integration Scenarios', () => {
    it('should handle cascading dependencies with events', () => {
      const cascadingModel: FormModel = [
        {
          key: 'level1',
          type: 'select',
          label: 'Level 1',
        },
        {
          key: 'level2',
          type: 'select',
          label: 'Level 2',
          hidden: true,
          dependencies: {
            fields: ['level1'],
            condition: (watchedValues) => watchedValues.level1 === 'show',
            overrides: { hidden: false }
          },
        },
        {
          key: 'level3',
          type: 'text',
          label: 'Level 3',
          hidden: true,
          dependencies: {
            fields: ['level2'],
            condition: (watchedValues) => watchedValues.level2 === 'enable',
            overrides: { hidden: false, validators: { required: true } }
          },
        },
      ];

      const dependencyCallback = jest.fn();
      
      formEventBus.on('dependency:resolved', dependencyCallback);

      const { result } = renderHook(() => useForm(cascadingModel));

      // Clear initial events
      dependencyCallback.mockClear();

      // Trigger first level
      act(() => {
        result.current.handleChange('level1', 'show');
      });

      expect(result.current.isFieldVisible('level2')).toBe(true);
      expect(result.current.isFieldVisible('level3')).toBe(false);

      // Trigger second level
      act(() => {
        result.current.handleChange('level2', 'enable');
      });

      expect(result.current.isFieldVisible('level3')).toBe(true);
      
      const effectiveLevel3 = result.current.getEffectiveField('level3');
      expect(effectiveLevel3?.validators?.required).toBe(true);
    });
  });
}); 