import { v4 as uuidv4 } from 'uuid';
import { FormModel } from '../model';
import { FormConfig, ConfigField } from '../types';
import { applyConfigExtensions } from '../plugins';

export function buildFormConfig(
  model: FormModel,
  flags: Record<string, boolean> = {},
): FormConfig {
  const fields: ConfigField[] = [];
  const lookup: Record<string, ConfigField> = {};

  function traverse(
    items: FormModel,
    parentPath = '',
  ) {
    items.forEach((field, _index) => {
      // Skip by flag
      if (field.flags) {
        const flagKeys = Object.keys(field.flags);
        if (flagKeys.some(k => !flags[k])) return;
      }

      const path = parentPath
        ? `${parentPath}.${field.key}`
        : field.key;

      const id = uuidv4();
      const configField: ConfigField = {
        ...field,
        id,
        path,
      };

      // Apply dependencies hide/disable
      if (field.dependencies) {
        field.dependencies.forEach(_dep => {
          // lazy: we'll process runtime in hook
        });
      }

      fields.push(configField);
      lookup[path] = configField;

      // Handle array items
      if (field.type === 'array' && field.itemModel) {
        traverse(field.itemModel, `${path}[0]`);
      }
    });
  }

  traverse(model);
  
  // Apply plugin extensions to the config
  const baseConfig = { fields, lookup };
  return applyConfigExtensions(model, baseConfig);
}