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
        dependencies: {
          fields: ['dependent'],
          condition: (watchedValues) => watchedValues.dependent === 'show',
          overrides: { hidden: false },
        },
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
        dependencies: {
          fields: ['dependent'],
          condition: (watchedValues) => watchedValues.dependent === 'disable',
          overrides: { disabled: true, hidden: false },
        },
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
        dependencies: {
          fields: ['nonexistent'],
          condition: () => true,
          overrides: {},
        },
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
        dependencies: {
          fields: ['dependent'],
          condition: () => {
            throw new Error('Condition error');
          },
          overrides: {},
        },
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
        dependencies: {
          fields: ['trigger1', 'trigger2'],
          condition: (watchedValues) => {
            const showCondition = watchedValues.trigger1 === 'show';
            const disableCondition = watchedValues.trigger2 === 'disable';
            return showCondition || disableCondition;
          },
          overrides: { hidden: false, disabled: true },
        },
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
        dependencies: {
          fields: ['trigger'],
          condition: (watchedValues) => {
            if (typeof watchedValues.trigger === 'string') {
              return watchedValues.trigger.length > 3 && watchedValues.trigger.includes('test');
            }
            return false;
          },
          overrides: { hidden: false, label: 'Complex Field' },
        },
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
        dependencies: {
          fields: ['arrayField'],
          condition: (watchedValues) => Array.isArray(watchedValues.arrayField) && watchedValues.arrayField.length > 0,
          overrides: { hidden: false },
        },
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
        dependencies: {
          fields: ['objectField'],
          condition: (watchedValues) => {
            return typeof watchedValues.objectField === 'object' && watchedValues.objectField !== null && 'enabled' in watchedValues.objectField && watchedValues.objectField.enabled === true;
          },
          overrides: { disabled: false },
        },
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
        dependencies: {
          fields: ['field1'],
          condition: (watchedValues) => watchedValues.field1 === 'show',
          overrides: { hidden: false },
        },
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
        dependencies: {
          fields: ['dependent'],
          condition: (watchedValues) => watchedValues.dependent === 'modify',
          overrides: {
            disabled: true,
            defaultValue: 'new default',
            label: 'Modified Label'
          },
        },
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
        dependencies: {
          fields: ['field1'],
          condition: () => true,
          overrides: {},
        },
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
        dependencies: {
          fields: ['field1'],
          condition: () => true,
          overrides: {},
        },
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
        dependencies: {
          fields: ['field2'],
          condition: () => true,
          overrides: {},
        },
      });

      const field2 = createMockField({
        id: '2',
        path: 'field2',
        key: 'field2',
        dependencies: {
          fields: ['field1'],
          condition: () => true,
          overrides: {},
        },
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
        dependencies: {
          fields: ['field1'],
          condition: () => true,
          overrides: {},
        },
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

  describe('Multi-Field Dependencies', () => {
    describe('evaluateFieldDependencies with multi-field dependencies', () => {
      it('should handle multi-field AND logic', () => {
        const field = createMockField({
          key: 'result',
          path: 'result',
          dependencies: {
            fields: ['fieldA', 'fieldB', 'fieldC'],
            condition: (watchedValues) => {
              return Object.values(watchedValues).every(value => value === true);
            },
            overrides: { hidden: false }
          },
          hidden: true
        });

        const allFields = [
          field,
          createMockFieldWithId('2', 'fieldA'),
          createMockFieldWithId('3', 'fieldB'),
          createMockFieldWithId('4', 'fieldC')
        ];

        // All fields true - should show
        let values: FormValues = { fieldA: true, fieldB: true, fieldC: true };
        let result = evaluateFieldDependencies(field, values, allFields);
        expect(result.isVisible).toBe(true);
        expect(result.dependsOn).toEqual(['fieldA', 'fieldB', 'fieldC']);

        // One field false - should hide
        values = { fieldA: true, fieldB: false, fieldC: true };
        result = evaluateFieldDependencies(field, values, allFields);
        expect(result.isVisible).toBe(false);
      });

      it('should handle multi-field OR logic', () => {
        const field = createMockField({
          key: 'result',
          path: 'result',
          dependencies: {
            fields: ['fieldA', 'fieldB', 'fieldC'],
            condition: (watchedValues) => {
              return Object.values(watchedValues).some(value => value === true);
            },
            overrides: { hidden: false }
          },
          hidden: true
        });

        const allFields = [
          field,
          createMockFieldWithId('2', 'fieldA'),
          createMockFieldWithId('3', 'fieldB'),
          createMockFieldWithId('4', 'fieldC')
        ];

        // One field true - should show
        let values: FormValues = { fieldA: false, fieldB: true, fieldC: false };
        let result = evaluateFieldDependencies(field, values, allFields);
        expect(result.isVisible).toBe(true);

        // All fields false - should hide
        values = { fieldA: false, fieldB: false, fieldC: false };
        result = evaluateFieldDependencies(field, values, allFields);
        expect(result.isVisible).toBe(false);
      });

      it('should handle complex multi-field conditions', () => {
        const field = createMockField({
          key: 'result',
          path: 'result',
          dependencies: {
            fields: ['userRole', 'subscription', 'betaProgram'],
            condition: (watchedValues, _formValues) => {
              const isAdmin = watchedValues.userRole === 'admin';
              const hasPremium = watchedValues.subscription === 'premium';
              const isBeta = watchedValues.betaProgram === true;
              
              return isAdmin && (hasPremium || isBeta);
            },
            overrides: { hidden: false, label: 'Admin Feature' }
          },
          hidden: true
        });

        const allFields = [
          field,
          createMockFieldWithId('2', 'userRole'),
          createMockFieldWithId('3', 'subscription'),
          createMockFieldWithId('4', 'betaProgram')
        ];

        // Admin with premium - should show
        let values: FormValues = { 
          userRole: 'admin', 
          subscription: 'premium', 
          betaProgram: false 
        };
        let result = evaluateFieldDependencies(field, values, allFields);
        expect(result.isVisible).toBe(true);
        expect(result.overrides.label).toBe('Admin Feature');

        // Admin with beta - should show
        values = { 
          userRole: 'admin', 
          subscription: 'basic', 
          betaProgram: true 
        };
        result = evaluateFieldDependencies(field, values, allFields);
        expect(result.isVisible).toBe(true);

        // Non-admin - should hide
        values = { 
          userRole: 'user', 
          subscription: 'premium', 
          betaProgram: true 
        };
        result = evaluateFieldDependencies(field, values, allFields);
        expect(result.isVisible).toBe(false);
      });

      it('should handle mixed single and multi-field dependencies', () => {
        const field = createMockField({
          key: 'result',
          path: 'result',
          dependencies: {
            fields: ['singleField', 'fieldA', 'fieldB'],
            condition: (watchedValues) => {
              const showCondition = watchedValues.singleField === 'show';
              const disableCondition = watchedValues.fieldA === true && watchedValues.fieldB === true;
              return showCondition || disableCondition;
            },
            overrides: { hidden: false, disabled: false }
          },
          hidden: true,
          disabled: true
        });

        const allFields = [
          field,
          createMockFieldWithId('2', 'singleField'),
          createMockFieldWithId('3', 'fieldA'),
          createMockFieldWithId('4', 'fieldB')
        ];

        // Both conditions met
        let values: FormValues = { 
          singleField: 'show', 
          fieldA: true, 
          fieldB: true 
        };
        let result = evaluateFieldDependencies(field, values, allFields);
        expect(result.isVisible).toBe(true);
        expect(result.isDisabled).toBe(false);
        expect(result.dependsOn).toEqual(['singleField', 'fieldA', 'fieldB']);

        // Only single field condition met
        values = { 
          singleField: 'show', 
          fieldA: false, 
          fieldB: true 
        };
        result = evaluateFieldDependencies(field, values, allFields);
        expect(result.isVisible).toBe(true);
        expect(result.isDisabled).toBe(false); // With single dependency, all overrides are applied when condition is met
      });

      it('should handle missing fields in multi-field dependencies gracefully', () => {
        const field = createMockField({
          key: 'result',
          path: 'result',
          dependencies: {
            fields: ['existingField', 'missingField'],
            condition: (watchedValues) => {
              return watchedValues.existingField === true;
            },
            overrides: { hidden: false }
          },
          hidden: true
        });

        const allFields = [
          field,
          createMockFieldWithId('2', 'existingField')
        ];

        const values: FormValues = { existingField: true };
        const result = evaluateFieldDependencies(field, values, allFields);
        
        // Should not apply overrides because missing field prevents condition evaluation
        expect(result.isVisible).toBe(false);
      });

      it('should handle errors in multi-field condition functions', () => {
        const field = createMockField({
          key: 'result',
          path: 'result',
          dependencies: {
            fields: ['fieldA', 'fieldB'],
            condition: () => {
              throw new Error('Condition error');
            },
            overrides: { hidden: false }
          },
          hidden: true
        });

        const allFields = [
          field,
          createMockFieldWithId('2', 'fieldA'),
          createMockFieldWithId('3', 'fieldB')
        ];

        const values: FormValues = { fieldA: true, fieldB: true };
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        const result = evaluateFieldDependencies(field, values, allFields);
        
        expect(result.isVisible).toBe(false); // Should remain hidden due to error
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Error evaluating dependency condition'),
          expect.any(Error)
        );
        
        consoleSpy.mockRestore();
      });
    });

    describe('buildDependencyGraph with multi-field dependencies', () => {
      it('should build correct graph for multi-field dependencies', () => {
        const field1 = createMockFieldWithId('1', 'field1');
        const field2 = createMockFieldWithId('2', 'field2');
        const field3 = createMockFieldWithId('3', 'field3');
        const dependentField = createMockFieldWithId('4', 'dependent', {
          dependencies: {
            fields: ['field1', 'field2', 'field3'],
            condition: () => true,
            overrides: {}
          }
        });

        const fields = [field1, field2, field3, dependentField];
        const graph = buildDependencyGraph(fields);

        expect(graph.get('field1')).toContain('dependent');
        expect(graph.get('field2')).toContain('dependent');
        expect(graph.get('field3')).toContain('dependent');
        expect(graph.get('dependent')).toEqual([]);
      });

      it('should handle mixed single and multi-field dependencies in graph', () => {
        const field1 = createMockFieldWithId('1', 'field1');
        const field2 = createMockFieldWithId('2', 'field2');
        const field3 = createMockFieldWithId('3', 'field3');
        const dependentField = createMockFieldWithId('4', 'dependent', {
          dependencies: {
            fields: ['field1', 'field2', 'field3'],
            condition: () => true,
            overrides: {}
          }
        });

        const fields = [field1, field2, field3, dependentField];
        const graph = buildDependencyGraph(fields);

        expect(graph.get('field1')).toContain('dependent');
        expect(graph.get('field2')).toContain('dependent');
        expect(graph.get('field3')).toContain('dependent');
      });
    });

    describe('getDependentFields with multi-field dependencies', () => {
      it('should find dependent fields for multi-field dependencies', () => {
        const field1 = createMockFieldWithId('1', 'field1');
        const field2 = createMockFieldWithId('2', 'field2');
        const dependentField = createMockFieldWithId('3', 'dependent', {
          dependencies: {
            fields: ['field1', 'field2'],
            condition: () => true,
            overrides: {}
          }
        });

        const fields = [field1, field2, dependentField];
        
        const dependents1 = getDependentFields('field1', fields);
        const dependents2 = getDependentFields('field2', fields);
        
        expect(dependents1).toContain(dependentField);
        expect(dependents2).toContain(dependentField);
      });
    });

    describe('detectCircularDependencies with multi-field dependencies', () => {
      it('should detect circular dependencies involving multi-field dependencies', () => {
        const field1 = createMockFieldWithId('1', 'field1', {
          dependencies: {
            fields: ['field2', 'field3'],
            condition: () => true,
            overrides: {}
          }
        });
        const field2 = createMockFieldWithId('2', 'field2', {
          dependencies: {
            fields: ['field1'],
            condition: () => true,
            overrides: {}
          }
        });
        const field3 = createMockFieldWithId('3', 'field3');

        const fields = [field1, field2, field3];
        const circular = detectCircularDependencies(fields);
        
        expect(circular).toContain('field1');
        expect(circular).toContain('field2');
      });
    });

    describe('Backward Compatibility', () => {
      it('should maintain backward compatibility with legacy single-field dependencies using old condition signature', () => {
        const field = createMockField({
          key: 'result',
          path: 'result',
          dependencies: {
            fields: ['trigger'],
            condition: (watchedValues) => {
              // New condition function signature: condition(watchedValues) -> boolean
              return watchedValues.trigger === 'show';
            },
            overrides: { hidden: false }
          },
          hidden: true
        });

        const allFields = [
          field,
          createMockFieldWithId('2', 'trigger')
        ];

        const values: FormValues = { trigger: 'show' };
        const result = evaluateFieldDependencies(field, values, allFields);
        
        expect(result.isVisible).toBe(true);
        expect(result.dependsOn).toEqual(['trigger']);
      });

      it('should support new condition signature for single-field dependencies', () => {
        const field = createMockField({
          key: 'result',
          path: 'result',
          dependencies: {
            fields: ['trigger'],
            condition: (watchedValues) => {
              // New condition function signature: condition(watchedValues) -> boolean
              return watchedValues.trigger === 'show';
            },
            overrides: { hidden: false }
          },
          hidden: true
        });

        const allFields = [
          field,
          createMockFieldWithId('2', 'trigger')
        ];

        const values: FormValues = { trigger: 'show' };
        const result = evaluateFieldDependencies(field, values, allFields);
        
        expect(result.isVisible).toBe(true);
        expect(result.dependsOn).toEqual(['trigger']);
      });

      it('should handle invalid dependency configurations gracefully', () => {
        const field = createMockField({
          key: 'result',
          path: 'result',
          dependencies: {
            // Neither field nor fields specified
            fields: [], // Empty fields array to test invalid config
            condition: () => true,
            overrides: { hidden: false }
          },
          hidden: true
        });

        const allFields = [field];
        const values: FormValues = {};
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        
        const result = evaluateFieldDependencies(field, values, allFields);
        
        expect(result.isVisible).toBe(false); // Should remain hidden
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid dependency configuration')
        );
        
        consoleSpy.mockRestore();
      });
    });
  });
});