import React from 'react';
import { 
  FormPlugin, 
  registerPlugin, 
  unregisterPlugin, 
  getRegisteredPlugins,
  clearPlugins,
  applyConfigExtensions,
  runPluginValidation,
  getPluginRenderer,
  emailValidationPlugin,
  phoneValidationPlugin,
  debugPlugin,
} from './index';
import { FormModel } from '../model';
import { ConfigField, FormConfig } from '../types';
import { UseFormReturn } from '../hooks/useForm';

// Mock UseFormReturn for testing
const mockFormReturn: UseFormReturn = {
  config: {
    fields: [],
    lookup: {},
  },
  values: { email: 'test@example.com', phone: '123-456-7890' },
  errors: {},
  touched: {},
  dependencies: new Map(),
  dynamicOptions: new Map(),
  isFieldVisible: jest.fn().mockReturnValue(true),
  isFieldDisabled: jest.fn().mockReturnValue(false),
  getEffectiveField: jest.fn(),
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  handleFocus: jest.fn(),
  addArrayItem: jest.fn(),
  removeArrayItem: jest.fn(),
  handleSubmit: jest.fn(),
  triggerValidation: jest.fn().mockResolvedValue(true),
};

describe('Plugin System', () => {
  beforeEach(() => {
    clearPlugins();
  });

  describe('Plugin Registration', () => {
    it('should register and retrieve plugins', () => {
      const testPlugin: FormPlugin = {
        name: 'test-plugin',
        onValidate: () => [],
      };

      registerPlugin(testPlugin);
      const plugins = getRegisteredPlugins();
      
      expect(plugins).toHaveLength(1);
      expect(plugins[0].name).toBe('test-plugin');
    });

    it('should replace existing plugin with same name', () => {
      const plugin1: FormPlugin = {
        name: 'test-plugin',
        onValidate: () => ['error1'],
      };

      const plugin2: FormPlugin = {
        name: 'test-plugin',
        onValidate: () => ['error2'],
      };

      registerPlugin(plugin1);
      registerPlugin(plugin2);
      
      const plugins = getRegisteredPlugins();
      expect(plugins).toHaveLength(1);
      
      // Test that the second plugin replaced the first
      const mockField: ConfigField = {
        id: '1',
        path: 'test',
        key: 'test',
        type: 'text',
        label: 'Test',
      };
      
      const errors = runPluginValidation(mockField, 'test');
      expect(errors).toEqual(['error2']);
    });

    it('should unregister plugins by name', () => {
      const testPlugin: FormPlugin = {
        name: 'test-plugin',
        onValidate: () => [],
      };

      registerPlugin(testPlugin);
      expect(getRegisteredPlugins()).toHaveLength(1);

      unregisterPlugin('test-plugin');
      expect(getRegisteredPlugins()).toHaveLength(0);
    });

    it('should clear all plugins', () => {
      registerPlugin({ name: 'plugin1', onValidate: () => [] });
      registerPlugin({ name: 'plugin2', onValidate: () => [] });
      
      expect(getRegisteredPlugins()).toHaveLength(2);
      
      clearPlugins();
      expect(getRegisteredPlugins()).toHaveLength(0);
    });
  });

  describe('Config Extensions', () => {
    it('should apply config extensions from plugins', () => {
      const extenderPlugin: FormPlugin = {
        name: 'config-extender',
        extendConfig: (model, config) => ({
          ...config,
          fields: config.fields.map(field => ({
            ...field,
            meta: { ...field.meta, extended: true },
          })),
        }),
      };

      registerPlugin(extenderPlugin);

      const model: FormModel = [
        { key: 'test', type: 'text', label: 'Test' },
      ];

      const baseConfig: FormConfig = {
        fields: [
          { id: '1', path: 'test', key: 'test', type: 'text', label: 'Test' },
        ],
        lookup: {},
      };

      const extendedConfig = applyConfigExtensions(model, baseConfig);
      
      expect(extendedConfig.fields[0].meta?.extended).toBe(true);
    });

    it('should handle plugin errors gracefully during config extension', () => {
      const faultyPlugin: FormPlugin = {
        name: 'faulty-plugin',
        extendConfig: () => {
          throw new Error('Plugin error');
        },
      };

      registerPlugin(faultyPlugin);

      const model: FormModel = [
        { key: 'test', type: 'text', label: 'Test' },
      ];

      const baseConfig: FormConfig = {
        fields: [
          { id: '1', path: 'test', key: 'test', type: 'text', label: 'Test' },
        ],
        lookup: {},
      };

      // Should not throw, should return original config
      const result = applyConfigExtensions(model, baseConfig);
      expect(result).toEqual(baseConfig);
    });
  });

  describe('Plugin Validation', () => {
    it('should run validation from multiple plugins', () => {
      const plugin1: FormPlugin = {
        name: 'validator1',
        onValidate: () => ['error1'],
      };

      const plugin2: FormPlugin = {
        name: 'validator2',
        onValidate: () => ['error2', 'error3'],
      };

      registerPlugin(plugin1);
      registerPlugin(plugin2);

      const mockField: ConfigField = {
        id: '1',
        path: 'test',
        key: 'test',
        type: 'text',
        label: 'Test',
      };

      const errors = runPluginValidation(mockField, 'test');
      expect(errors).toEqual(['error1', 'error2', 'error3']);
    });

    it('should handle plugin validation errors gracefully', () => {
      const faultyPlugin: FormPlugin = {
        name: 'faulty-validator',
        onValidate: () => {
          throw new Error('Validation error');
        },
      };

      registerPlugin(faultyPlugin);

      const mockField: ConfigField = {
        id: '1',
        path: 'test',
        key: 'test',
        type: 'text',
        label: 'Test',
      };

      // Should not throw, should return empty array
      const errors = runPluginValidation(mockField, 'test');
      expect(errors).toEqual([]);
    });
  });

  describe('Plugin Rendering', () => {
    it('should return renderer from first matching plugin', () => {
      const renderer1: FormPlugin = {
        name: 'renderer1',
        renderField: () => React.createElement('div', { key: 'renderer1' }, 'Renderer 1'),
      };

      const renderer2: FormPlugin = {
        name: 'renderer2',
        renderField: () => React.createElement('div', { key: 'renderer2' }, 'Renderer 2'),
      };

      registerPlugin(renderer1);
      registerPlugin(renderer2);

      const mockField: ConfigField = {
        id: '1',
        path: 'test',
        key: 'test',
        type: 'text',
        label: 'Test',
      };

      const element = getPluginRenderer(mockField, mockFormReturn);
      expect(element?.key).toBe('renderer1');
    });

    it('should return null if no plugins provide renderer', () => {
      const nonRenderer: FormPlugin = {
        name: 'non-renderer',
        onValidate: () => [],
      };

      registerPlugin(nonRenderer);

      const mockField: ConfigField = {
        id: '1',
        path: 'test',
        key: 'test',
        type: 'text',
        label: 'Test',
      };

      const element = getPluginRenderer(mockField, mockFormReturn);
      expect(element).toBeNull();
    });

    it('should handle plugin rendering errors gracefully', () => {
      const faultyRenderer: FormPlugin = {
        name: 'faulty-renderer',
        renderField: () => {
          throw new Error('Render error');
        },
      };

      registerPlugin(faultyRenderer);

      const mockField: ConfigField = {
        id: '1',
        path: 'test',
        key: 'test',
        type: 'text',
        label: 'Test',
      };

      // Should not throw, should return null
      const element = getPluginRenderer(mockField, mockFormReturn);
      expect(element).toBeNull();
    });
  });

  describe('Built-in Plugins', () => {
    describe('Email Validation Plugin', () => {
      beforeEach(() => {
        registerPlugin(emailValidationPlugin);
      });

      it('should validate email fields', () => {
        const emailField: ConfigField = {
          id: '1',
          path: 'email',
          key: 'email',
          type: 'text',
          label: 'Email',
          meta: { validation: 'email' },
        };

        const validEmail = runPluginValidation(emailField, 'test@example.com');
        expect(validEmail).toEqual([]);

        const invalidEmail = runPluginValidation(emailField, 'invalid-email');
        expect(invalidEmail).toEqual(['Email must be a valid email address.']);
      });

      it('should skip validation for non-email fields', () => {
        const textField: ConfigField = {
          id: '1',
          path: 'name',
          key: 'name',
          type: 'text',
          label: 'Name',
        };

        const errors = runPluginValidation(textField, 'invalid-email');
        expect(errors).toEqual([]);
      });
    });

    describe('Phone Validation Plugin', () => {
      beforeEach(() => {
        registerPlugin(phoneValidationPlugin);
      });

      it('should validate phone fields', () => {
        const phoneField: ConfigField = {
          id: '1',
          path: 'phone',
          key: 'phone',
          type: 'text',
          label: 'Phone',
          meta: { validation: 'phone' },
        };

        const validPhone = runPluginValidation(phoneField, '123-456-7890');
        expect(validPhone).toEqual([]);

        const invalidPhone = runPluginValidation(phoneField, '123');
        expect(invalidPhone).toEqual(['Phone must be a valid phone number (e.g., 123-456-7890).']);
      });
    });

    describe('Debug Plugin', () => {
      beforeEach(() => {
        registerPlugin(debugPlugin);
      });

      it('should render debug info for debug fields', () => {
        const debugField: ConfigField = {
          id: '1',
          path: 'test',
          key: 'test',
          type: 'text',
          label: 'Test',
          meta: { debug: true },
        };

        const element = getPluginRenderer(debugField, mockFormReturn);
        expect(element).not.toBeNull();
        expect(element?.key).toBe('debug-1');
      });

      it('should not render for non-debug fields', () => {
        const normalField: ConfigField = {
          id: '1',
          path: 'test',
          key: 'test',
          type: 'text',
          label: 'Test',
        };

        const element = getPluginRenderer(normalField, mockFormReturn);
        expect(element).toBeNull();
      });
    });
  });
}); 