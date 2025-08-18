import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from './useForm';
import { FormModel } from '../model';
import { registerPlugin, clearPlugins, FormPlugin } from '../plugins';

describe('useForm validation', () => {
  beforeEach(() => {
    clearPlugins();
  });

  const model: FormModel = [
    { key: 'age', type: 'number', label: 'Age', validators: { required: true, min: 18 } },
  ];

  it('reports required and min validation', () => {
    const { result } = renderHook(() => useForm(model));
    act(() => {
      result.current.handleBlur('age');
      result.current.handleChange('age', '');
    });
    expect(result.current.errors.age).toContain('Age is required.');

    act(() => {
      result.current.handleChange('age', 16);
    });
    expect(result.current.errors.age).toContain('Age must be ≥ 18.');
  });

  it('includes plugin validation errors', () => {
    const validationPlugin: FormPlugin = {
      name: 'test-validator',
      onValidate: (field, value) => {
        if (field.key === 'age' && typeof value === 'number' && value === 25) {
          return ['25 is not allowed by plugin'];
        }
        return [];
      },
    };

    registerPlugin(validationPlugin);

    const { result } = renderHook(() => useForm(model));

    act(() => {
      result.current.handleChange('age', 25);
    });

    expect(result.current.errors.age).toContain('25 is not allowed by plugin');
  });

  it('combines built-in and plugin validation errors', () => {
    const strictPlugin: FormPlugin = {
      name: 'strict-validator',
      onValidate: (field, value) => {
        if (field.key === 'age' && typeof value === 'number' && value < 21) {
          return ['Must be 21 or older (plugin rule)'];
        }
        return [];
      },
    };

    registerPlugin(strictPlugin);

    const { result } = renderHook(() => useForm(model));

    act(() => {
      result.current.handleChange('age', 19);
    });

    // Should have both built-in (min: 18) passes but plugin validation fails
    expect(result.current.errors.age).toContain('Must be 21 or older (plugin rule)');
    // Built-in min validation should pass for 19
    expect(result.current.errors.age).not.toContain('Age must be ≥ 18.');
  });

  it('handles plugin validation errors gracefully', () => {
    const faultyPlugin: FormPlugin = {
      name: 'faulty-validator',
      onValidate: () => {
        throw new Error('Plugin validation failed');
      },
    };

    registerPlugin(faultyPlugin);

    const { result } = renderHook(() => useForm(model));

    // Should not crash when plugin throws error
    act(() => {
      result.current.handleChange('age', 20);
    });

    // Should only have built-in validation (plugin errors ignored)
    expect(result.current.errors.age).toEqual([]);
  });
});
