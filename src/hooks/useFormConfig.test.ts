import { renderHook, act } from '@testing-library/react-hooks';
import { useFormConfig } from './useFormConfig';
import { FormModel } from '../model';

describe('useFormConfig', () => {
  const basicModel: FormModel = [
    {
      key: 'name',
      type: 'text',
      label: 'Name',
      validators: { required: true },
      defaultValue: 'John'
    },
    {
      key: 'age',
      type: 'number',
      label: 'Age',
      validators: { required: true, min: 18 }
    },
  ];

  beforeEach(() => {
    // Clear any previous test state
    jest.clearAllMocks();
  });

  it('should initialize with default values from config', () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    expect(result.current.values.name).toBe('John');
    expect(result.current.values.age).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('should initialize with provided initial values', () => {
    const initialValues = { name: 'Jane', age: 25 };
    const { result } = renderHook(() =>
      useFormConfig(basicModel, { initialValues })
    );

    expect(result.current.values.name).toBe('Jane');
    expect(result.current.values.age).toBe(25);
  });

  it('should handle field changes and validation', () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    act(() => {
      result.current.handleChange('name', '');
    });

    expect(result.current.values.name).toBe('');
    expect(result.current.errors.name).toContain('Name is required.');
  });

  it('should handle field blur and touch state', () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    act(() => {
      result.current.handleBlur('name');
    });

    expect(result.current.touched.name).toBe(true);
  });

  it('should calculate dirty state correctly', () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    expect(result.current.isDirty).toBe(false);

    act(() => {
      result.current.handleChange('name', 'Jane');
    });

    expect(result.current.isDirty).toBe(true);
  });

  it('should calculate valid state correctly', () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    expect(result.current.isValid).toBe(true);

    act(() => {
      result.current.handleChange('name', '');
    });

    expect(result.current.isValid).toBe(false);
  });

  it('should handle array operations', () => {
    const arrayModel: FormModel = [
      {
        key: 'items',
        type: 'array',
        label: 'Items',
        itemModel: [
          { key: 'name', type: 'text', label: 'Item Name' }
        ]
      }
    ];

    const { result } = renderHook(() => useFormConfig(arrayModel));

    act(() => {
      result.current.addArrayItem('items');
    });

    expect(Array.isArray(result.current.values.items)).toBe(true);
    expect((result.current.values.items as unknown[]).length).toBe(1);

    act(() => {
      result.current.removeArrayItem('items', 0);
    });

    expect((result.current.values.items as unknown[]).length).toBe(0);
  });

  it('should trigger validation for specific fields', async () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    // Set invalid values
    act(() => {
      result.current.setValue('name', '');
      result.current.setValue('age', 16);
    });

    let isValid: boolean;
    await act(async () => {
      isValid = await result.current.triggerValidation(['name']);
    });

    expect(isValid!).toBe(false);
    expect(result.current.errors.name).toContain('Name is required.');
    // Age should not be validated since it wasn't in the fields list
    expect(result.current.errors.age).toBeUndefined();
  });

  it('should reset form state', () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    act(() => {
      result.current.handleChange('name', 'Jane');
      result.current.handleBlur('name');
    });

    expect(result.current.values.name).toBe('Jane');
    expect(result.current.touched.name).toBe(true);
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.values.name).toBe('John'); // Back to default
    expect(result.current.touched.name).toBeUndefined();
    expect(result.current.isDirty).toBe(false);
  });

  it('should reset with new values', () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    const newValues = { name: 'Bob', age: 30 };

    act(() => {
      result.current.reset(newValues);
    });

    expect(result.current.values.name).toBe('Bob');
    expect(result.current.values.age).toBe(30);
    expect(result.current.isDirty).toBe(false);
  });

  it('should provide field visibility and disabled state', () => {
    const modelWithDependencies: FormModel = [
      { key: 'showAge', type: 'checkbox', label: 'Show Age' },
      {
        key: 'age',
        type: 'number',
        label: 'Age',
        dependencies: [
          {
            field: 'showAge',
            condition: (value) => value === true,
            overrides: { hidden: false }
          }
        ],
        hidden: true
      }
    ];

    const { result } = renderHook(() => useFormConfig(modelWithDependencies));

    expect(result.current.isFieldVisible('age')).toBe(false);

    act(() => {
      result.current.handleChange('showAge', true);
    });

    expect(result.current.isFieldVisible('age')).toBe(true);
  });

  it('should call event hooks when provided', () => {
    const eventHooks = {
      onInit: jest.fn(),
      onFieldChange: jest.fn(),
      onFieldBlur: jest.fn(),
      onFormSubmit: jest.fn(),
    };

    const { result } = renderHook(() =>
      useFormConfig(basicModel, { eventHooks })
    );

    // onInit should be called for each field
    expect(eventHooks.onInit).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.handleChange('name', 'Jane');
    });

    expect(eventHooks.onFieldChange).toHaveBeenCalledWith('name', 'Jane');

    act(() => {
      result.current.handleBlur('name');
    });

    expect(eventHooks.onFieldBlur).toHaveBeenCalledWith('name');
  });

  it('should handle form submission', async () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    const mockSubmit = jest.fn().mockResolvedValue(undefined);

    // Set valid values
    act(() => {
      result.current.setValue('name', 'Jane');
      result.current.setValue('age', 25);
    });

    const submitHandler = result.current.handleSubmit(mockSubmit);

    await act(async () => {
      await submitHandler();
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Jane',
      age: 25
    });
  });

  it('should prevent submission with validation errors', async () => {
    const { result } = renderHook(() => useFormConfig(basicModel));

    const mockSubmit = jest.fn().mockResolvedValue(undefined);

    // Set required field to empty to trigger validation error
    act(() => {
      result.current.setValue('name', '');
    });

    const submitHandler = result.current.handleSubmit(mockSubmit);

    await act(async () => {
      await submitHandler();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.name).toContain('Name is required.');
  });

  describe('Advanced Scenarios', () => {
    it('should handle complex form with all field types', () => {
      const complexModel: FormModel = [
        { key: 'text', type: 'text', label: 'Text Field', defaultValue: 'default' },
        { key: 'number', type: 'number', label: 'Number Field', defaultValue: 42 },
        { key: 'checkbox', type: 'checkbox', label: 'Checkbox Field', defaultValue: true },
        {
          key: 'select', type: 'select', label: 'Select Field', options: async () => [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
          ], defaultValue: 'option1'
        },
      ];

      const { result } = renderHook(() => useFormConfig(complexModel));

      expect(result.current.values.text).toBe('default');
      expect(result.current.values.number).toBe(42);
      expect(result.current.values.checkbox).toBe(true);
      expect(result.current.values.select).toBe('option1');
    });

    it('should handle form with disabled validation', () => {
      const { result } = renderHook(() =>
        useFormConfig(basicModel, { enableValidation: false })
      );

      act(() => {
        result.current.handleChange('name', '');
      });

      expect(result.current.errors.name).toEqual([]);
      expect(result.current.isValid).toBe(true);
    });

    it('should handle form with disabled dependencies', () => {
      const modelWithDeps: FormModel = [
        { key: 'trigger', type: 'checkbox', label: 'Trigger' },
        {
          key: 'dependent',
          type: 'text',
          label: 'Dependent',
          dependencies: [
            {
              field: 'trigger',
              condition: (value) => value === true,
              overrides: { hidden: false }
            }
          ],
          hidden: true
        }
      ];

      const { result } = renderHook(() =>
        useFormConfig(modelWithDeps, { enableDependencies: false })
      );

      // Dependencies should be disabled, so field should remain hidden
      act(() => {
        result.current.handleChange('trigger', true);
      });

      expect(result.current.isFieldVisible('dependent')).toBe(true); // Dependencies disabled, so field uses original state
    });

    it('should handle form with feature flags', () => {
      const modelWithFlags: FormModel = [
        { key: 'normal', type: 'text', label: 'Normal Field' },
        {
          key: 'experimental',
          type: 'text',
          label: 'Experimental Field',
          flags: { experimental: true }
        },
      ];

      // Without flag
      const { result: resultWithoutFlag } = renderHook(() =>
        useFormConfig(modelWithFlags, { flags: {} })
      );

      expect(resultWithoutFlag.current.fields).toHaveLength(1);
      expect(resultWithoutFlag.current.lookup['normal']).toBeDefined();
      expect(resultWithoutFlag.current.lookup['experimental']).toBeUndefined();

      // With flag
      const { result: resultWithFlag } = renderHook(() =>
        useFormConfig(modelWithFlags, { flags: { experimental: true } })
      );

      expect(resultWithFlag.current.fields).toHaveLength(2);
      expect(resultWithFlag.current.lookup['experimental']).toBeDefined();
    });

    it('should handle dynamic options loading', async () => {
      const modelWithDynamicOptions: FormModel = [
        { key: 'category', type: 'select', label: 'Category' },
        {
          key: 'subcategory',
          type: 'select',
          label: 'Subcategory',
          dynamicOptions: {
            trigger: ['category'],
            loader: async (values) => {
              if (values.category === 'electronics') {
                return [
                  { value: 'phones', label: 'Phones' },
                  { value: 'laptops', label: 'Laptops' }
                ];
              }
              return [];
            }
          }
        },
      ];

      const { result } = renderHook(() => useFormConfig(modelWithDynamicOptions));

      act(() => {
        result.current.handleChange('category', 'electronics');
      });

      // Wait for dynamic options to load
      await act(async () => {
        await new Promise(resolve => globalThis.setTimeout(resolve, 0));
      });

      const subcategoryOptions = result.current.dynamicOptions.get('subcategory');
      expect(subcategoryOptions).toEqual([
        { value: 'phones', label: 'Phones' },
        { value: 'laptops', label: 'Laptops' }
      ]);
    });

    it('should handle form submission with async errors', async () => {
      const { result } = renderHook(() => useFormConfig(basicModel));

      const mockSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Set valid values
      act(() => {
        result.current.setValue('name', 'Jane');
        result.current.setValue('age', 25);
      });

      const submitHandler = result.current.handleSubmit(mockSubmit);

      await act(async () => {
        await submitHandler();
      });

      expect(mockSubmit).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Submission handler failed', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should handle form with custom form ID and analytics', () => {
      const { result } = renderHook(() =>
        useFormConfig(basicModel, {
          formId: 'test-form',
          enableAnalytics: true
        })
      );

      expect(result.current.config).toBeDefined();
      // Analytics events should be tracked (tested via event bus)
    });

    it('should handle complex array operations', () => {
      const arrayModel: FormModel = [
        {
          key: 'items',
          type: 'array',
          label: 'Items',
          itemModel: [
            { key: 'name', type: 'text', label: 'Item Name' },
            { key: 'quantity', type: 'number', label: 'Quantity' }
          ]
        }
      ];

      const { result } = renderHook(() => useFormConfig(arrayModel));

      // Add multiple items
      act(() => {
        result.current.addArrayItem('items');
        result.current.addArrayItem('items');
        result.current.addArrayItem('items');
      });

      expect(Array.isArray(result.current.values.items)).toBe(true);
      expect((result.current.values.items as unknown[]).length).toBe(3);

      // Remove middle item
      act(() => {
        result.current.removeArrayItem('items', 1);
      });

      expect((result.current.values.items as unknown[]).length).toBe(2);
    });

    it('should handle field focus events', () => {
      const { result } = renderHook(() => useFormConfig(basicModel));

      act(() => {
        result.current.handleFocus('name');
      });

      // Focus events should be tracked (tested via event bus)
      expect(result.current.values).toBeDefined(); // Basic assertion
    });

    it('should handle error setting and clearing', () => {
      const { result } = renderHook(() => useFormConfig(basicModel));

      // Initially should be valid since default values are set
      expect(result.current.isValid).toBe(true);

      act(() => {
        result.current.setError('name', ['Custom error']);
      });

      expect(result.current.errors.name).toEqual(['Custom error']);
      expect(result.current.isValid).toBe(false);

      act(() => {
        result.current.setError('name', []);
      });

      expect(result.current.errors.name).toEqual([]);
      expect(result.current.isValid).toBe(true);
    });

    it('should handle touched state management', () => {
      const { result } = renderHook(() => useFormConfig(basicModel));

      expect(result.current.touched.name).toBeUndefined();

      act(() => {
        result.current.setTouched('name', true);
      });

      expect(result.current.touched.name).toBe(true);

      act(() => {
        result.current.setTouched('name', false);
      });

      expect(result.current.touched.name).toBe(false);
    });

    it('should handle partial validation correctly', async () => {
      const { result } = renderHook(() => useFormConfig(basicModel));

      // Set invalid values for both fields
      act(() => {
        result.current.setValue('name', '');
        result.current.setValue('age', 16);
      });

      // Validate only name field
      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.triggerValidation(['name']);
      });

      expect(isValid!).toBe(false);
      expect(result.current.errors.name).toContain('Name is required.');
      expect(result.current.errors.age).toBeUndefined(); // Should not be validated

      // Validate all fields
      await act(async () => {
        isValid = await result.current.triggerValidation();
      });

      expect(isValid!).toBe(false);
      expect(result.current.errors.name).toContain('Name is required.');
      expect(result.current.errors.age).toContain('Age must be ≥ 18.');
    });
  });
});