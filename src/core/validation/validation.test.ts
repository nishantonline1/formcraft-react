import {
  validateField,
  validateAllFields,
  validateSpecificFields,
  extractValidationRules,
  createFieldValidator,
  createFormValidator,
  isFormValid,
  getAllErrorMessages,
  mergeValidationErrors,
} from './validation';
import { ConfigField, FormValues, FormValue } from '../../types';
import { FieldProps } from '../../model';

// Mock the plugins module
jest.mock('../../plugins', () => ({
  runPluginValidation: jest.fn(() => []),
}));

describe('Core Validation Module', () => {
  describe('validateField', () => {
    it('should return empty array for field without validators', () => {
      const field: FieldProps = {
        key: 'test',
        label: 'Test Field',
        type: 'text',
      };

      const errors = validateField(field, 'test value');
      expect(errors).toEqual([]);
    });

    it('should handle null and undefined field validators', () => {
      const field: FieldProps = {
        key: 'test',
        label: 'Test Field',
        type: 'text',
        validators: undefined,
      };

      const errors = validateField(field, 'test value');
      expect(errors).toEqual([]);
    });

    it('should validate required fields', () => {
      const field: FieldProps = {
        key: 'required',
        label: 'Required Field',
        type: 'text',
        validators: { required: true },
      };

      expect(validateField(field, '')).toEqual(['Required Field is required.']);
      expect(validateField(field, null as unknown as FormValue)).toEqual(['Required Field is required.']);
      expect(validateField(field, undefined as unknown as FormValue)).toEqual(['Required Field is required.']);
      expect(validateField(field, 'valid')).toEqual([]);
    });

    it('should validate number min/max constraints', () => {
      const field: FieldProps = {
        key: 'number',
        label: 'Number Field',
        type: 'number',
        validators: { min: 5, max: 10 },
      };

      expect(validateField(field, 3)).toEqual(['Number Field must be ≥ 5.']);
      expect(validateField(field, 12)).toEqual(['Number Field must be ≤ 10.']);
      expect(validateField(field, 7)).toEqual([]);
    });

    it('should validate decimal places', () => {
      const field: FieldProps = {
        key: 'decimal',
        label: 'Decimal Field',
        type: 'number',
        validators: { decimal_places: 2 },
      };

      expect(validateField(field, 3.123)).toEqual(['Decimal Field must have at most 2 decimal places.']);
      expect(validateField(field, 3.12)).toEqual([]);
      expect(validateField(field, 3)).toEqual([]);
    });

    it('should validate string patterns', () => {
      const field: FieldProps = {
        key: 'email',
        label: 'Email Field',
        type: 'text',
        validators: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      };

      expect(validateField(field, 'invalid-email')).toEqual(['Email Field has invalid format.']);
      expect(validateField(field, 'valid@email.com')).toEqual([]);
    });

    it('should validate string length', () => {
      const field: FieldProps = {
        key: 'text',
        label: 'Text Field',
        type: 'text',
        validators: { min: 3, max: 10 },
      };

      expect(validateField(field, 'ab')).toEqual(['Text Field must be at least 3 characters.']);
      expect(validateField(field, 'this is too long')).toEqual(['Text Field must be at most 10 characters.']);
      expect(validateField(field, 'valid')).toEqual([]);
    });

    it('should validate edge cases for string length', () => {
      const field: FieldProps = {
        key: 'text',
        label: 'Text Field',
        type: 'text',
        validators: { min: 0, max: 0 },
      };

      expect(validateField(field, '')).toEqual([]);
      expect(validateField(field, 'a')).toEqual(['Text Field must be at most 0 characters.']);
    });

    it('should validate only min length when max is not specified', () => {
      const field: FieldProps = {
        key: 'text',
        label: 'Text Field',
        type: 'text',
        validators: { min: 5 },
      };

      expect(validateField(field, 'abc')).toEqual(['Text Field must be at least 5 characters.']);
      expect(validateField(field, 'valid text')).toEqual([]);
    });

    it('should validate only max length when min is not specified', () => {
      const field: FieldProps = {
        key: 'text',
        label: 'Text Field',
        type: 'text',
        validators: { max: 5 },
      };

      expect(validateField(field, 'too long')).toEqual(['Text Field must be at most 5 characters.']);
      expect(validateField(field, 'ok')).toEqual([]);
    });

    it('should validate array items', () => {
      const field: FieldProps = {
        key: 'array',
        label: 'Array Field',
        type: 'array',
        validators: { minItems: 2, maxItems: 5 },
      };

      expect(validateField(field, [1])).toEqual(['Array Field must have at least 2 items.']);
      expect(validateField(field, [1, 2, 3, 4, 5, 6])).toEqual(['Array Field must have at most 5 items.']);
      expect(validateField(field, [1, 2, 3])).toEqual([]);
    });

    it('should validate custom validators', () => {
      const customValidator = jest.fn((value) => {
        if (value === 'invalid') return ['Custom error'];
        return [];
      });

      const field: FieldProps = {
        key: 'custom',
        label: 'Custom Field',
        type: 'text',
        validators: { custom: customValidator },
      };

      expect(validateField(field, 'invalid')).toEqual(['Custom error']);
      expect(validateField(field, 'valid')).toEqual([]);
      expect(customValidator).toHaveBeenCalledWith('invalid');
      expect(customValidator).toHaveBeenCalledWith('valid');
    });

    it('should handle custom validator errors gracefully', () => {
      const customValidator = jest.fn(() => {
        throw new Error('Validator error');
      });

      const field: FieldProps = {
        key: 'custom',
        label: 'Custom Field',
        type: 'text',
        validators: { custom: customValidator },
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const errors = validateField(field, 'test');

      expect(errors).toEqual(['Custom Field validation failed.']);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should skip other validations if required field is empty', () => {
      const field: FieldProps = {
        key: 'required',
        label: 'Required Field',
        type: 'text',
        validators: {
          required: true,
          min: 5,
          pattern: /test/
        },
      };

      const errors = validateField(field, '');
      expect(errors).toEqual(['Required Field is required.']);
      // Should not include min length or pattern errors
    });

    it('should handle multiple validation errors', () => {
      const field: FieldProps = {
        key: 'multi',
        label: 'Multi Field',
        type: 'text',
        validators: {
          min: 10,
          pattern: /^\d+$/
        },
      };

      const errors = validateField(field, 'abc');
      expect(errors).toHaveLength(2);
      expect(errors).toContain('Multi Field must be at least 10 characters.');
      expect(errors).toContain('Multi Field has invalid format.');
    });

    it('should validate boolean values correctly', () => {
      const field: FieldProps = {
        key: 'checkbox',
        label: 'Checkbox Field',
        type: 'checkbox',
        validators: { required: true },
      };

      // For boolean fields, false is considered a valid value, not empty
      // Only null, undefined, or empty string should trigger required validation
      expect(validateField(field, false)).toEqual([]);
      expect(validateField(field, true)).toEqual([]);
      expect(validateField(field, null as unknown as FormValue)).toEqual(['Checkbox Field is required.']);
      expect(validateField(field, undefined as unknown as FormValue)).toEqual(['Checkbox Field is required.']);
    });

    it('should handle zero values correctly', () => {
      const numberField: FieldProps = {
        key: 'number',
        label: 'Number Field',
        type: 'number',
        validators: { required: true },
      };

      expect(validateField(numberField, 0)).toEqual([]); // 0 is a valid value

      const stringField: FieldProps = {
        key: 'string',
        label: 'String Field',
        type: 'text',
        validators: { required: true },
      };

      expect(validateField(stringField, '0')).toEqual([]); // '0' is a valid string
    });

    it('should validate complex patterns', () => {
      const emailField: FieldProps = {
        key: 'email',
        label: 'Email Field',
        type: 'text',
        validators: { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
      };

      expect(validateField(emailField, 'invalid')).toContain('Email Field has invalid format.');
      expect(validateField(emailField, 'test@')).toContain('Email Field has invalid format.');
      expect(validateField(emailField, 'test@example')).toContain('Email Field has invalid format.');
      expect(validateField(emailField, 'test@example.com')).toEqual([]);
      expect(validateField(emailField, 'user.name+tag@example.co.uk')).toEqual([]);
    });

    it('should handle custom validator returning non-array', () => {
      const customValidator = jest.fn(() => 'single error' as unknown as string[]);

      const field: FieldProps = {
        key: 'custom',
        label: 'Custom Field',
        type: 'text',
        validators: { custom: customValidator },
      };

      const errors = validateField(field, 'test');
      expect(errors).toEqual([]); // Non-array return should be ignored
    });

    it('should handle custom validator returning empty array', () => {
      const customValidator = jest.fn(() => []);

      const field: FieldProps = {
        key: 'custom',
        label: 'Custom Field',
        type: 'text',
        validators: { custom: customValidator },
      };

      const errors = validateField(field, 'test');
      expect(errors).toEqual([]);
    });
  });

  describe('validateAllFields', () => {
    it('should validate all fields and return errors object', () => {
      const fields: ConfigField[] = [
        {
          id: '1',
          path: 'field1',
          key: 'field1',
          label: 'Field 1',
          type: 'text',
          validators: { required: true },
        },
        {
          id: '2',
          path: 'field2',
          key: 'field2',
          label: 'Field 2',
          type: 'number',
          validators: { min: 5 },
        },
      ];

      const values: FormValues = {
        field1: '',
        field2: 3,
      };

      const errors = validateAllFields(fields, values);

      expect(errors).toEqual({
        field1: ['Field 1 is required.'],
        field2: ['Field 2 must be ≥ 5.'],
      });
    });

    it('should return empty object when all fields are valid', () => {
      const fields: ConfigField[] = [
        {
          id: '1',
          path: 'field1',
          key: 'field1',
          label: 'Field 1',
          type: 'text',
          validators: { required: true },
        },
      ];

      const values: FormValues = {
        field1: 'valid value',
      };

      const errors = validateAllFields(fields, values);
      expect(errors).toEqual({});
    });
  });

  describe('validateSpecificFields', () => {
    it('should validate only specified fields', () => {
      const fields: ConfigField[] = [
        {
          id: '1',
          path: 'field1',
          key: 'field1',
          label: 'Field 1',
          type: 'text',
          validators: { required: true },
        },
        {
          id: '2',
          path: 'field2',
          key: 'field2',
          label: 'Field 2',
          type: 'text',
          validators: { required: true },
        },
      ];

      const values: FormValues = {
        field1: '',
        field2: '',
      };

      const errors = validateSpecificFields(fields, values, ['field1']);

      expect(errors).toEqual({
        field1: ['Field 1 is required.'],
      });
      expect(errors.field2).toBeUndefined();
    });
  });

  describe('extractValidationRules', () => {
    it('should extract all validation rules from field', () => {
      const field: FieldProps = {
        key: 'test',
        label: 'Test Field',
        type: 'text',
        validators: {
          required: true,
          min: 5,
          max: 10,
          pattern: /test/,
          decimal_places: 2,
          minItems: 1,
          maxItems: 5,
          custom: () => [],
        },
      };

      const rules = extractValidationRules(field);

      expect(rules).toHaveLength(8);
      expect(rules.map(r => r.type)).toEqual([
        'required',
        'min',
        'max',
        'pattern',
        'decimal_places',
        'minItems',
        'maxItems',
        'custom',
      ]);
    });

    it('should return empty array for field without validators', () => {
      const field: FieldProps = {
        key: 'test',
        label: 'Test Field',
        type: 'text',
      };

      const rules = extractValidationRules(field);
      expect(rules).toEqual([]);
    });
  });

  describe('createFieldValidator', () => {
    it('should create a validator function for a field', () => {
      const field: FieldProps = {
        key: 'test',
        label: 'Test Field',
        type: 'text',
        validators: { required: true },
      };

      const validator = createFieldValidator(field);

      expect(validator('')).toEqual(['Test Field is required.']);
      expect(validator('valid')).toEqual([]);
    });
  });

  describe('createFormValidator', () => {
    it('should create a validator function for all fields', () => {
      const fields: ConfigField[] = [
        {
          id: '1',
          path: 'field1',
          key: 'field1',
          label: 'Field 1',
          type: 'text',
          validators: { required: true },
        },
      ];

      const validator = createFormValidator(fields);

      expect(validator({ field1: '' })).toEqual({
        field1: ['Field 1 is required.'],
      });
      expect(validator({ field1: 'valid' })).toEqual({});
    });
  });

  describe('isFormValid', () => {
    it('should return true for empty errors object', () => {
      expect(isFormValid({})).toBe(true);
    });

    it('should return false for errors object with errors', () => {
      expect(isFormValid({ field1: ['Error'] })).toBe(false);
    });
  });

  describe('getAllErrorMessages', () => {
    it('should extract all error messages from errors object', () => {
      const errors = {
        field1: ['Error 1', 'Error 2'],
        field2: ['Error 3'],
      };

      const messages = getAllErrorMessages(errors);
      expect(messages).toEqual(['Error 1', 'Error 2', 'Error 3']);
    });

    it('should return empty array for empty errors object', () => {
      expect(getAllErrorMessages({})).toEqual([]);
    });
  });

  describe('mergeValidationErrors', () => {
    it('should merge multiple error objects', () => {
      const errors1 = { field1: ['Error 1'] };
      const errors2 = { field1: ['Error 2'], field2: ['Error 3'] };
      const errors3 = { field3: ['Error 4'] };

      const merged = mergeValidationErrors(errors1, errors2, errors3);

      expect(merged).toEqual({
        field1: ['Error 1', 'Error 2'],
        field2: ['Error 3'],
        field3: ['Error 4'],
      });
    });

    it('should handle empty error objects', () => {
      const errors1 = { field1: ['Error 1'] };
      const errors2 = {};

      const merged = mergeValidationErrors(errors1, errors2);
      expect(merged).toEqual({ field1: ['Error 1'] });
    });
  });
});