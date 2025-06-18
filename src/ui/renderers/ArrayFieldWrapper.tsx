import React from 'react';
import { FieldRendererProps } from '../FormRenderer';

export function ArrayFieldWrapper({
  field,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled,
}: FieldRendererProps): React.JSX.Element {
  const arrayValue = Array.isArray(value) ? value : [];
  const hasError = error && error.length > 0;

  const addItem = () => {
    const newItem = field.itemModel ? {} : '';
    onChange([...arrayValue, newItem]);
  };

  const removeItem = (index: number) => {
    const newArray = arrayValue.filter((_, i) => i !== index);
    onChange(newArray);
  };

  const updateItem = (index: number, itemValue: unknown) => {
    const newArray = [...arrayValue];
    newArray[index] = itemValue;
    onChange(newArray);
  };

  return (
    <div className="array-field-wrapper">
      <div className="array-field-header">
        <label className="field-label">
          {field.label}
          {field.validators?.required && <span className="required-indicator">*</span>}
        </label>
        
        <button
          type="button"
          onClick={addItem}
          disabled={disabled}
          className="add-item-button"
          aria-label={`Add ${field.label} item`}
        >
          + Add Item
        </button>
      </div>

      {arrayValue.length === 0 && (
        <div className="empty-array-message">
          No items yet. Click "Add Item" to get started.
        </div>
      )}

      <div className="array-items">
        {arrayValue.map((item, index) => (
          <div key={index} className="array-item">
            <div className="array-item-header">
              <span className="item-index">#{index + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={disabled}
                className="remove-item-button"
                aria-label={`Remove item ${index + 1}`}
              >
                Remove
              </button>
            </div>
            
            <div className="array-item-content">
              {field.itemModel ? (
                // Complex item with nested fields - would need recursive rendering
                <div className="complex-array-item">
                  <textarea
                    value={typeof item === 'string' ? item : JSON.stringify(item, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        updateItem(index, parsed);
                      } catch {
                        updateItem(index, e.target.value);
                      }
                    }}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    disabled={disabled}
                    className="json-editor"
                    rows={3}
                    placeholder="Enter JSON or text..."
                  />
                </div>
              ) : (
                // Simple primitive item
                <input
                  type="text"
                  value={typeof item === 'string' || typeof item === 'number' ? String(item) : ''}
                  onChange={(e) => updateItem(index, e.target.value)}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  disabled={disabled}
                  className="array-item-input"
                  placeholder={`${field.label} ${index + 1}`}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {hasError && (
        <div className="field-error" role="alert">
          {error.map((err, index) => (
            <div key={index} className="error-message">
              {err}
            </div>
          ))}
        </div>
      )}

      <div className="array-field-info">
        {field.validators?.min !== undefined && field.validators?.max !== undefined 
          ? `Requires ${field.validators.min}-${field.validators.max} items`
          : field.validators?.min !== undefined
          ? `Minimum ${field.validators.min} items`
          : field.validators?.max !== undefined
          ? `Maximum ${field.validators.max} items`
          : null
        }
      </div>
    </div>
  );
} 