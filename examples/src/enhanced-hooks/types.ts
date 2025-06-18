import type { FieldProps } from 'react-form-builder-ts';

/**
 * Section interface for grouping fields
 */
export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  className?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  fields: FieldProps[];
  layout?: {
    columns?: number;
    gap?: string;
    className?: string;
  };
}

/**
 * Sectioned form model
 */
export interface SectionedFormModel {
  sections: FormSection[];
  layout?: {
    orientation?: 'vertical' | 'horizontal' | 'tabs';
    className?: string;
  };
}

/**
 * Enhanced field props with section information
 */
export interface SectionedFieldProps extends FieldProps {
  sectionId?: string;
  sectionTitle?: string;
}

/**
 * Section progress information
 */
export interface SectionProgress {
  completed: number;
  total: number;
  percentage: number;
} 