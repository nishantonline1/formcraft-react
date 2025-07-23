/**
 * Describes each form-field's schema.
 */
export type FieldType = 'text'|'number'|'select'|'date' | 'checkbox'|'async-select';

/**
 * Section configuration for grouping fields
 */
export interface FieldSection {
  id: string;
  title?: string;
  description?: string;
  className?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  layout?: {
    columns?: number;
    gap?: string;
    className?: string;
  };
  headerComponent?: string; // Custom header renderer key
  wrapperComponent?: string; // Custom wrapper renderer key
  meta?: Record<string, unknown>; // Additional section metadata
}

/**
 * Section reference for fields
 */
export interface FieldSectionRef {
  sectionId: string;
  order?: number; // Order within section
}

export interface FieldProps {
  key: string;      // payload property name
  type: FieldType;
  renderer?: string; // Key for a custom renderer component
  label: string;
  validators?: {
    required?: boolean;
    min?: number;
    max?: number;
    minItems?: number;
    maxItems?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => string[];
    decimal_places?: number;
  };
  layout?: {
    row?: number;
    col?: number;
    rowSpan?: number;
    colSpan?: number;
    className?: string;
  };
  disabled?: boolean;
  hidden?: boolean;
  options?: () => Promise<{ value: unknown; label: string }[]>;
  dynamicOptions?: {
    trigger: string[];  // Field keys that trigger options reload
    loader: (values: Record<string, unknown>) => Promise<{ value: unknown; label: string }[]>;
  };
  dependencies?: {
    field: string;
    condition: (v: unknown) => boolean;
    overrides: Partial<FieldProps>;
  }[];
  itemModel?: FormModel;              // only for type='array'
  meta?: Record<string, unknown>;     // arbitrary annotations
  flags?: Record<string, boolean>;    // Per-field feature toggles
  section?: FieldSectionRef;          // Section assignment
}

/** A form is just an array of FieldProps. */
export type FormModel = FieldProps[]; 

/**
 * Enhanced form model with explicit sections
 */
export interface SectionedFormModel {
  sections: FieldSection[];
  fields: FieldProps[];
  layout?: {
    orientation?: 'vertical' | 'horizontal' | 'tabs' | 'accordion';
    className?: string;
    renderMode?: 'grouped' | 'flat' | 'mixed'; // How to render sections
  };
}

/**
 * Section group data for rendering
 */
export interface SectionGroup {
  section: FieldSection;
  fields: FieldProps[];
  isVisible: boolean;
  isCollapsed: boolean;
}

/**
 * Section progress information
 */
export interface SectionProgress {
  sectionId: string;
  completed: number;
  total: number;
  percentage: number;
  hasErrors: boolean;
  isValid: boolean;
} 