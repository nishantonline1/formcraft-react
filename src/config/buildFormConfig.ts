import { applyConfigExtensions } from "../plugins";
import { v4 as uuidv4 } from 'uuid';
import { ConfigField, FormConfig, FormModel, FormValue, FormValues } from "../types";

// types you already have
type Option = { value: FormValue; label: string };

export function buildFormConfig(model: FormModel, flags: Record<string, boolean> = {}): FormConfig {
  const fields: ConfigField[] = [];
  const lookup: Record<string, ConfigField> = {};

  function traverse(items: FormModel, parentPath = '') {
    items.forEach((field) => {

      const path = parentPath ? `${parentPath}.${field.key}` : field.key;
      const id = uuidv4();

      // ---- NORMALIZE OPTIONS ----
      const rawOptions = (field as any).options as
        | Option[]
        | (() => Promise<Option[]>)
        | undefined;

      let options: Option[] | undefined;
      let dynamicOptions = field.dynamicOptions;

      if (typeof rawOptions === 'function') {
        const loaderFn = rawOptions; // () => Promise<Option[]>
        dynamicOptions = {
          trigger: dynamicOptions?.trigger ?? [],
          loader: async (_values: FormValues) => {
            const res = await loaderFn();
            return res as Option[];
          },
        };
      } else {
        options = rawOptions;
      }

      const configField: ConfigField = {
        ...field,
        id,
        path,
        options,
        dynamicOptions,
      } as ConfigField;

      fields.push(configField);
      lookup[path] = configField;
    });
  }

  traverse(model);
  return applyConfigExtensions(model, { fields, lookup });
}
