import { createFormConfig } from './buildFormConfig';
import { FormModel, FieldProps } from '../../model';
import { FormConfigOptions } from '../types';

describe('createFormConfig', () => {
  describe('Basic Configuration', () => {
    it('should create basic form configuration', () => {
      const model: FormModel = [
        {
          key: 'name',
          type: 'text',
          label: 'Name',
          validators: { required: true },
        },
        {
          key: 'age',
          type: 'number',
          label: 'Age',
          validators: { min: 0, max: 120 },
        },
      ];

      const result = createFormConfig(model);

      expect(result.fields).toHaveLength(2);
      expect(result.lookup['name']).toBeDefined();
      expect(result.lookup['age']).toBeDefined();
      expect(result.config.metadata.fieldCount).toBe(2);
      expect(result.config.metadata.requiredFields).toContain('name');
      expect(result.config.metadata.optionalFields).toContain('age');
    });

    it('should create empty configuration for empty model', () => {
      const model: FormModel = [];
      const result = createFormConfig(model);

      expect(result.fields).toHaveLength(0);
      expect(result.lookup).toEqual({});
      expect(result.config.metadata.fieldCount).toBe(0);
      expect(result.config.metadata.hasArrayFields).toBe(false);
      expect(result.config.metadata.hasDependencies).toBe(false);
      expect(result.config.metadata.hasValidation).toBe(false);
      expect(result.config.metadata.requiredFields).toEqual([]);
      expect(result.config.metadata.optionalFields).toEqual([]);
    });

    it('should generate unique IDs for each field', () => {
      const model: FormModel = [
        { key: 'field1', type: 'text', label: 'Field 1' },
        { key: 'field2', type: 'text', label: 'Field 2' },
      ];

      const result = createFormConfig(model);

      expect(result.fields[0].id).toBeDefined();
      expect(result.fields[1].id).toBeDefined();
      expect(result.fields[0].id).not.toBe(result.fields[1].id);
      expect(typeof result.fields[0].id).toBe('string');
      expect(result.fields[0].id.length).toBeGreaterThan(0);
    });

    it('should set correct field paths', () => {
      const model: FormModel = [
        { key: 'name', type: 'text', label: 'Name' },
        { key: 'email', type: 'text', label: 'Email' },
      ];

      const result = createFormConfig(model);

      expect(result.fields[0].path).toBe('name');
      expect(result.fields[1].path).toBe('email');
      expect(result.lookup['name'].path).toBe('name');
      expect(result.lookup['email'].path).toBe('email');
    });
  });

  describe('Validation Integration', () => {
    it('should handle validation correctly', () => {
      const model: FormModel = [
        {
          key: 'email',
          type: 'text',
          label: 'Email',
          validators: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          },
        },
      ];

      const result = createFormConfig(model);

      // Test required validation
      const requiredErrors = result.validation.validateField('email', '');
      expect(requiredErrors).toContain('Email is required.');

      // Test pattern validation
      const patternErrors = result.validation.validateField('email', 'invalid-email');
      expect(patternErrors).toContain('Email has invalid format.');

      // Test valid email
      const validErrors = result.validation.validateField('email', 'test@example.com');
      expect(validErrors).toHaveLength(0);
    });

    it('should validate all fields at once', () => {
      const model: FormModel = [
        {
          key: 'name',
          type: 'text',
          label: 'Name',
          validators: { required: true },
        },
        {
          key: 'age',
          type: 'number',
          label: 'Age',
          validators: { min: 18 },
        },
      ];

      const result = createFormConfig(model);

      const errors = result.validation.validateAll({
        name: '',
        age: 16,
      });

      expect(errors.name).toContain('Name is required.');
      expect(errors.age).toContain('Age must be ≥ 18.');
    });

    it('should return empty errors for valid form', () => {
      const model: FormModel = [
        {
          key: 'name',
          type: 'text',
          label: 'Name',
          validators: { required: true },
        },
      ];

      const result = createFormConfig(model);

      const errors = result.validation.validateAll({ name: 'John' });
      expect(errors).toEqual({});
    });

    it('should handle non-existent field validation gracefully', () => {
      const model: FormModel = [
        { key: 'name', type: 'text', label: 'Name' },
      ];

      const result = createFormConfig(model);

      const errors = result.validation.validateField('nonexistent', 'value');
      expect(errors).toEqual([]);
    });
  });

  describe('Dependencies Integration', () => {
    it('should handle dependencies correctly', () => {
      const model: FormModel = [
        {
          key: 'hasAddress',
          type: 'checkbox',
          label: 'Has Address',
        },
        {
          key: 'address',
          type: 'text',
          label: 'Address',
          dependencies: [
            {
              field: 'hasAddress',
              condition: (value) => value === true,
              overrides: { hidden: false },
            },
          ],
          hidden: true,
        },
      ];

      const result = createFormConfig(model);

      // Test visibility when dependency is false
      const hiddenVisibility = result.state.getFieldVisibility('address', { hasAddress: false });
      expect(hiddenVisibility).toBe(false);

      // Test visibility when dependency is true
      const visibleVisibility = result.state.getFieldVisibility('address', { hasAddress: true });
      expect(visibleVisibility).toBe(true);
    });

    it('should handle disabled state dependencies', () => {
      const model: FormModel = [
        {
          key: 'enableEdit',
          type: 'checkbox',
          label: 'Enable Edit',
        },
        {
          key: 'editableField',
          type: 'text',
          label: 'Editable Field',
          dependencies: [
            {
              field: 'enableEdit',
              condition: (value) => value === true,
              overrides: { disabled: false },
            },
          ],
          disabled: true,
        },
      ];

      const result = createFormConfig(model);

      // Test disabled when dependency is false
      const disabledState = result.state.getFieldDisabled('editableField', { enableEdit: false });
      expect(disabledState).toBe(true);

      // Test enabled when dependency is true
      const enabledState = result.state.getFieldDisabled('editableField', { enableEdit: true });
      expect(enabledState).toBe(false);
    });

    it('should apply effective field properties with dependencies', () => {
      const model: FormModel = [
        {
          key: 'mode',
          type: 'text',
          label: 'Mode',
        },
        {
          key: 'dynamicField',
          type: 'text',
          label: 'Dynamic Field',
          defaultValue: 'original',
          dependencies: [
            {
              field: 'mode',
              condition: (value) => value === 'advanced',
              overrides: {
                label: 'Advanced Field',
                defaultValue: 'advanced_default',
                disabled: false
              },
            },
          ],
          disabled: true,
        },
      ];

      const result = createFormConfig(model);

      // Test original field properties
      const originalField = result.state.getEffectiveField('dynamicField', { mode: 'basic' });
      expect(originalField.label).toBe('Dynamic Field');
      expect(originalField.defaultValue).toBe('original');
      expect(originalField.disabled).toBe(true);

      // Test overridden field properties
      const overriddenField = result.state.getEffectiveField('dynamicField', { mode: 'advanced' });
      expect(overriddenField.label).toBe('Advanced Field');
      expect(overriddenField.defaultValue).toBe('advanced_default');
      expect(overriddenField.disabled).toBe(false);
    });

    it('should track dependency metadata correctly', () => {
      const model: FormModel = [
        {
          key: 'trigger',
          type: 'checkbox',
          label: 'Trigger',
        },
        {
          key: 'dependent',
          type: 'text',
          label: 'Dependent',
          dependencies: [
            {
              field: 'trigger',
              condition: (value) => value === true,
              overrides: { hidden: false },
            },
          ],
        },
      ];

      const result = createFormConfig(model);

      expect(result.config.metadata.hasDependencies).toBe(true);
      expect(result.dependencies.size).toBe(1); // Only dependent field has dependency resolution
      expect(result.dependencies.get('dependent')?.dependsOn).toEqual(['trigger']);
    });
  });

  describe('Array Fields', () => {
    it('should handle array fields', () => {
      const model: FormModel = [
        {
          key: 'items',
          type: 'array',
          label: 'Items',
          itemModel: [
            {
              key: 'name',
              type: 'text',
              label: 'Item Name',
            },
          ],
        },
      ];

      const result = createFormConfig(model);

      expect(result.config.metadata.hasArrayFields).toBe(true);
      expect(result.lookup['items']).toBeDefined();
      expect(result.lookup['items[0].name']).toBeDefined();
    });

    it('should handle nested array fields', () => {
      const model: FormModel = [
        {
          key: 'sections',
          type: 'array',
          label: 'Sections',
          itemModel: [
            {
              key: 'title',
              type: 'text',
              label: 'Section Title',
            },
            {
              key: 'items',
              type: 'array',
              label: 'Section Items',
              itemModel: [
                {
                  key: 'name',
                  type: 'text',
                  label: 'Item Name',
                },
              ],
            },
          ],
        },
      ];

      const result = createFormConfig(model);

      expect(result.config.metadata.hasArrayFields).toBe(true);
      expect(result.lookup['sections']).toBeDefined();
      expect(result.lookup['sections[0].title']).toBeDefined();
      expect(result.lookup['sections[0].items']).toBeDefined();
      expect(result.lookup['sections[0].items[0].name']).toBeDefined();
    });

    it('should handle array fields with validation', () => {
      const model: FormModel = [
        {
          key: 'tags',
          type: 'array',
          label: 'Tags',
          validators: { minItems: 1, maxItems: 5 },
          itemModel: [
            {
              key: 'name',
              type: 'text',
              label: 'Tag Name',
              validators: { required: true },
            },
          ],
        },
      ];

      const result = createFormConfig(model);

      // Test array validation
      const emptyArrayErrors = result.validation.validateField('tags', []);
      expect(emptyArrayErrors).toContain('Tags must have at least 1 items.');

      const tooManyItemsErrors = result.validation.validateField('tags', [1, 2, 3, 4, 5, 6]);
      expect(tooManyItemsErrors).toContain('Tags must have at most 5 items.');

      // Test item validation
      const itemErrors = result.validation.validateField('tags[0].name', '');
      expect(itemErrors).toContain('Tag Name is required.');
    });
  });

  describe('Feature Flags', () => {
    it('should handle flags correctly', () => {
      const model: FormModel = [
        {
          key: 'feature1',
          type: 'text',
          label: 'Feature 1',
          flags: { experimental: true },
        },
        {
          key: 'feature2',
          type: 'text',
          label: 'Feature 2',
        },
      ];

      // Without experimental flag
      const resultWithoutFlag = createFormConfig(model, { flags: {} });
      expect(resultWithoutFlag.fields).toHaveLength(1);
      expect(resultWithoutFlag.lookup['feature2']).toBeDefined();
      expect(resultWithoutFlag.lookup['feature1']).toBeUndefined();

      // With experimental flag
      const resultWithFlag = createFormConfig(model, { flags: { experimental: true } });
      expect(resultWithFlag.fields).toHaveLength(2);
      expect(resultWithFlag.lookup['feature1']).toBeDefined();
      expect(resultWithFlag.lookup['feature2']).toBeDefined();
    });

    it('should handle multiple flags', () => {
      const model: FormModel = [
        {
          key: 'field1',
          type: 'text',
          label: 'Field 1',
          flags: { beta: true, experimental: true },
        },
        {
          key: 'field2',
          type: 'text',
          label: 'Field 2',
          flags: { beta: true },
        },
        {
          key: 'field3',
          type: 'text',
          label: 'Field 3',
        },
      ];

      // Only beta flag enabled
      const betaResult = createFormConfig(model, { flags: { beta: true } });
      expect(betaResult.fields).toHaveLength(2); // field2 and field3
      expect(betaResult.lookup['field2']).toBeDefined();
      expect(betaResult.lookup['field3']).toBeDefined();
      expect(betaResult.lookup['field1']).toBeUndefined(); // Requires both flags

      // Both flags enabled
      const allFlagsResult = createFormConfig(model, { flags: { beta: true, experimental: true } });
      expect(allFlagsResult.fields).toHaveLength(3);
      expect(allFlagsResult.lookup['field1']).toBeDefined();
      expect(allFlagsResult.lookup['field2']).toBeDefined();
      expect(allFlagsResult.lookup['field3']).toBeDefined();
    });

    it('should handle flags in array items', () => {
      const model: FormModel = [
        {
          key: 'items',
          type: 'array',
          label: 'Items',
          itemModel: [
            {
              key: 'name',
              type: 'text',
              label: 'Name',
            },
            {
              key: 'experimental_field',
              type: 'text',
              label: 'Experimental Field',
              flags: { experimental: true },
            },
          ],
        },
      ];

      // Without experimental flag
      const resultWithoutFlag = createFormConfig(model, { flags: {} });
      expect(resultWithoutFlag.lookup['items[0].name']).toBeDefined();
      expect(resultWithoutFlag.lookup['items[0].experimental_field']).toBeUndefined();

      // With experimental flag
      const resultWithFlag = createFormConfig(model, { flags: { experimental: true } });
      expect(resultWithFlag.lookup['items[0].name']).toBeDefined();
      expect(resultWithFlag.lookup['items[0].experimental_field']).toBeDefined();
    });
  });

  describe('Default Values', () => {
    it('should handle default values', () => {
      const model: FormModel = [
        {
          key: 'name',
          type: 'text',
          label: 'Name',
          defaultValue: 'John Doe',
        },
      ];

      const result = createFormConfig(model);
      expect(result.config.computed.defaultValues['name']).toBe('John Doe');
    });

    it('should handle different types of default values', () => {
      const model: FormModel = [
        {
          key: 'text_field',
          type: 'text',
          label: 'Text Field',
          defaultValue: 'default text',
        },
        {
          key: 'number_field',
          type: 'number',
          label: 'Number Field',
          defaultValue: 42,
        },
        {
          key: 'boolean_field',
          type: 'checkbox',
          label: 'Boolean Field',
          defaultValue: true,
        },
        {
          key: 'array_field',
          type: 'array',
          label: 'Array Field',
          defaultValue: ['item1', 'item2'],
        },
      ];

      const result = createFormConfig(model);

      expect(result.config.computed.defaultValues['text_field']).toBe('default text');
      expect(result.config.computed.defaultValues['number_field']).toBe(42);
      expect(result.config.computed.defaultValues['boolean_field']).toBe(true);
      expect(result.config.computed.defaultValues['array_field']).toEqual(['item1', 'item2']);
    });

    it('should merge initial values with default values', () => {
      const model: FormModel = [
        {
          key: 'field1',
          type: 'text',
          label: 'Field 1',
          defaultValue: 'default1',
        },
        {
          key: 'field2',
          type: 'text',
          label: 'Field 2',
          defaultValue: 'default2',
        },
      ];

      const result = createFormConfig(model, {
        initialValues: { field1: 'initial1', field3: 'initial3' },
      });

      expect(result.config.computed.defaultValues['field1']).toBe('default1'); // Default value is set first
      expect(result.config.computed.defaultValues['field2']).toBe('default2'); // Default value used
      expect(result.config.computed.defaultValues['field3']).toBe('initial3'); // Initial value for non-existent field
    });

    it('should ignore null and undefined default values', () => {
      const model: FormModel = [
        {
          key: 'field1',
          type: 'text',
          label: 'Field 1',
          defaultValue: null,
        },
        {
          key: 'field2',
          type: 'text',
          label: 'Field 2',
          defaultValue: undefined,
        },
        {
          key: 'field3',
          type: 'text',
          label: 'Field 3',
          defaultValue: '',
        },
      ];

      const result = createFormConfig(model);

      expect(result.config.computed.defaultValues['field1']).toBeUndefined();
      expect(result.config.computed.defaultValues['field2']).toBeUndefined();
      expect(result.config.computed.defaultValues['field3']).toBe(''); // Empty string is valid
    });
  });

  describe('Configuration Options', () => {
    it('should disable validation when option is false', () => {
      const model: FormModel = [
        {
          key: 'name',
          type: 'text',
          label: 'Name',
          validators: { required: true },
        },
      ];

      const result = createFormConfig(model, { enableValidation: false });
      expect(result.config.metadata.hasValidation).toBe(false);

      const errors = result.validation.validateField('name', '');
      expect(errors).toHaveLength(0);
    });

    it('should disable dependencies when option is false', () => {
      const model: FormModel = [
        {
          key: 'toggle',
          type: 'checkbox',
          label: 'Toggle',
        },
        {
          key: 'dependent',
          type: 'text',
          label: 'Dependent',
          dependencies: [
            {
              field: 'toggle',
              condition: (value) => value === true,
              overrides: { hidden: false },
            },
          ],
        },
      ];

      const result = createFormConfig(model, { enableDependencies: false });
      expect(result.config.metadata.hasDependencies).toBe(false);
      expect(result.dependencies.size).toBe(0);
    });

    it('should handle all options together', () => {
      const model: FormModel = [
        {
          key: 'field1',
          type: 'text',
          label: 'Field 1',
          validators: { required: true },
          flags: { experimental: true },
        },
        {
          key: 'field2',
          type: 'text',
          label: 'Field 2',
          dependencies: [
            {
              field: 'field1',
              condition: (value) => value !== '',
              overrides: { hidden: false },
            },
          ],
          hidden: true,
        },
      ];

      const options: FormConfigOptions = {
        flags: { experimental: true },
        initialValues: { field1: 'initial' },
        enableValidation: false,
        enableDependencies: false,
      };

      const result = createFormConfig(model, options);

      // Flags should work
      expect(result.fields).toHaveLength(2);
      expect(result.lookup['field1']).toBeDefined();

      // Initial values should be applied
      expect(result.config.computed.defaultValues['field1']).toBe('initial');

      // Validation should be disabled
      expect(result.config.metadata.hasValidation).toBe(false);
      expect(result.validation.validateField('field1', '')).toHaveLength(0);

      // Dependencies should be disabled
      expect(result.config.metadata.hasDependencies).toBe(false);
      expect(result.dependencies.size).toBe(0);
    });
  });

  describe('Metadata Generation', () => {
    it('should generate correct metadata for complex forms', () => {
      const model: FormModel = [
        {
          key: 'required_field',
          type: 'text',
          label: 'Required Field',
          validators: { required: true },
        },
        {
          key: 'optional_field',
          type: 'text',
          label: 'Optional Field',
        },
        {
          key: 'array_field',
          type: 'array',
          label: 'Array Field',
          itemModel: [
            {
              key: 'item_name',
              type: 'text',
              label: 'Item Name',
            },
          ],
        },
        {
          key: 'dependent_field',
          type: 'text',
          label: 'Dependent Field',
          dependencies: [
            {
              field: 'required_field',
              condition: (value) => value !== '',
              overrides: { hidden: false },
            },
          ],
        },
      ];

      const result = createFormConfig(model);

      expect(result.config.metadata.fieldCount).toBe(5); // Includes array item field
      expect(result.config.metadata.hasArrayFields).toBe(true);
      expect(result.config.metadata.hasDependencies).toBe(true);
      expect(result.config.metadata.hasValidation).toBe(true);
      expect(result.config.metadata.requiredFields).toEqual(['required_field']);
      expect(result.config.metadata.optionalFields).toEqual([
        'optional_field',
        'array_field',
        'array_field[0].item_name',
        'dependent_field',
      ]);
    });

    it('should generate dependency graph correctly', () => {
      const model: FormModel = [
        {
          key: 'field1',
          type: 'text',
          label: 'Field 1',
        },
        {
          key: 'field2',
          type: 'text',
          label: 'Field 2',
          dependencies: [
            {
              field: 'field1',
              condition: (value) => value !== '',
              overrides: { hidden: false },
            },
          ],
        },
        {
          key: 'field3',
          type: 'text',
          label: 'Field 3',
          dependencies: [
            {
              field: 'field1',
              condition: (value) => value === 'show',
              overrides: { hidden: false },
            },
          ],
        },
      ];

      const result = createFormConfig(model);

      const dependencyGraph = result.config.computed.dependencyGraph;
      expect(dependencyGraph.get('field1')).toEqual(['field2', 'field3']);
      expect(dependencyGraph.get('field2') || []).toEqual([]);
      expect(dependencyGraph.get('field3') || []).toEqual([]);
    });

    it('should generate validation rules map correctly', () => {
      const model: FormModel = [
        {
          key: 'field1',
          type: 'text',
          label: 'Field 1',
          validators: { required: true, min: 3 },
        },
        {
          key: 'field2',
          type: 'number',
          label: 'Field 2',
          validators: { max: 100 },
        },
        {
          key: 'field3',
          type: 'text',
          label: 'Field 3',
        },
      ];

      const result = createFormConfig(model);

      const validationRules = result.config.computed.validationRules;
      expect(validationRules.get('field1')).toHaveLength(2); // required + min
      expect(validationRules.get('field2')).toHaveLength(1); // max
      expect(validationRules.get('field3')).toBeUndefined(); // no validators
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed model gracefully', () => {
      const model: FormModel = [
        {
          key: 'valid_field',
          type: 'text',
          label: 'Valid Field',
        },
        {
          key: '',
          type: 'text',
          label: 'Invalid Field',
        } as FieldProps,
      ];

      expect(() => createFormConfig(model)).not.toThrow();
      const result = createFormConfig(model);
      expect(result.fields).toHaveLength(2); // Both fields should be processed
    });

    it('should handle circular dependencies gracefully', () => {
      const model: FormModel = [
        {
          key: 'field1',
          type: 'text',
          label: 'Field 1',
          dependencies: [
            {
              field: 'field2',
              condition: (value) => value !== '',
              overrides: { hidden: false },
            },
          ],
        },
        {
          key: 'field2',
          type: 'text',
          label: 'Field 2',
          dependencies: [
            {
              field: 'field1',
              condition: (value) => value !== '',
              overrides: { hidden: false },
            },
          ],
        },
      ];

      expect(() => createFormConfig(model)).not.toThrow();
      const result = createFormConfig(model);
      expect(result.fields).toHaveLength(2);
      expect(result.config.metadata.hasDependencies).toBe(true);
    });
  });
});