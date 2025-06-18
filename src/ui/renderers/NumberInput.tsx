import React from 'react';
import { FieldRendererProps } from '../FormRenderer';

export function NumberInput({
  field,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  touched,
  disabled,
}: FieldRendererProps): React.JSX.Element {
  const numericValue = typeof value === 'number' ? value : 
                      typeof value === 'string' && value !== '' ? Number(value) : '';
  const hasError = error && error.length > 0;

  const handleChange = (e: { target: { value: string } }) => {
    const val = e.target.value;
    if (val === '') {
      onChange('');
    } else {
      const num = Number(val);
      if (!isNaN(num)) {
        onChange(num);
      }
    }
  };

  return (
    <div className="number-input-field">
      <label htmlFor={field.id} className="field-label">
        {field.label}
        {field.validators?.required && <span className="required-indicator">*</span>}
      </label>
      
      <input
        id={field.id}
        type="number"
        value={numericValue}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        min={field.validators?.min}
        max={field.validators?.max}
        step={field.validators?.decimal_places ? `0.${'0'.repeat(field.validators.decimal_places - 1)}1` : 'any'}
        className={`number-input ${hasError ? 'error' : ''} ${touched ? 'touched' : ''}`}
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
      
      {(field.validators?.min !== undefined || field.validators?.max !== undefined) && (
        <div className="field-hint">
          {field.validators?.min !== undefined && field.validators?.max !== undefined 
            ? `Enter a number between ${field.validators.min} and ${field.validators.max}`
            : field.validators?.min !== undefined 
            ? `Minimum value: ${field.validators.min}`
            : `Maximum value: ${field.validators?.max}`
          }
        </div>
      )}
    </div>
  );
} 