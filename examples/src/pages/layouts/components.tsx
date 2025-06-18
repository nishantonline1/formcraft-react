import React from 'react';
import type { FormValues, UseFormReturn, FormConfig, ConfigField } from 'react-form-builder-ts';
import {
  useResponsiveForm,
  useComplexLayoutForm,
} from './hooks';
import './styles.css';

interface FieldRendererProps {
  field: ConfigField;
  form: UseFormReturn;
}

const CustomFieldRenderer: React.FC<FieldRendererProps> = ({ field, form }) => {
  const value = form.values[field.path] || '';
  const errors = form.errors[field.path] || [];
  const options = form.dynamicOptions.get(field.path) || [];

  const renderInput = () => {
    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.path}
            value={String(value)}
            onChange={(e) => form.handleChange(field.path, e.target.value)}
            onBlur={() => form.handleBlur(field.path)}
          >
            {options.map((option) => (
              <option key={option.value as string} value={option.value as string}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            id={field.path}
            type={field.type}
            value={String(value)}
            onChange={(e) => form.handleChange(field.path, e.target.value)}
            onBlur={() => form.handleBlur(field.path)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="form-field">
      <label htmlFor={field.path}>
        {field.label}
        {field.validators?.required && <span className="required-indicator">*</span>}
      </label>
      {renderInput()}
      {errors.length > 0 && (
        <div className="field-errors">
          {errors.map((error, idx) => (
            <span key={idx}>{error}</span>
          ))}
        </div>
      )}
    </div>
  );
};


interface LayoutAwareFormRendererProps {
  config: FormConfig;
  form: UseFormReturn;
}

const LayoutAwareFormRenderer: React.FC<LayoutAwareFormRendererProps> = ({ config, form }) => {
  return (
    <div className="layout-grid">
      {config.fields.map((field: ConfigField) => {
        const { layout } = field;
        const style: React.CSSProperties = {};
        if (layout) {
          if (layout.row) style.gridRowStart = layout.row;
          if (layout.col) style.gridColumnStart = layout.col;
          if (layout.rowSpan) style.gridRowEnd = `span ${layout.rowSpan}`;
          if (layout.colSpan) style.gridColumnEnd = `span ${layout.colSpan}`;
        }

        return (
          <div key={field.path} style={style} className={layout?.className}>
            <CustomFieldRenderer field={field} form={form} />
          </div>
        );
      })}
    </div>
  );
};


const handleSubmit = async (values: FormValues) => {
  console.log('Form Submitted:', values);
};

const ResponsiveExample: React.FC = () => {
  const form = useResponsiveForm();
  return (
    <div className="layout-card responsive-layout">
      <h3>Responsive Layout</h3>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <LayoutAwareFormRenderer config={form.config} form={form} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

const ComplexLayoutExample: React.FC = () => {
  const form = useComplexLayoutForm();
  return (
    <div className="layout-card complex-layout">
      <h3>Complex Layout</h3>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <LayoutAwareFormRenderer config={form.config} form={form} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export const Layouts: React.FC = () => {
  return (
    <div className="layout-container">
      <ResponsiveExample />
      <ComplexLayoutExample />
    </div>
  );
}; 