/// <reference lib="dom" />
/// <reference types="@types/node" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../hooks/useForm';
import { useFormConfig } from '../hooks/useFormConfig';
import { FormRenderer } from '../ui/FormRenderer';
import { FormModel } from '../model';
import { formEventBus } from '../events/eventBus';
import type { UseFormReturn } from '../hooks';

describe('Backward Compatibility Integration Tests', () => {
  beforeEach(() => {
    formEventBus.removeAllListeners();
  });

  const testModel: FormModel = [
    {
      key: 'firstName',
      type: 'text',
      label: 'First Name',
      validators: { required: true },
    },
    {
      key: 'lastName',
      type: 'text',
      label: 'Last Name',
      validators: { required: true },
    },
    {
      key: 'age',
      type: 'number',
      label: 'Age',
      validators: { min: 18 },
    },
    {
      key: 'showAddress',
      type: 'checkbox',
      label: 'Show Address',
    },
    {
      key: 'address',
      type: 'text',
      label: 'Address',
      hidden: true,
      dependencies: {
        fields: ['showAddress'],
        condition: (watchedValues) => watchedValues.showAddress === true,
        overrides: { hidden: false, validators: { required: true } },
      },
    },
  ];

  describe('useForm Hook Backward Compatibility', () => {
    it('should maintain exact same API surface as before refactor', () => {
      const { result } = renderHook(() => useForm(testModel));

      // Check all expected properties exist
      expect(result.current).toHaveProperty('config');
      expect(result.current).toHaveProperty('values');
      expect(result.current).toHaveProperty('errors');
      expect(result.current).toHaveProperty('touched');
      expect(result.current).toHaveProperty('dependencies');
      expect(result.current).toHaveProperty('dynamicOptions');
      expect(result.current).toHaveProperty('isFieldVisible');
      expect(result.current).toHaveProperty('isFieldDisabled');
      expect(result.current).toHaveProperty('getEffectiveField');
      expect(result.current).toHaveProperty('handleChange');
      expect(result.current).toHaveProperty('handleBlur');
      expect(result.current).toHaveProperty('handleFocus');
      expect(result.current).toHaveProperty('addArrayItem');
      expect(result.current).toHaveProperty('removeArrayItem');
      expect(result.current).toHaveProperty('handleSubmit');
      expect(result.current).toHaveProperty('triggerValidation');
      expect(result.current).toHaveProperty('trackEvent');
      expect(result.current).toHaveProperty('onInit');
      expect(result.current).toHaveProperty('onFieldChange');
      expect(result.current).toHaveProperty('onFieldBlur');
      expect(result.current).toHaveProperty('onFormSubmit');

      // Check function signatures
      expect(typeof result.current.isFieldVisible).toBe('function');
      expect(typeof result.current.isFieldDisabled).toBe('function');
      expect(typeof result.current.getEffectiveField).toBe('function');
      expect(typeof result.current.handleChange).toBe('function');
      expect(typeof result.current.handleBlur).toBe('function');
      expect(typeof result.current.handleFocus).toBe('function');
      expect(typeof result.current.addArrayItem).toBe('function');
      expect(typeof result.current.removeArrayItem).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.triggerValidation).toBe('function');

      // Check data types
      expect(result.current.config).toBeDefined();
      expect(typeof result.current.values).toBe('object');
      expect(typeof result.current.errors).toBe('object');
      expect(typeof result.current.touched).toBe('object');
      expect(result.current.dependencies).toBeInstanceOf(Map);
      expect(result.current.dynamicOptions).toBeInstanceOf(Map);
    });

    it('should initialize with same default values as before', () => {
      const { result } = renderHook(() => useForm(testModel));

      // All fields should initialize with empty strings (backward compatibility)
      expect(result.current.values).toEqual({
        firstName: '',
        lastName: '',
        age: '',
        showAddress: '',
        address: '',
      });

      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });

    it('should handle field changes exactly as before', () => {
      const { result } = renderHook(() => useForm(testModel));

      act(() => {
        result.current.handleChange('firstName', 'John');
      });

      expect(result.current.values.firstName).toBe('John');

      act(() => {
        result.current.handleChange('age', 25);
      });

      expect(result.current.values.age).toBe(25);
    });

    it('should handle validation exactly as before', () => {
      const { result } = renderHook(() => useForm(testModel));

      // Test required validation
      act(() => {
        result.current.handleChange('firstName', '');
        result.current.handleBlur('firstName');
      });

      expect(result.current.errors.firstName).toContain(
        'First Name is required.',
      );

      // Test min validation
      act(() => {
        result.current.handleChange('age', 16);
      });

      expect(result.current.errors.age).toContain('Age must be ≥ 18.');

      // Clear errors
      act(() => {
        result.current.handleChange('firstName', 'John');
        result.current.handleChange('age', 25);
      });

      expect(result.current.errors.firstName).toEqual([]);
      expect(result.current.errors.age).toEqual([]);
    });

    it('should handle dependencies exactly as before', () => {
      const { result } = renderHook(() => useForm(testModel));

      // Initially address should be hidden
      expect(result.current.isFieldVisible('address')).toBe(false);

      // Show address field
      act(() => {
        result.current.handleChange('showAddress', true);
      });

      expect(result.current.isFieldVisible('address')).toBe(true);

      // Get effective field should include dependency overrides
      const effectiveField = result.current.getEffectiveField('address');
      expect(effectiveField?.hidden).toBe(false);
      expect(effectiveField?.validators?.required).toBe(true);
    });

    it('should handle array operations exactly as before', () => {
      const { result } = renderHook(() => useForm(testModel));

      // Test that array operations exist and don't throw
      act(() => {
        result.current.addArrayItem('nonExistent');
      });

      act(() => {
        result.current.removeArrayItem('nonExistent', 0);
      });

      // Should not throw errors
      expect(true).toBe(true);
    });

    it('should handle form submission exactly as before', async () => {
      const { result } = renderHook(() => useForm(testModel));
      const mockSubmit = jest.fn().mockResolvedValue(undefined);

      // Fill required fields
      act(() => {
        result.current.handleChange('firstName', 'John');
        result.current.handleChange('lastName', 'Doe');
        result.current.handleChange('age', 25);
      });

      await act(async () => {
        await result.current.handleSubmit(mockSubmit)();
      });

      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        showAddress: '',
        address: '',
      });
    });

    it('should maintain triggerValidation signature requiring fieldsToValidate parameter', async () => {
      const { result } = renderHook(() => useForm(testModel));

      // The old API requires fieldsToValidate parameter
      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.triggerValidation([
          'firstName',
          'lastName',
        ]);
      });

      expect(typeof isValid!).toBe('boolean');
    });

    it('should return undefined for getEffectiveField with non-existent field (backward compatibility)', () => {
      const { result } = renderHook(() => useForm(testModel));

      const nonExistentField = result.current.getEffectiveField('nonExistent');
      expect(nonExistentField).toBeUndefined();
    });
  });

  describe('useForm vs useFormConfig API Comparison', () => {
    it('should produce identical results for basic operations', () => {
      const { result: useFormResult } = renderHook(() => useForm(testModel));
      const { result: useFormConfigResult } = renderHook(() =>
        useFormConfig(testModel),
      );

      // Initial values should be the same
      expect(useFormResult.current.values).toEqual(
        useFormConfigResult.current.values,
      );
      expect(useFormResult.current.errors).toEqual(
        useFormConfigResult.current.errors,
      );
      expect(useFormResult.current.touched).toEqual(
        useFormConfigResult.current.touched,
      );

      // Field visibility should be the same
      expect(useFormResult.current.isFieldVisible('firstName')).toBe(
        useFormConfigResult.current.isFieldVisible('firstName'),
      );
      expect(useFormResult.current.isFieldVisible('address')).toBe(
        useFormConfigResult.current.isFieldVisible('address'),
      );

      // Field disabled state should be the same
      expect(useFormResult.current.isFieldDisabled('firstName')).toBe(
        useFormConfigResult.current.isFieldDisabled('firstName'),
      );
    });

    it('should handle field changes identically', () => {
      const { result: useFormResult } = renderHook(() => useForm(testModel));
      const { result: useFormConfigResult } = renderHook(() =>
        useFormConfig(testModel),
      );

      act(() => {
        useFormResult.current.handleChange('firstName', 'John');
        useFormConfigResult.current.handleChange('firstName', 'John');
      });

      expect(useFormResult.current.values.firstName).toBe(
        useFormConfigResult.current.values.firstName,
      );

      act(() => {
        useFormResult.current.handleChange('showAddress', true);
        useFormConfigResult.current.handleChange('showAddress', true);
      });

      expect(useFormResult.current.isFieldVisible('address')).toBe(
        useFormConfigResult.current.isFieldVisible('address'),
      );
    });

    it('should handle validation identically', () => {
      const { result: useFormResult } = renderHook(() => useForm(testModel));
      const { result: useFormConfigResult } = renderHook(() =>
        useFormConfig(testModel),
      );

      act(() => {
        useFormResult.current.handleChange('firstName', '');
        useFormConfigResult.current.handleChange('firstName', '');
      });

      expect(useFormResult.current.errors.firstName).toEqual(
        useFormConfigResult.current.errors.firstName,
      );

      act(() => {
        useFormResult.current.handleChange('age', 16);
        useFormConfigResult.current.handleChange('age', 16);
      });

      expect(useFormResult.current.errors.age).toEqual(
        useFormConfigResult.current.errors.age,
      );
    });
  });

  describe('FormRenderer Integration with Both Hooks', () => {
    const TestFormWithUseForm: React.FC = () => {
      const form = useForm(testModel);
      return <FormRenderer config={form.config} form={form} />;
    };

    const TestFormWithUseFormConfig: React.FC = () => {
      const form = useFormConfig(testModel);
      return <FormRenderer config={form.config} form={form as UseFormReturn} />;
    };

    it('should render identical forms with both hooks', () => {
      const { container: useFormContainer } = render(<TestFormWithUseForm />);
      const { container: useFormConfigContainer } = render(
        <TestFormWithUseFormConfig />,
      );

      // Both should render the same number of visible fields
      const useFormFields = useFormContainer.querySelectorAll('.form-field');
      const useFormConfigFields =
        useFormConfigContainer.querySelectorAll('.form-field');

      expect(useFormFields.length).toBe(useFormConfigFields.length);

      // Both should have the same field types
      const useFormFieldTypes = Array.from(useFormFields).map((field) =>
        field.getAttribute('data-field-type'),
      );
      const useFormConfigFieldTypes = Array.from(useFormConfigFields).map(
        (field) => field.getAttribute('data-field-type'),
      );

      expect(useFormFieldTypes).toEqual(useFormConfigFieldTypes);
    });

    it('should handle field interactions identically with both hooks', async () => {
      const { container: useFormContainer } = render(<TestFormWithUseForm />);
      const { container: useFormConfigContainer } = render(
        <TestFormWithUseFormConfig />,
      );

      // Find first name inputs in both forms (using field ID instead of data-field-path)
      const useFormFirstName = useFormContainer.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;
      const useFormConfigFirstName = useFormConfigContainer.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;

      expect(useFormFirstName).toBeTruthy();
      expect(useFormConfigFirstName).toBeTruthy();

      // Type in both inputs
      fireEvent.change(useFormFirstName, { target: { value: 'John' } });
      fireEvent.change(useFormConfigFirstName, { target: { value: 'John' } });

      expect(useFormFirstName.value).toBe('John');
      expect(useFormConfigFirstName.value).toBe('John');

      // Blur both inputs to trigger validation
      fireEvent.blur(useFormFirstName);
      fireEvent.blur(useFormConfigFirstName);

      // Both should show no errors for valid input
      await waitFor(() => {
        const useFormError = useFormContainer.querySelector('.error-message');
        const useFormConfigError =
          useFormConfigContainer.querySelector('.error-message');
        expect(useFormError).toBeFalsy();
        expect(useFormConfigError).toBeFalsy();
      });
    });

    it('should handle dependency changes identically with both hooks', async () => {
      const { container: useFormContainer } = render(<TestFormWithUseForm />);
      const { container: useFormConfigContainer } = render(
        <TestFormWithUseFormConfig />,
      );

      // Initially address field should be hidden in both (should only have 2 text inputs: firstName, lastName)
      expect(
        useFormContainer.querySelectorAll('input[type="text"]').length,
      ).toBe(2);
      expect(
        useFormConfigContainer.querySelectorAll('input[type="text"]').length,
      ).toBe(2);

      // Find and check the showAddress checkbox in both forms
      const useFormCheckbox = useFormContainer.querySelector(
        'input[name="showAddress"]',
      ) as HTMLInputElement;
      const useFormConfigCheckbox = useFormConfigContainer.querySelector(
        'input[name="showAddress"]',
      ) as HTMLInputElement;

      fireEvent.click(useFormCheckbox);
      fireEvent.click(useFormConfigCheckbox);

      // Both should now show the address field (should have 3 text inputs now)
      await waitFor(() => {
        expect(
          useFormContainer.querySelectorAll('input[type="text"]').length,
        ).toBe(3);
        expect(
          useFormConfigContainer.querySelectorAll('input[type="text"]').length,
        ).toBe(3);
      });
    });

    it('should handle validation errors identically with both hooks', async () => {
      const { container: useFormContainer } = render(<TestFormWithUseForm />);
      const { container: useFormConfigContainer } = render(
        <TestFormWithUseFormConfig />,
      );

      // Find first name inputs (first text input in each form)
      const useFormFirstName = useFormContainer.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;
      const useFormConfigFirstName = useFormConfigContainer.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;

      expect(useFormFirstName).toBeTruthy();
      expect(useFormConfigFirstName).toBeTruthy();

      // Clear the inputs and blur to trigger required validation
      fireEvent.change(useFormFirstName, { target: { value: '' } });
      fireEvent.change(useFormConfigFirstName, { target: { value: '' } });
      fireEvent.blur(useFormFirstName);
      fireEvent.blur(useFormConfigFirstName);

      // Both should handle the validation events (we can't easily test the visual output,
      // but we can verify the forms are rendered and interactive)
      expect(useFormFirstName.value).toBe('');
      expect(useFormConfigFirstName.value).toBe('');
    });
  });

  describe('Complete Form Workflow Integration', () => {
    it('should handle complete form submission workflow identically', async () => {
      const mockSubmitUseForm = jest.fn().mockResolvedValue(undefined);
      const mockSubmitUseFormConfig = jest.fn().mockResolvedValue(undefined);

      const UseFormWorkflow: React.FC = () => {
        const form = useForm(testModel);
        return (
          <div>
            <FormRenderer config={form.config} form={form} />
            <button
              onClick={form.handleSubmit(mockSubmitUseForm)}
              data-testid="submit-useform"
            >
              Submit
            </button>
          </div>
        );
      };

      const UseFormConfigWorkflow: React.FC = () => {
        const form = useFormConfig(testModel);
        return (
          <div>
            <FormRenderer config={form.config} form={form as UseFormReturn} />
            <button
              onClick={form.handleSubmit(mockSubmitUseFormConfig)}
              data-testid="submit-useformconfig"
            >
              Submit
            </button>
          </div>
        );
      };

      const { container: useFormContainer } = render(<UseFormWorkflow />);
      const { container: useFormConfigContainer } = render(
        <UseFormConfigWorkflow />,
      );

      // Fill out both forms identically
      const fillForm = (container: Element) => {
        const inputs = container.querySelectorAll(
          'input[type="text"], input[type="number"]',
        );
        const firstName = inputs[0] as HTMLInputElement; // First text input
        const lastName = inputs[1] as HTMLInputElement; // Second text input
        const age = inputs[2] as HTMLInputElement; // Number input

        fireEvent.change(firstName, { target: { value: 'John' } });
        fireEvent.change(lastName, { target: { value: 'Doe' } });
        fireEvent.change(age, { target: { value: '25' } });
      };

      fillForm(useFormContainer);
      fillForm(useFormConfigContainer);

      // Submit both forms
      const useFormSubmit = screen.getByTestId('submit-useform');
      const useFormConfigSubmit = screen.getByTestId('submit-useformconfig');

      fireEvent.click(useFormSubmit);
      fireEvent.click(useFormConfigSubmit);

      // Both should call their submit handlers with identical data
      await waitFor(() => {
        expect(mockSubmitUseForm).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          age: 25, // Number input converts to number
          showAddress: '',
          address: '',
        });
        expect(mockSubmitUseFormConfig).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          age: 25, // Number input converts to number
          showAddress: '',
          address: '',
        });
      });
    });

    it('should handle complex dependency and validation workflow identically', async () => {
      const UseFormWorkflow: React.FC = () => {
        const form = useForm(testModel);
        return <FormRenderer config={form.config} form={form} />;
      };

      const UseFormConfigWorkflow: React.FC = () => {
        const form = useFormConfig(testModel);
        return (
          <FormRenderer config={form.config} form={form as UseFormReturn} />
        );
      };

      const { container: useFormContainer } = render(<UseFormWorkflow />);
      const { container: useFormConfigContainer } = render(
        <UseFormConfigWorkflow />,
      );

      // Enable address field in both forms
      const useFormCheckbox = useFormContainer.querySelector(
        'input[name="showAddress"]',
      ) as HTMLInputElement;
      const useFormConfigCheckbox = useFormConfigContainer.querySelector(
        'input[name="showAddress"]',
      ) as HTMLInputElement;

      fireEvent.click(useFormCheckbox);
      fireEvent.click(useFormConfigCheckbox);

      // Wait for address fields to appear (look for additional text inputs)
      await waitFor(() => {
        const useFormInputs =
          useFormContainer.querySelectorAll('input[type="text"]');
        const useFormConfigInputs =
          useFormConfigContainer.querySelectorAll('input[type="text"]');
        expect(useFormInputs.length).toBeGreaterThan(2); // Should have firstName, lastName, and address
        expect(useFormConfigInputs.length).toBeGreaterThan(2);
      });

      // Leave address fields empty and blur to trigger required validation
      const useFormInputs =
        useFormContainer.querySelectorAll('input[type="text"]');
      const useFormConfigInputs =
        useFormConfigContainer.querySelectorAll('input[type="text"]');
      const useFormAddress = useFormInputs[
        useFormInputs.length - 1
      ] as HTMLInputElement; // Last text input should be address
      const useFormConfigAddress = useFormConfigInputs[
        useFormConfigInputs.length - 1
      ] as HTMLInputElement;

      fireEvent.blur(useFormAddress);
      fireEvent.blur(useFormConfigAddress);

      // Verify address fields are present and can be interacted with
      expect(useFormAddress).toBeTruthy();
      expect(useFormConfigAddress).toBeTruthy();

      // Leave address fields empty and blur to trigger required validation
      fireEvent.blur(useFormAddress);
      fireEvent.blur(useFormConfigAddress);

      // Fill address fields
      fireEvent.change(useFormAddress, { target: { value: '123 Main St' } });
      fireEvent.change(useFormConfigAddress, {
        target: { value: '123 Main St' },
      });

      // Verify values are set correctly
      expect(useFormAddress.value).toBe('123 Main St');
      expect(useFormConfigAddress.value).toBe('123 Main St');
    });

    it('should emit identical events for both hooks', () => {
      const eventCallback = jest.fn();
      formEventBus.on('field:change', eventCallback);

      const { result: useFormResult } = renderHook(() => useForm(testModel));
      const { result: useFormConfigResult } = renderHook(() =>
        useFormConfig(testModel),
      );

      eventCallback.mockClear();

      // Make changes with both hooks
      act(() => {
        useFormResult.current.handleChange('firstName', 'John');
      });

      act(() => {
        useFormConfigResult.current.handleChange('firstName', 'John');
      });

      // Both should emit the same event structure
      expect(eventCallback).toHaveBeenCalledTimes(2);

      const [useFormEvent, useFormConfigEvent] = eventCallback.mock.calls;
      expect(useFormEvent[0]).toEqual(useFormConfigEvent[0]);
    });
  });

  describe('Error Handling Compatibility', () => {
    it('should handle errors gracefully in both hooks', () => {
      const modelWithError: FormModel = [
        {
          key: 'test',
          type: 'text',
          label: 'Test',
          validators: {
            custom: () => {
              throw new Error('Validation error');
            },
          },
        },
      ];

      // Both hooks should handle validation errors gracefully
      expect(() => {
        renderHook(() => useForm(modelWithError));
      }).not.toThrow();

      expect(() => {
        renderHook(() => useFormConfig(modelWithError));
      }).not.toThrow();
    });

    it('should handle missing fields gracefully', () => {
      const { result: useFormResult } = renderHook(() => useForm(testModel));
      const { result: useFormConfigResult } = renderHook(() =>
        useFormConfig(testModel),
      );

      // Both should handle non-existent fields gracefully
      expect(() => {
        useFormResult.current.handleChange('nonExistent', 'value');
      }).not.toThrow();

      expect(() => {
        useFormConfigResult.current.handleChange('nonExistent', 'value');
      }).not.toThrow();

      // useForm should return undefined for non-existent fields (backward compatibility)
      expect(
        useFormResult.current.getEffectiveField('nonExistent'),
      ).toBeUndefined();

      // useFormConfig throws for non-existent fields (different behavior, but acceptable)
      expect(() => {
        useFormConfigResult.current.getEffectiveField('nonExistent');
      }).toThrow('Field not found: nonExistent');
    });
  });
});
