import { buildFormConfig } from './buildFormConfig';
import { FormModel } from '../model';
import { registerPlugin, clearPlugins, FormPlugin } from '../plugins';

describe('buildFormConfig', () => {
  beforeEach(() => {
    clearPlugins();
  });

  it('flattens model and respects flags', () => {
    const model: FormModel = [
      { key:'a', type:'text', label:'A' },
      {
        key:'b', type:'text', label:'B', flags:{beta:false}
      }
    ];
    const config = buildFormConfig(model, { beta:false });
    expect(config.fields.map(f => f.key)).toEqual(['a']);
    expect(config.lookup['a'].label).toBe('A');
  });

  it('applies plugin config extensions', () => {
    const testPlugin: FormPlugin = {
      name: 'test-extension-plugin',
      extendConfig: (model, config) => ({
        ...config,
        fields: config.fields.map(field => ({
          ...field,
          meta: { ...field.meta, pluginExtended: true },
        })),
      }),
    };

    registerPlugin(testPlugin);

    const model: FormModel = [
      { key: 'test', type: 'text', label: 'Test Field' },
    ];

    const config = buildFormConfig(model);
    
    expect(config.fields).toHaveLength(1);
    expect(config.fields[0].meta?.pluginExtended).toBe(true);
    expect(config.fields[0].key).toBe('test');
  });

  it('handles multiple plugins in correct order', () => {
    const plugin1: FormPlugin = {
      name: 'plugin1',
      extendConfig: (model, config) => ({
        ...config,
        fields: config.fields.map(field => ({
          ...field,
          meta: { ...field.meta, plugin1: true },
        })),
      }),
    };

    const plugin2: FormPlugin = {
      name: 'plugin2',
      extendConfig: (model, config) => ({
        ...config,
        fields: config.fields.map(field => ({
          ...field,
          meta: { ...field.meta, plugin2: true },
        })),
      }),
    };

    registerPlugin(plugin1);
    registerPlugin(plugin2);

    const model: FormModel = [
      { key: 'test', type: 'text', label: 'Test Field' },
    ];

    const config = buildFormConfig(model);
    
    expect(config.fields[0].meta?.plugin1).toBe(true);
    expect(config.fields[0].meta?.plugin2).toBe(true);
  });

  it('handles plugin errors gracefully', () => {
    const faultyPlugin: FormPlugin = {
      name: 'faulty-plugin',
      extendConfig: () => {
        throw new Error('Plugin failed');
      },
    };

    registerPlugin(faultyPlugin);

    const model: FormModel = [
      { key: 'test', type: 'text', label: 'Test Field' },
    ];

    // Should not throw and should return basic config
    const config = buildFormConfig(model);
    
    expect(config.fields).toHaveLength(1);
    expect(config.fields[0].key).toBe('test');
  });

  it('processes nested array fields correctly with plugins', () => {
    const nestedPlugin: FormPlugin = {
      name: 'nested-plugin',
      extendConfig: (model, config) => ({
        ...config,
        fields: config.fields.map(field => ({
          ...field,
          meta: { ...field.meta, processed: true },
        })),
      }),
    };

    registerPlugin(nestedPlugin);

    const model: FormModel = [
      {
        key: 'addresses',
        type: 'array',
        label: 'Addresses',
        itemModel: [
          { key: 'street', type: 'text', label: 'Street' },
          { key: 'city', type: 'text', label: 'City' },
        ],
      },
    ];

    const config = buildFormConfig(model);
    
    // Should have the array field and its nested fields
    expect(config.fields.length).toBeGreaterThan(1);
    
    // All fields should be processed by plugin
    config.fields.forEach(field => {
      expect(field.meta?.processed).toBe(true);
    });
    
    // Check nested paths
    expect(config.lookup['addresses']).toBeDefined();
    expect(config.lookup['addresses[0].street']).toBeDefined();
    expect(config.lookup['addresses[0].city']).toBeDefined();
  });
});