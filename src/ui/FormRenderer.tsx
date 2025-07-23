import React from 'react';
import { FormConfig, ConfigField, FormValue } from '../types';
import { UseFormReturn } from '../hooks/useForm';
import { getPluginRenderer } from '../plugins';
import { DEFAULT_RENDERERS } from './renderers/renderer';




// in FormRenderer.tsx
export type FieldRenderer = React.FC<FieldRendererProps>;

export interface FieldRendererProps {
  field: ConfigField;
  form: UseFormReturn;
  value: FormValue;                  // not unknown
  onChange: (value: FormValue) => void;
  onBlur: () => void;
  onFocus: () => void;
  error?: string[];
  touched?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface FormRendererProps {
  config: FormConfig;
  form: UseFormReturn;
  renderers?: Partial<Record<ConfigField['type'], FieldRenderer>>;
  customRenderers?: Record<string, FieldRenderer>;
  className?: string;
  style?: React.CSSProperties;
}

export function FormRenderer({
  config,
  form,
  renderers = {},
  customRenderers = {},
  className,
  style,
}: FormRendererProps): React.JSX.Element {

  const finalRenderers: Record<string, FieldRenderer> = { ...DEFAULT_RENDERERS, ...renderers };

  // Filter visible fields and sort by layout position
  const visibleFields = config.fields
    .filter(field => form.isFieldVisible(field.path))
    .sort((a, b) => {
      const aRow = a.layout?.row ?? 0;
      const bRow = b.layout?.row ?? 0;
      if (aRow !== bRow) return aRow - bRow;
      
      const aCol = a.layout?.col ?? 0;
      const bCol = b.layout?.col ?? 0;
      return aCol - bCol;
    });

  // Group fields by row for grid layout
  const fieldsByRow = visibleFields.reduce((acc, field) => {
    const row = field.layout?.row ?? 0;
    if (!acc[row]) acc[row] = [];
    acc[row].push(field);
    return acc;
  }, {} as Record<number, ConfigField[]>);

  const renderField = (field: ConfigField): React.JSX.Element => {
    const effectiveField = form.getEffectiveField(field.path) || field;
    
    // Check for a custom renderer by key first
    if (effectiveField.renderer && customRenderers[effectiveField.renderer]) {
      const CustomRenderer = customRenderers[effectiveField.renderer];
      return (
        <div key={field.id} className="custom-renderer-wrapper">
          <CustomRenderer
            field={effectiveField}
            form={form}
            value={form.values[field.path]}
            onChange={(value) => form.handleChange(field.path, value)}
            onBlur={() => form.handleBlur(field.path)}
            onFocus={() => form.handleFocus(field.path)}
            error={form.errors[field.path]}
            touched={form.touched[field.path]}
            disabled={form.isFieldDisabled(field.path)}
            hidden={false}
          />
        </div>
      );
    }

    // Check for plugin renderer next
    const pluginRenderer = getPluginRenderer(effectiveField, form);
    if (pluginRenderer) {
      return <div key={field.id}>{pluginRenderer}</div>;
    }

    // Use configured or default renderer
    const Renderer = finalRenderers[effectiveField.type];
    if (!Renderer) {
      console.warn(`No renderer found for field type: ${effectiveField.type}`);
      return <div key={field.id}>Unsupported field type: {effectiveField.type}</div>;
    }

    const fieldValue = form.values[field.path];
    const fieldErrors = form.errors[field.path];
    const fieldTouched = form.touched[field.path];
    const isDisabled = form.isFieldDisabled(field.path) || effectiveField.disabled;

    // Calculate grid styles
    const gridStyles: React.CSSProperties = {};
    if (effectiveField.layout) {
      const { col, colSpan, rowSpan } = effectiveField.layout;
      if (col !== undefined) gridStyles.gridColumnStart = col + 1;
      if (colSpan !== undefined) gridStyles.gridColumnEnd = `span ${colSpan}`;
      if (rowSpan !== undefined) gridStyles.gridRowEnd = `span ${rowSpan}`;
    }

    const fieldClassName = [
      'form-field',
      effectiveField.layout?.className,
      effectiveField.type,
      isDisabled ? 'disabled' : '',
      fieldErrors?.length ? 'error' : '',
      fieldTouched ? 'touched' : '',
    ].filter(Boolean).join(' ');

    return (
      <div
        key={field.id}
        className={fieldClassName}
        style={gridStyles}
        data-field-path={field.path}
        data-field-type={effectiveField.type}
      >
        <Renderer
          field={effectiveField}
          form={form}
          value={fieldValue}
          onChange={(value) => form.handleChange(field.path, value)}
          onBlur={() => form.handleBlur(field.path)}
          onFocus={() => form.handleFocus(field.path)}
          error={fieldErrors}
          touched={fieldTouched}
          disabled={isDisabled}
          hidden={false} // Already filtered out hidden fields
        />
      </div>
    );
  };

  // Render with grid layout if any fields have layout positions
  const hasGridLayout = visibleFields.some(field => 
    field.layout && (field.layout.row !== undefined || field.layout.col !== undefined)
  );

  if (hasGridLayout) {
    // Calculate grid dimensions
    const maxRow = Math.max(...visibleFields.map(f => f.layout?.row ?? 0));
    const maxCol = Math.max(...visibleFields.map(f => f.layout?.col ?? 0));
    
    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateRows: `repeat(${maxRow + 1}, auto)`,
      gridTemplateColumns: `repeat(${maxCol + 1}, 1fr)`,
      gap: '1rem',
      ...style,
    };

    return (
      <div className={`form-renderer grid-layout ${className || ''}`} style={gridStyle}>
        {visibleFields.map(renderField)}
      </div>
    );
  }

  // Default flow layout
  return (
    <div className={`form-renderer flow-layout ${className || ''}`} style={style}>
      {Object.entries(fieldsByRow)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([, rowFields]) => (
          <div key={`row-${rowFields[0]?.layout?.row ?? 0}`} className="form-row">
            {rowFields.map(renderField)}
          </div>
        ))}
    </div>
  );
} 