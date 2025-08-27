import {
  evaluateFieldDependencies,
  evaluateAllDependencies,
  isFieldVisible,
  isFieldDisabled,
  getEffectiveFieldProps,
  buildDependencyGraph,
  getDependentFields,
  detectCircularDependencies,
  createDependencyResolver,
  createFieldStateQueries,
} from './dependencies';
import { ConfigField, FormValues, FormValue } from '../../types';

describe('Core Dependencies Module', () => {
  const createMockField = (overrides: Partial<ConfigField> = {}): ConfigField => ({
    id: '1',
    path: 'field1',
    key: 'field1',
    label: 'Field 1',
    type: 'text',
    ...overrides,
  });

  const createMockFieldWithId = (id: string, key: string, overrides: Partial<ConfigField> = {}): ConfigField => ({
    id,
    path: key,
    key,
    label: `${key} Label`,
    type: 'text',
    ...overrides,
  });

  describe('evaluateFieldDependencies', () => {
    it('should return default state for field without dependencies', () => {
      const field = createMockField();
      const values: FormValues = {};
      const allFields = [field];

      const result = evaluateFieldDependencies(field, values, allFields);

      expect(result).toEqual({
        field: 'field1',
        isVisible: true,
        isDisabled: false,
        overrides: {},
        dependsOn: [],
      });
    });

    it('should handle hidden field', () => {
      const field = createMockField({ hidden: true });
      const values: FormValues = {};
      const allFields = [field];

      const result = evaluateFieldDependencies(field, values, allFields);

      expect(result.isVisible).toBe(false);
    });

    it('should handle disabled field', () => {
      const field = createMockField({ disabled: true });
      const values: FormValues = {};
      const allFields = [field];

      const result = evaluateFieldDependencies(field, values, allFields);

      expect(result.isDisabled).toBe(true);
    });

    it('should evaluate simple dependency condition', () => {
      const dependentField = createMockField({
        id: '2',
        path: 'dependent',
        key: 'dependent',
        label: 'Dependent Field',
      });

      const field = createMockField({
        dependencies: [
          {
            field: 'dependent',
            condition: (value) => value === 'show',
            overrides: { hidden: false },
          },
        ],
      });

      const allFields = [field, dependentField];
      const values: FormValues = { dependent: 'show' };

      const result = evaluateFieldDependencies(field, values, allFields);

      expect(result.isVisible).toBe(true);
      expect(result.dependsOn).toEqual(['dependent']);
    });

    it('should apply multiple dependency overrides', () => {
      const dependentField = createMockField({
        id: '2',
        path: 'dependent',
        key: 'dependent',
        label: 'Dependent Field',
      });

      const field = createMockField({
        dependencies: [
          {
            field: 'dependent',
            condition: (value) => value === 'disable',
            overrides: { disabled: true, hidden: false },
          },
        ],
      });

      const allFields = [field, dependentField];
      const values: FormValues = { dependent: 'disable' };

      const result = evaluateFieldDependencies(field, values, allFields);

      expect(result.isVisible).toBe(true);
      expect(result.isDisabled).toBe(true);
      expect(result.overrides).toEqual({ disabled: true, hidden: false });
    });

    it('should warn about missing dependency field', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const field = createMockField({
        dependencies: [
          {
            field: 'nonexistent',
            condition: () => true,
            overrides: {},
          },
        ],
      });

      const allFields = [field];
      const values: FormValues = {};

      evaluateFieldDependencies(field, values, allFields);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Dependency field "nonexistent" not found for field "field1"'
      );

      consoleSpy.mockRestore();
    });

    it('should handle dependency condition errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const dependentField = createMockField({
        id: '2',
        path: 'dependent',
        key: 'dependent',
        label: 'Dependent Field',
      });

      const field = createMockField({
        dependencies: [
          {
            field: 'dependent',
            condition: () => {
              throw new Error('Condition error');
            },
            overrides: {},
          },
        ],
      });

      const allFields = [field, dependentField];
      const values: FormValues = { dependent: 'test' };

      const result = evaluateFieldDependencies(field, values, allFields);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result.isVisible).toBe(true); // Should maintain default state

      consoleSpy.mockRestore();
    });

    it('should handle multiple dependency conditions', () => {
      const triggerField1 = createMockFieldWithId('2', 'trigger1');
      const triggerField2 = createMockFieldWithId('3', 'trigger2');

      const field = createMockField({
        dependencies: [
          {
            field: 'trigger1',
            condition: (value) => value === 'show',
            overrides: { hidden: false },
          },
          {
            field: 'trigger2',
            condition: (value) => value === 'disable',
            overrides: { disabled: true },
          },
        ],
        hidden: true,
        disabled: false,
      });

      const allFields = [field, triggerField1, triggerField2];
      const values: FormValues = { trigger1: 'show', trigger2: 'disable' };

      const result = evaluateFieldDependencies(field, values, allFields);

      expect(result.isVisible).toBe(true); // First dependency makes it visible
      expect(result.isDisabled).toBe(true); // Second dependency disables it
      expect(result.dependsOn).toEqual(['trigger1', 'trigger2']);
    });

    it('should handle complex dependency conditions', () => {
      const triggerField = createMockFieldWithId('2', 'trigger');

      const field = createMockField({
        dependencies: [
          {
            field: 'trigger',
            condition: (value) => {
              if (typeof value === 'string') {
                return value.length > 3 && value.includes('test');
              }
              return false;
            },
            overrides: { hidden: false, label: 'Complex Field' },
          },
        ],
        hidden: true,
        label: 'Original Field',
      });

      const allFields = [field, triggerField];

      // Test condition not met
      let result = evaluateFieldDependencies(field, { trigger: 'abc' }, allFields);
      expect(result.isVisible).toBe(false);
      expect(result.overrides.label).toBeUndefined();

      // Test condition met
      result = evaluateFieldDependencies(field, { trigger: 'test123' }, allFields);
      expect(result.isVisible).toBe(true);
      expect(result.overrides.label).toBe('Complex Field');
    });

    it('should handle dependency on array values', () => {
      const arrayField = createMockFieldWithId('2', 'arrayField');

      const field = createMockField({
        dependencies: [
          {
            field: 'arrayField',
            condition: (value) => Array.isArray(value) && value.length > 0,
            overrides: { hidden: false },
          },
        ],
        hidden: true,
      });

      const allFields = [field, arrayField];

      // Test with empty array
      let result = evaluateFieldDependencies(field, { arrayField: [] }, allFields);
      expect(result.isVisible).toBe(false);

      // Test with non-empty array
      result = evaluateFieldDependencies(field, { arrayField: ['item1'] }, allFields);
      expect(result.isVisible).toBe(true);

      // Test with non-array value
      result = evaluateFieldDependencies(field, { arrayField: 'not array' }, allFields);
      expect(result.isVisible).toBe(false);
    });

    it('should handle dependency on object values', () => {
      const objectField = createMockFieldWithId('2', 'objectField');

      const field = createMockField({
        dependencies: [
          {
            field: 'objectField',
            condition: (value) => {
              return typeof value === 'object' && value !== null && 'enabled' in value && value.enabled === true;
            },
            overrides: { disabled: false },
          },
        ],
        disabled: true,
      });

      const allFields = [field, objectField];

      // Test with object that meets condition
      let result = evaluateFieldDependencies(field, { objectField: { enabled: true } }, allFields);
      expect(result.isDisabled).toBe(false);

      // Test with object that doesn't meet condition
      result = evaluateFieldDependencies(field, { objectField: { enabled: false } }, allFields);
      expect(result.isDisabled).toBe(true);

      // Test with null
      result = evaluateFieldDependencies(field, { objectField: null as unknown as FormValue }, allFields);
      expect(result.isDisabled).toBe(true);
    });
  });

  describe('evaluateAllDependencies', () => {
    it('should evaluate dependencies for all fields', () => {
      const field1 = createMockField();
      const field2 = createMockField({
        id: '2',
        path: 'field2',
        key: 'field2',
        label: 'Field 2',
        dependencies: [
          {
            field: 'field1',
            condition: (value) => value === 'show',
            overrides: { hidden: false },
          },
        ],
      });

      const fields = [field1, field2];
      const values: FormValues = { field1: 'show', field2: '' };

      const result = evaluateAllDependencies(fields, values);

      expect(result.size).toBe(2);
      expect(result.get('field1')?.isVisible).toBe(true);
      expect(result.get('field2')?.isVisible).toBe(true);
    });
  });

  describe('isFieldVisible', () => {
    it('should return visibility state for field', () => {
      const field = createMockField({ hidden: true });
      const values: FormValues = {};
      const allFields = [field];

      expect(isFieldVisible(field, values, allFields)).toBe(false);
    });
  });

  describe('isFieldDisabled', () => {
    it('should return disabled state for field', () => {
      const field = createMockField({ disabled: true });
      const values: FormValues = {};
      const allFields = [field];

      expect(isFieldDisabled(field, values, allFields)).toBe(true);
    });
  });

  describe('getEffectiveFieldProps', () => {
    it('should return field with dependency overrides applied', () => {
      const dependentField = createMockField({
        id: '2',
        path: 'dependent',
        key: 'dependent',
        label: 'Dependent Field',
      });

      const field = createMockField({
        dependencies: [
          {
            field: 'dependent',
            condition: (value) => value === 'modify',
            overrides: {
              disabled: true,
              defaultValue: 'new default',
              label: 'Modified Label'
            },
          },
        ],
      });

      const allFields = [field, dependentField];
      const values: FormValues = { dependent: 'modify' };

      const result = getEffectiveFieldProps(field, values, allFields);

      expect(result.disabled).toBe(true);
      expect(result.defaultValue).toBe('new default');
      expect(result.label).toBe('Modified Label');
    });
  });

  describe('buildDependencyGraph', () => {
    it('should build dependency graph correctly', () => {
      const field1 = createMockField();
      const field2 = createMockField({
        id: '2',
        path: 'field2',
        key: 'field2',
        dependencies: [
          {
            field: 'field1',
            condition: () => true,
            overrides: {},
          },
        ],
      });

      const fields = [field1, field2];
      const graph = buildDependencyGraph(fields);

      expect(graph.get('field1')).toEqual(['field2']);
      expect(graph.get('field2')).toEqual([]);
    });
  });

  describe('getDependentFields', () => {
    it('should return fields that depend on target field', () => {
      const field1 = createMockField();
      const field2 = createMockField({
        id: '2',
        path: 'field2',
        key: 'field2',
        dependencies: [
          {
            field: 'field1',
            condition: () => true,
            overrides: {},
          },
        ],
      });

      const fields = [field1, field2];
      const dependents = getDependentFields('field1', fields);

      expect(dependents).toEqual([field2]);
    });

    it('should return empty array for non-existent field', () => {
      const fields = [createMockField()];
      const dependents = getDependentFields('nonexistent', fields);

      expect(dependents).toEqual([]);
    });
  });

  describe('detectCircularDependencies', () => {
    it('should detect circular dependencies', () => {
      const field1 = createMockField({
        dependencies: [
          {
            field: 'field2',
            condition: () => true,
            overrides: {},
          },
        ],
      });

      const field2 = createMockField({
        id: '2',
        path: 'field2',
        key: 'field2',
        dependencies: [
          {
            field: 'field1',
            condition: () => true,
            overrides: {},
          },
        ],
      });

      const fields = [field1, field2];
      const circular = detectCircularDependencies(fields);

      expect(circular).toContain('field1');
      expect(circular).toContain('field2');
    });

    it('should return empty array for no circular dependencies', () => {
      const field1 = createMockField();
      const field2 = createMockField({
        id: '2',
        path: 'field2',
        key: 'field2',
        dependencies: [
          {
            field: 'field1',
            condition: () => true,
            overrides: {},
          },
        ],
      });

      const fields = [field1, field2];
      const circular = detectCircularDependencies(fields);

      expect(circular).toEqual([]);
    });
  });

  describe('createDependencyResolver', () => {
    it('should create a dependency resolver function', () => {
      const fields = [createMockField()];
      const resolver = createDependencyResolver(fields);
      const values: FormValues = {};

      const result = resolver(values);

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(1);
    });
  });

  describe('createFieldStateQueries', () => {
    it('should create field state query functions', () => {
      const field = createMockField({ disabled: true });
      const fields = [field];
      const queries = createFieldStateQueries(fields);
      const values: FormValues = {};

      expect(queries.getFieldVisibility('field1', values)).toBe(true);
      expect(queries.getFieldDisabled('field1', values)).toBe(true);
      expect(queries.getEffectiveField('field1', values)).toEqual(
        expect.objectContaining({ disabled: true })
      );
    });

    it('should handle non-existent fields', () => {
      const fields = [createMockField()];
      const queries = createFieldStateQueries(fields);
      const values: FormValues = {};

      expect(queries.getFieldVisibility('nonexistent', values)).toBe(false);
      expect(queries.getFieldDisabled('nonexistent', values)).toBe(false);
      expect(queries.getEffectiveField('nonexistent', values)).toBe(null);
    });
  });
});