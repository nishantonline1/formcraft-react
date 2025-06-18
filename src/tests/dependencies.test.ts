import { 
  evaluateFieldDependencies, 
  evaluateAllDependencies, 
  isFieldVisible, 
  isFieldDisabled, 
  getEffectiveFieldProps 
} from '../utils/dependencies';
import { ConfigField, FormValues } from '../types';

describe('Dependency Resolution System', () => {
  const mockFields: ConfigField[] = [
    {
      id: 'field1',
      path: 'field1',
      key: 'field1',
      type: 'text',
      label: 'Field 1',
    },
    {
      id: 'field2',
      path: 'field2',
      key: 'field2',
      type: 'text',
      label: 'Field 2',
      dependencies: [
        {
          field: 'field1',
          condition: (value) => value === 'show',
          overrides: { hidden: false }
        }
      ],
      hidden: true, // Hidden by default
    },
    {
      id: 'field3',
      path: 'field3',
      key: 'field3',
      type: 'text',
      label: 'Field 3',
      dependencies: [
        {
          field: 'field1',
          condition: (value) => value === 'disable',
          overrides: { disabled: true }
        }
      ],
    },
    {
      id: 'field4',
      path: 'field4',
      key: 'field4',
      type: 'text',
      label: 'Field 4',
      dependencies: [
        {
          field: 'field1',
          condition: (value) => value === 'required',
          overrides: { validators: { required: true } }
        }
      ],
    },
  ];

  describe('evaluateFieldDependencies', () => {
    it('should return default state for field without dependencies', () => {
      const values: FormValues = { field1: 'test' };
      const result = evaluateFieldDependencies(mockFields[0], values, mockFields);

      expect(result.isVisible).toBe(true);
      expect(result.isDisabled).toBe(false);
      expect(result.overrides).toEqual({});
    });

    it('should handle visibility dependencies', () => {
      const values: FormValues = { field1: 'show', field2: '' };
      const result = evaluateFieldDependencies(mockFields[1], values, mockFields);

      expect(result.isVisible).toBe(true);
      expect(result.field.path).toBe('field2');
    });

    it('should handle disabled dependencies', () => {
      const values: FormValues = { field1: 'disable', field3: '' };
      const result = evaluateFieldDependencies(mockFields[2], values, mockFields);

      expect(result.isDisabled).toBe(true);
      expect(result.field.path).toBe('field3');
    });

    it('should handle validator overrides', () => {
      const values: FormValues = { field1: 'required', field4: '' };
      const result = evaluateFieldDependencies(mockFields[3], values, mockFields);

      expect(result.overrides.validators?.required).toBe(true);
    });

    it('should handle missing dependent field gracefully', () => {
      const fieldWithBadDep: ConfigField = {
        id: 'badField',
        path: 'badField',
        key: 'badField',
        type: 'text',
        label: 'Bad Field',
        dependencies: [
          {
            field: 'nonexistent',
            condition: () => true,
            overrides: { hidden: true }
          }
        ],
      };
      
      const values: FormValues = {};
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = evaluateFieldDependencies(fieldWithBadDep, values, [fieldWithBadDep]);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Dependency field "nonexistent" not found for field "badField"'
      );
      expect(result.isVisible).toBe(true);
      
      consoleSpy.mockRestore();
    });

    it('should handle condition evaluation errors gracefully', () => {
      const fieldWithBadCondition: ConfigField = {
        id: 'badCondition',
        path: 'badCondition',
        key: 'badCondition',
        type: 'text',
        label: 'Bad Condition Field',
        dependencies: [
          {
            field: 'field1',
            condition: () => { throw new Error('Bad condition'); },
            overrides: { hidden: true }
          }
        ],
      };
      
      const values: FormValues = { field1: 'test' };
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = evaluateFieldDependencies(fieldWithBadCondition, values, [...mockFields, fieldWithBadCondition]);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error evaluating dependency condition for field "badCondition":',
        expect.any(Error)
      );
      expect(result.isVisible).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });

  describe('evaluateAllDependencies', () => {
    it('should evaluate dependencies for all fields', () => {
      const values: FormValues = { 
        field1: 'show', 
        field2: '', 
        field3: '', 
        field4: '' 
      };
      
      const result = evaluateAllDependencies(mockFields, values);
      
      expect(result.size).toBe(4);
      expect(result.get('field1')?.isVisible).toBe(true);
      expect(result.get('field2')?.isVisible).toBe(true); // Should be visible due to dependency
      expect(result.get('field3')?.isDisabled).toBe(false);
      expect(result.get('field4')?.overrides).toEqual({});
    });

    it('should handle multiple dependency conditions', () => {
      const values: FormValues = { 
        field1: 'disable', 
        field2: '', 
        field3: '', 
        field4: '' 
      };
      
      const result = evaluateAllDependencies(mockFields, values);
      
      expect(result.get('field2')?.isVisible).toBe(false); // Hidden by default, condition not met
      expect(result.get('field3')?.isDisabled).toBe(true); // Disabled by dependency
    });
  });

  describe('isFieldVisible', () => {
    it('should return correct visibility based on dependencies', () => {
      const values: FormValues = { field1: 'show' };
      
      expect(isFieldVisible(mockFields[0], values, mockFields)).toBe(true);
      expect(isFieldVisible(mockFields[1], values, mockFields)).toBe(true);
    });

    it('should return false when field is hidden by default and condition not met', () => {
      const values: FormValues = { field1: 'hide' };
      
      expect(isFieldVisible(mockFields[1], values, mockFields)).toBe(false);
    });
  });

  describe('isFieldDisabled', () => {
    it('should return correct disabled state based on dependencies', () => {
      const values: FormValues = { field1: 'disable' };
      
      expect(isFieldDisabled(mockFields[2], values, mockFields)).toBe(true);
      expect(isFieldDisabled(mockFields[0], values, mockFields)).toBe(false);
    });
  });

  describe('getEffectiveFieldProps', () => {
    it('should return field with applied overrides', () => {
      const values: FormValues = { field1: 'required' };
      
      const effectiveField = getEffectiveFieldProps(mockFields[3], values, mockFields);
      
      expect(effectiveField.validators?.required).toBe(true);
      expect(effectiveField.hidden).toBe(false);
      expect(effectiveField.disabled).toBe(false);
    });

    it('should handle visibility and disabled state', () => {
      const values: FormValues = { field1: 'show' };
      
      const effectiveField = getEffectiveFieldProps(mockFields[1], values, mockFields);
      
      expect(effectiveField.hidden).toBe(false); // Should be visible
      expect(effectiveField.disabled).toBe(false);
    });
  });

  describe('Circular dependency detection', () => {
    it('should handle circular dependencies gracefully', () => {
      const circularFields: ConfigField[] = [
        {
          id: 'a',
          path: 'a',
          key: 'a',
          type: 'text',
          label: 'A',
          dependencies: [
            {
              field: 'b',
              condition: (value) => value === 'show',
              overrides: { hidden: false }
            }
          ],
        },
        {
          id: 'b',
          path: 'b',
          key: 'b',
          type: 'text',
          label: 'B',
          dependencies: [
            {
              field: 'a',
              condition: (value) => value === 'show',
              overrides: { hidden: false }
            }
          ],
        },
      ];

      const values: FormValues = { a: 'show', b: 'show' };
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = evaluateAllDependencies(circularFields, values);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Circular dependency detected')
      );
      expect(result.size).toBe(2);
      
      consoleSpy.mockRestore();
    });
  });
}); 