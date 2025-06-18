import React from 'react';
import { useSections } from 'react-form-builder-ts';
import type { UseFormReturn, ConfigField, FormValues, SectionGroup, FormModel } from 'react-form-builder-ts';

// --- Re-usable Field Renderer ---

const FieldRenderer: React.FC<{ field: ConfigField; form: UseFormReturn }> = ({ field, form }) => {
  const value = form.values[field.path];
  const errors = form.errors[field.path] || [];

  if (field.type === 'checkbox') {
    return (
      <div className="form-field field-type-checkbox">
        <div className="checkbox-wrapper">
          <input
            id={field.path}
            type="checkbox"
            checked={!!value}
            onChange={(e) => form.handleChange(field.path, e.target.checked)}
            onBlur={() => form.handleBlur(field.path)}
            className="form-checkbox"
          />
          <label htmlFor={field.path}>
            {field.label}
            {field.validators?.required && <span className="required-indicator">*</span>}
          </label>
        </div>
        {errors.length > 0 && <div className="field-errors">{errors.join(', ')}</div>}
      </div>
    );
  }

  return (
    <div className="form-field">
      <label htmlFor={field.path}>
        {field.label}
        {field.validators?.required && <span className="required-indicator">*</span>}
      </label>
      <input
        id={field.path}
        type={field.type}
        value={String(value || '')}
        onChange={(e) => form.handleChange(field.path, e.target.value)}
        onBlur={() => form.handleBlur(field.path)}
        className="form-input"
      />
      {errors.length > 0 && <div className="field-errors">{errors.join(', ')}</div>}
    </div>
  );
};

// --- Recursive Array Renderer for Step 2 ---

const ArrayFieldRenderer: React.FC<{
  path: string;
  form: UseFormReturn;
  itemModel: FormModel;
  depth: number;
}> = ({ path, form, itemModel, depth }) => {
  const arrayValues = (form.values[path] as any[]) || [];

  return (
    <div className={`array-field-container depth-${depth}`}>
      {arrayValues.map((_item, index) => {
        const itemPath = `${path}[${index}]`;
        return (
          <div key={itemPath} className="array-item">
            <div className="array-item-fields">
              {itemModel.map((field) => {
                const fieldPath = `${itemPath}.${field.key}`;
                if (field.type === 'array') {
                  return (
                    <div key={fieldPath} className="nested-array">
                      <label>{field.label}</label>
                      <ArrayFieldRenderer
                        path={fieldPath}
                        form={form}
                        itemModel={field.itemModel || []}
                        depth={depth + 1}
                      />
                    </div>
                  );
                }
                const configField = { ...field, path: fieldPath, id: fieldPath };
                return <FieldRenderer key={fieldPath} field={configField} form={form} />;
              })}
            </div>
            <button
              type="button"
              className="remove-item-btn"
              onClick={() => form.removeArrayItem(path, index)}
            >
              Remove
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className="add-item-btn"
        onClick={() => form.addArrayItem(path)}
      >
        Add Item
      </button>
    </div>
  );
};

// --- Wizard Step Components ---

export const Step1: React.FC<{ form: UseFormReturn }> = ({ form }) => {
  const stepFields = form.config.fields.filter((f) => f.meta?.step === 1);
  const layoutFields = stepFields.filter((f) => f.layout && !f.section);
  const sectionModel = stepFields.filter((f) => f.section);
  const sections = useSections(sectionModel, form);

  return (
    <div className="wizard-step">
      <h2>Step 1: Personal Information & Profile</h2>
      <div className="layout-grid">
        {layoutFields.map((field) => {
          const { layout } = field;
          const style: React.CSSProperties = {
            gridColumn: layout?.col ? `${layout.col} / span ${layout.colSpan || 1}` : undefined,
            gridRow: layout?.row ? `${layout.row} / span ${layout.rowSpan || 1}` : undefined,
          };
          return (
            <div key={field.path} style={style}>
              <FieldRenderer field={field} form={form} />
            </div>
          );
        })}
      </div>
      {sections.sections.map((sectionGroup: SectionGroup) => (
        <div key={sectionGroup.section.id} className="section-container">
          <h3>{sectionGroup.section.title}</h3>
          {sectionGroup.fields.map((field) => {
            const configField = form.config.lookup[field.key];
            return configField ? <FieldRenderer key={field.key} field={configField} form={form} /> : null;
          })}
        </div>
      ))}
    </div>
  );
};

export const Step2: React.FC<{ form: UseFormReturn }> = ({ form }) => {
  const experienceField = form.config.fields.find(
    (f) => f.key === 'experiences' && f.type === 'array'
  );

  if (!experienceField || !experienceField.itemModel) {
    return <p>Error: Could not find experiences array configuration.</p>;
  }

  return (
    <div className="wizard-step">
      <h2>Step 2: Work Experience</h2>
      <ArrayFieldRenderer path="experiences" form={form} itemModel={experienceField.itemModel} depth={0} />
    </div>
  );
};

export const Step3: React.FC<{ values: FormValues }> = ({ values }) => (
  <div className="wizard-step">
    <h2>Step 3: Summary</h2>
    <pre className="summary-box">{JSON.stringify(values, null, 2)}</pre>
  </div>
);
