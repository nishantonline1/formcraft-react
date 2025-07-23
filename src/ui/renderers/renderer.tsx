import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { FormValue } from '../../types';
import './Field.css';
import { FieldRenderer } from '../FormRenderer';

type Option = { value: FormValue; label: string };

export const TextInput: FieldRenderer = ({ field, value, onChange, onBlur, onFocus, error, touched, disabled }) => (
  <div className="customInputStyles">
    <label htmlFor={field.path} className="labelStyles">{field.label}</label>
    <input id={field.path} type="text" value={typeof value === 'string' ? value : ''}
      onChange={e => onChange(e.target.value)} onBlur={onBlur} onFocus={onFocus} disabled={disabled} />
    {touched && error && <div className="field-error">{error.join(', ')}</div>}
  </div>
);

export const NumberInput: FieldRenderer = ({ field, value, onChange, onBlur, onFocus, error, touched, disabled }) => (
  <div className="customInputStyles">
    <label htmlFor={field.path} className="labelStyles">{field.label}</label>
    <input id={field.path} type="number" value={typeof value === 'number' ? value : ''}
      onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      onBlur={onBlur} onFocus={onFocus} disabled={disabled} />
    {touched && error && <div className="field-error">{error.join(', ')}</div>}
  </div>
);

export const DatePicker: FieldRenderer = ({ field, value, onChange, onBlur, onFocus, error, touched, disabled }) => (
  <div className="customInputStyles">
    <label htmlFor={field.path} className="labelStyles">{field.label}</label>
    <input id={field.path} type="date" value={typeof value === 'string' ? value : ''}
      onChange={e => onChange(e.target.value)} onBlur={onBlur} onFocus={onFocus} disabled={disabled} />
    {touched && error && <div className="field-error">{error.join(', ')}</div>}
  </div>
);

export const CheckboxInput: FieldRenderer = ({ field, value, onChange, onBlur, onFocus, error, touched, disabled }) => (
  <div className="customInputStyles checkbox-wrapper">
    <label className="labelStyles">
      <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} onBlur={onBlur} onFocus={onFocus} disabled={disabled} />
      {field.label}
    </label>
    {touched && error && <div className="field-error">{error.join(', ')}</div>}
  </div>
);

export const Dropdown: FieldRenderer = ({ field, form, value, onChange, onBlur, onFocus, error, touched, disabled }) => {
  const staticOpts = Array.isArray(field.options) ? field.options as Option[] : [];
  const dynamicOpts = (form.dynamicOptions.get(field.path) as Option[]) || [];
  const options = staticOpts.length ? staticOpts : dynamicOpts;

  const getOptionLabel = field.getOptionLabel || ((o: Option) => o.label);
  const getOptionValue = field.getOptionValue || ((o: Option) => String(o.value));
  const selected = options.find(o => getOptionValue(o) === String(value)) ?? null;

  return (
    <div className="customInputStyles">
      <label htmlFor={field.path} className="labelStyles">{field.label}</label>
      <Select
        inputId={field.path}
        options={options}
        value={selected}
        onChange={opt => onChange(opt ? (opt as Option).value : '')}
        onBlur={onBlur}
        onFocus={onFocus}
        isDisabled={disabled}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
      />
      {touched && error && <div className="field-error">{error.join(', ')}</div>}
    </div>
  );
};

export const AsyncSelectInput: FieldRenderer = ({ field, form, value, onChange, onBlur, onFocus, error, touched, disabled }) => {
  const loadOptions = React.useCallback(async (input: string) => {
    const loader = field.dynamicOptions?.loader;
    if (!loader) return [];
    const res = await (loader.length === 2 ? loader(form.values, input) : loader(form.values));
    return Array.isArray(res) ? res : [];
  }, [field.dynamicOptions, form.values]);

  const opts = (form.dynamicOptions.get(field.path) as Option[]) || [];
  const selected = opts.find(o => String(o.value) === String(value)) ?? null;

  return (
    <div className="customInputStyles">
      <label htmlFor={field.path} className="labelStyles">{field.label}</label>
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        value={selected}
        onChange={opt => onChange(opt ? (opt as Option).value : '')}
        onBlur={onBlur}
        onFocus={onFocus}
        isDisabled={disabled}
        inputId={field.path}
      />
      {touched && error && <div className="field-error">{error.join(', ')}</div>}
    </div>
  );
};

export const ArrayFieldWrapper: FieldRenderer = ({ field, form, value = [], error, touched, disabled }) => {
  const arr = Array.isArray(value) ? value : [];
  return (
    <div className="array-field customInputStyles">
      <label className="labelStyles">{field.label}</label>
      {arr.map((_, idx) => (
        <div key={idx} className="array-item">
          <button type="button" onClick={() => form.removeArrayItem(field.path, idx)} disabled={disabled}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => form.addArrayItem(field.path)} disabled={disabled}>Add {field.label}</button>
      {touched && error && <div className="field-error">{error.join(', ')}</div>}
    </div>
  );
};

export const DEFAULT_RENDERERS: Record<string, FieldRenderer> = {
  text: TextInput,
  number: NumberInput,
  date: DatePicker,
  select: Dropdown,
  'async-select': AsyncSelectInput,
  checkbox: CheckboxInput,
  array: ArrayFieldWrapper,
};