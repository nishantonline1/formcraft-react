import { FieldProps, FieldType } from '../model';

/** 
 * Runtime representation of each field. 
 * `id` + `path` assigned when building the config.
 */
export interface LayoutOptions {
  row?: number;
  col?: number;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
}

export interface ConfigField extends FieldProps {
  id: string;
  path: string;
  key: string;
  type: FieldType;
  renderer?: string;
  label: string;
  defaultValue?: FormValue;
  layout?: LayoutOptions;
}

/** 
 * The flattened, lookupable form configuration. 
 * Note: Enhanced version available in core module
 */
export interface FormConfig {
  fields: ConfigField[];
  lookup: Record<string, ConfigField>;
}

// Type definitions for form values and handlers
export type FormValue = string | number | boolean | Date | Record<string, unknown> | unknown[];
export type FormValues = Record<string, FormValue>;
export type ValidationErrors = Record<string, string[]>;
export type TouchedFields = Record<string, boolean>;
