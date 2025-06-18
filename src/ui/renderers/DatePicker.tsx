import React from 'react';
import { FieldRendererProps } from '../FormRenderer';

export function DatePicker({
  field,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  touched,
  disabled,
}: FieldRendererProps): React.JSX.Element {
  // Convert value to ISO date string for input[type="date"]
  const dateValue = value instanceof Date ? value.toISOString().split('T')[0] :
                   typeof value === 'string' ? value : '';
  const hasError = error && error.length > 0;

  const handleChange = (e: { target: { value: string } }) => {
    const dateStr = e.target.value;
    if (dateStr) {
      onChange(new Date(dateStr));
    } else {
      onChange('');
    }
  };

  return (
    <div className="date-picker-field">
      <label htmlFor={field.id} className="field-label">
        {field.label}
        {field.validators?.required && <span className="required-indicator">*</span>}
      </label>
      
      <input
        id={field.id}
        type="date"
        value={dateValue}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        className={`date-picker ${hasError ? 'error' : ''} ${touched ? 'touched' : ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.id}-error` : undefined}
      />
      
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