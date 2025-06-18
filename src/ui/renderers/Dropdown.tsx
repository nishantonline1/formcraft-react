import React from 'react';
import { FieldRendererProps } from '../FormRenderer';

export function Dropdown({
  field,
  form,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  touched,
  disabled,
}: FieldRendererProps): React.JSX.Element {
  const selectedValue = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  const hasError = error && error.length > 0;
  
  // Use dynamic options from form state if available, otherwise load async options
  const [staticOptions, setStaticOptions] = React.useState<{ value: unknown; label: string }[]>([]);
  const dynamicOptions = form.dynamicOptions.get(field.path) || [];
  
  React.useEffect(() => {
    // Only load static options if no dynamic options are configured
    if (!field.dynamicOptions && field.options && typeof field.options === 'function') {
      field.options().then(setStaticOptions).catch(console.error);
    }
  }, [field.options, field.dynamicOptions]);

  const options = field.dynamicOptions ? dynamicOptions : staticOptions;

  return (
    <div className="dropdown-field">
      <label htmlFor={field.id} className="field-label">
        {field.label}
        {field.validators?.required && <span className="required-indicator">*</span>}
      </label>
      
      <select
        id={field.id}
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        className={`dropdown ${hasError ? 'error' : ''} ${touched ? 'touched' : ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.id}-error` : undefined}
      >
        <option value="">Choose {field.label.toLowerCase()}...</option>
        {options.map((option, index) => (
          <option key={index} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <div id={`${field.id}-error`} className="field-error" role="alert">
          {error.map((err, index) => (
            <div key={index} className="error-message">
              {err}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 