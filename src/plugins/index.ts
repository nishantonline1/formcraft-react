import React from 'react';
import { FormModel } from '../model';
import { FormConfig, ConfigField } from '../types';
import { UseFormReturn } from '../hooks/useForm';

/**
 * Plugin interface for extending form functionality
 */
export interface FormPlugin {
  /** Plugin name for identification */
  name: string;
  
  /** Modify or augment FormConfig before use */
  extendConfig?(model: FormModel, config: FormConfig): FormConfig;
  
  /** Inject field-level custom validators */
  onValidate?(field: ConfigField, value: unknown): string[];
  
  /** Override default renderers for special field types */
  renderField?(field: ConfigField, form: UseFormReturn): React.JSX.Element | null;
}

/**
 * Plugin registry to store registered plugins
 */
class PluginRegistry {
  private plugins: FormPlugin[] = [];

  /**
   * Register a new plugin
   */
  register(plugin: FormPlugin): void {
    // Check if plugin with same name already exists
    const existingIndex = this.plugins.findIndex(p => p.name === plugin.name);
    if (existingIndex >= 0) {
      // Replace existing plugin
      this.plugins[existingIndex] = plugin;
    } else {
      // Add new plugin
      this.plugins.push(plugin);
    }
  }

  /**
   * Unregister a plugin by name
   */
  unregister(name: string): void {
    this.plugins = this.plugins.filter(p => p.name !== name);
  }

  /**
   * Get all registered plugins
   */
  getAll(): FormPlugin[] {
    return [...this.plugins];
  }

  /**
   * Get plugins that have extendConfig method
   */
  getConfigExtenders(): FormPlugin[] {
    return this.plugins.filter(p => typeof p.extendConfig === 'function');
  }

  /**
   * Get plugins that have onValidate method
   */
  getValidators(): FormPlugin[] {
    return this.plugins.filter(p => typeof p.onValidate === 'function');
  }

  /**
   * Get plugins that have renderField method
   */
  getRenderers(): FormPlugin[] {
    return this.plugins.filter(p => typeof p.renderField === 'function');
  }

  /**
   * Clear all plugins (useful for testing)
   */
  clear(): void {
    this.plugins = [];
  }
}

// Global plugin registry instance
const pluginRegistry = new PluginRegistry();

/**
 * Register a plugin globally
 */
export function registerPlugin(plugin: FormPlugin): void {
  pluginRegistry.register(plugin);
}

/**
 * Unregister a plugin by name
 */
export function unregisterPlugin(name: string): void {
  pluginRegistry.unregister(name);
}

/**
 * Get all registered plugins
 */
export function getRegisteredPlugins(): FormPlugin[] {
  return pluginRegistry.getAll();
}

/**
 * Apply config extensions from all registered plugins
 */
export function applyConfigExtensions(model: FormModel, config: FormConfig): FormConfig {
  const extenders = pluginRegistry.getConfigExtenders();
  return extenders.reduce((currentConfig, plugin) => {
    try {
      return plugin.extendConfig!(model, currentConfig);
    } catch (error) {
      console.warn(`Plugin "${plugin.name}" extendConfig failed:`, error);
      return currentConfig;
    }
  }, config);
}

/**
 * Run validation from all registered plugins for a field
 */
export function runPluginValidation(field: ConfigField, value: unknown): string[] {
  const validators = pluginRegistry.getValidators();
  const errors: string[] = [];
  
  validators.forEach(plugin => {
    try {
      const pluginErrors = plugin.onValidate!(field, value);
      errors.push(...pluginErrors);
    } catch (error) {
      console.warn(`Plugin "${plugin.name}" onValidate failed:`, error);
    }
  });
  
  return errors;
}

/**
 * Get renderer for a specific field from plugins
 */
export function getPluginRenderer(field: ConfigField, form: UseFormReturn): React.JSX.Element | null {
  const renderers = pluginRegistry.getRenderers();
  
  for (const plugin of renderers) {
    try {
      const element = plugin.renderField!(field, form);
      if (element) {
        return element;
      }
    } catch (error) {
      console.warn(`Plugin "${plugin.name}" renderField failed:`, error);
    }
  }
  
  return null;
}

/**
 * Clear all plugins (useful for testing)
 */
export function clearPlugins(): void {
  pluginRegistry.clear();
}

// Export the registry for advanced use cases
export { pluginRegistry };

// Export built-in plugins
export * from './builtins'; 