import React from 'react';
import { FieldRendererProps } from '../FormRenderer';

export function TextInput({
  field,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  touched,
  disabled,
}: FieldRendererProps): React.JSX.Element {
  const inputValue = typeof value === 'string' ? value : '';
  const hasError = error && error.length > 0;

  return (
    <div className="text-input-field">
      <label htmlFor={field.id} className="field-label">
        {field.label}
        {field.validators?.required && <span className="required-indicator">*</span>}
      </label>
      
      <input
        id={field.id}
        type="text"
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        className={`text-input ${hasError ? 'error' : ''} ${touched ? 'touched' : ''}`}
        placeholder={`Enter ${field.label.toLowerCase()}`}
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