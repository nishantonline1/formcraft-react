export type FormValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | FormValue[]
  | { [key: string]: FormValue };

export type FormValues = Record<string, FormValue>;

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'regex' | string;
  message: string;
  [k: string]: any;
}

export interface LayoutOptions {
  row?: number;
  col?: number;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
}

export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'async-select'
  | 'checkbox'
  | 'array';

export interface DynamicOptions {
  trigger: string[];
  loader: (values: FormValues, search?: string) => Promise<{ value: FormValue; label: string }[]>;
}

export interface DependencyRule {
  dependsOn: string[];
  isVisible?: (values: FormValues) => boolean;
  isDisabled?: (values: FormValues) => boolean;
  overrides?: Partial<ConfigField>;
  field?: string;
}

export interface ConfigField {
  id: string;
  path: string;
  key: string;
  type: FieldType;
  label: string;
  renderer?: string;
  defaultValue?: FormValue;
  meta?: Record<string, unknown>;
  layout?: LayoutOptions;
  // optional select stuff
  options?: { value: FormValue; label: string }[];
  getOptionLabel?: (o: any) => string;
  getOptionValue?: (o: any) => string;
  dynamicOptions?: DynamicOptions;
  // validations & dependencies
  validations?: ValidationRule[];
  dependencies?: DependencyRule[];
  // state flags
  disabled?: boolean;
  hidden?: boolean;
}

export interface FormConfig {
  fields: ConfigField[];
  lookup: Record<string, ConfigField>;
}

export type ValidationErrors = Record<string, string[]>;
export type TouchedFields = Record<string, boolean>;

// =============================
// model.ts (types only; your actual model data stays separate)
// =============================
export type FormModel = Array<Omit<ConfigField, 'id' | 'path'> & { key: string }>;