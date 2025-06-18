import React from 'react';
import { FieldRendererProps } from '../FormRenderer';

export function CheckboxInput({
  field,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
}: FieldRendererProps) {
  const isChecked = value === true;

  const handleChange = (e: { target: { checked: boolean } }) => {
    onChange(e.target.checked);
  };

  return (
    <div className="checkbox-input">
      <input
        type="checkbox"
        id={field.id}
        name={field.path}
        checked={isChecked}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        aria-label={field.label}
      />
      <label htmlFor={field.id}>{field.label}</label>
    </div>
  );
} 