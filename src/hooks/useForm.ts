import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { FormConfig, ConfigField, FormValues, ValidationErrors, TouchedFields, FormValue, FormModel } from '../types';
import { buildFormConfig } from '../config';
import { validateField } from '../utils/validation';
import { evaluateAllDependencies, DependencyResolution } from '../utils/dependencies';
import { trackEvent } from '../events/eventBus';
import { useAnalytics } from '../providers';

export interface UseFormReturn {
  config: FormConfig;
  values: FormValues;
  errors: ValidationErrors;
  touched: TouchedFields;
  dependencies: Map<string, DependencyResolution>;
  dynamicOptions: Map<string, { value: FormValue; label: string }[]>;
  isFieldVisible(path: string): boolean;
  isFieldDisabled(path: string): boolean;
  getEffectiveField(path: string): ConfigField | undefined;
  handleChange(path: string, value: FormValue): void;
  handleBlur(path: string): void;
  handleFocus(path: string): void;
  addArrayItem(path: string): void;
  removeArrayItem(path: string, index: number): void;
  handleSubmit(onSubmit: (values: FormValues) => Promise<unknown>): (e?: React.SyntheticEvent) => Promise<void>;
  trackEvent?: (eventName: string, payload: Record<string, unknown>) => void;
  onInit?: (field: ConfigField) => void;
  onFieldChange?: (path: string, value: FormValue) => void;
  onFieldBlur?: (path: string) => void;
  onFormSubmit?: (values: FormValues) => void;
  triggerValidation(fields: string[]): Promise<boolean>;
}

export function useForm(
  model: FormModel,
  options?: {
    initialValues?: FormValues;
    formId?: string;
    enableAnalytics?: boolean;
    eventHooks?: {
      onInit?: (field: ConfigField) => void;
      onFieldChange?: (path: string, value: FormValue) => void;
      onFieldBlur?: (path: string) => void;
      onFormSubmit?: (values: FormValues) => void;
    };
    flags?: Record<string, boolean>;
  }
): UseFormReturn {
  const config = useMemo(() => buildFormConfig(model, options?.flags), [model, options?.flags]);

  const initVals = options?.initialValues ?? {};
  const initValsRef = useRef(initVals);

  const [values, setValues] = useState<FormValues>(() =>
    config.fields.reduce((acc, f) => {
      acc[f.path] = initVals[f.path] ?? '';
      return acc;
    }, {} as FormValues)
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [dynamicOptions, setDynamicOptions] = useState<Map<string, { value: FormValue; label: string }[]>>(new Map());

  let analyticsHandler: ((eventName: string, data: Record<string, unknown>) => void) | undefined;
  try { if (options?.enableAnalytics !== false) analyticsHandler = useAnalytics(); } catch {}

  const dependencies = useMemo(() => evaluateAllDependencies(config.fields, values), [config.fields, values]);
  const prevDepsRef = useRef<Map<string, DependencyResolution>>(new Map());
  const prevValuesRef = useRef<FormValues>(values);

  const isFieldVisible = useCallback((path: string) => dependencies.get(path)?.isVisible ?? true, [dependencies]);
  const isFieldDisabled = useCallback((path: string) => dependencies.get(path)?.isDisabled ?? false, [dependencies]);
  const getEffectiveField = useCallback((path: string): ConfigField | undefined => {
    const base = config.lookup[path];
    if (!base) return;
    const res = dependencies.get(path);
    if (!res) return base;
    return {
      ...base,
      ...res.overrides,
      hidden: !res.isVisible,
      disabled: res.isDisabled,
    } as ConfigField;
  }, [config.lookup, dependencies]);
  
  

  const runValidation = useCallback((field: ConfigField, val: FormValue) => {
    const errs = validateField(field, val);
    setErrors(p => ({ ...p, [field.path]: errs }));
    trackEvent('form:validation', { fieldPath: field.path, fieldKey: field.key, value: val, errors: errs, isValid: !errs.length }, analyticsHandler);
    return errs;
  }, [analyticsHandler]);

  const handleChange = useCallback((path: string, value: FormValue) => {
    const field = config.lookup[path];
    if (!field) return;
    const oldValue = values[path];
    setValues(v => ({ ...v, [path]: value }));
    runValidation(field, value);
    trackEvent('field:change', { fieldPath: path, fieldKey: field.key, oldValue, newValue: value, formValues: { ...values, [path]: value } }, analyticsHandler);
    options?.eventHooks?.onFieldChange?.(path, value);
  }, [config.lookup, runValidation, values, analyticsHandler, options?.eventHooks]);

  const handleBlur = useCallback((path: string) => {
    const field = config.lookup[path];
    if (!field) return;
    setTouched(t => ({ ...t, [path]: true }));
    trackEvent('field:blur', { fieldPath: path, fieldKey: field.key, value: values[path], formValues: values }, analyticsHandler);
    options?.eventHooks?.onFieldBlur?.(path);
  }, [config.lookup, values, analyticsHandler, options?.eventHooks]);

  const handleFocus = useCallback((path: string) => {
    const field = config.lookup[path];
    if (!field) return;
    trackEvent('field:focus', { fieldPath: path, fieldKey: field.key, value: values[path], formValues: values }, analyticsHandler);
  }, [config.lookup, values, analyticsHandler]);

  const addArrayItem = useCallback((path: string) => {
    setValues(prev => {
      const cur = prev[path];
      const arr = Array.isArray(cur) ? (cur as FormValue[]) : [];
      return { ...prev, [path]: [...arr, {} as FormValue] } as FormValues;
    });
  }, []);

  const removeArrayItem = useCallback((path: string, index: number) => {
    setValues(prev => {
      const cur = prev[path];
      const arr = Array.isArray(cur) ? [...(cur as FormValue[])] : [];
      arr.splice(index, 1);
      return { ...prev, [path]: arr } as FormValues;
    });
    setErrors(e => {
      const copy = { ...e };
      delete copy[`${path}[${index}]`];
      return copy;
    });
  }, []);

  const triggerValidation = useCallback(async (paths: string[]) => {
    const results = await Promise.all(paths.map(p => config.lookup[p] ? validateField(config.lookup[p], values[p]) : []));
    const newErrs: ValidationErrors = {};
    let ok = true;
    paths.forEach((p, i) => {
      if (results[i].length) {
        newErrs[p] = results[i];
        ok = false;
      }
    });
    setErrors(prev => ({ ...prev, ...newErrs }));
    return ok;
  }, [config.lookup, values]);

  const handleSubmit = useCallback((onSubmit: (v: FormValues) => Promise<unknown>) => async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    const allErrs: ValidationErrors = {};
    config.fields.forEach(f => {
      if (isFieldVisible(f.path)) {
        const eff = (getEffectiveField(f.path) ?? f) as ConfigField;
        const errs = validateField(eff, values[f.path]);
        if (errs.length) allErrs[f.path] = errs;
      }
    });
    setErrors(allErrs);
    const valid = Object.keys(allErrs).length === 0;
    trackEvent('form:submit', { formId: options?.formId, values, isValid: valid, errors: valid ? undefined : allErrs }, analyticsHandler);
    if (!valid) return;
    try {
      await onSubmit(values);
      options?.eventHooks?.onFormSubmit?.(values);
    } catch (err) {
      console.error('Submission handler failed', err);
    }
  }, [config, values, options?.formId, analyticsHandler, getEffectiveField, isFieldVisible, options?.eventHooks]);

  // init effect
  useEffect(() => {
    trackEvent('form:init', { formId: options?.formId, initialValues: values, fieldCount: config.fields.length }, analyticsHandler);
    config.fields.forEach(f => options?.eventHooks?.onInit?.(f));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dependency change events
  useEffect(() => {
    const prev = prevDepsRef.current;
    dependencies.forEach((res, path) => {
      const old = prev.get(path);
      if (!old || old.isVisible !== res.isVisible || old.isDisabled !== res.isDisabled) {
        trackEvent('dependency:resolved', {
          fieldPath: res.field.path,
          fieldKey: res.field.key,
          isVisible: res.isVisible,
          isDisabled: res.isDisabled,
          dependsOn: res.dependsOn,
        }, analyticsHandler);
      }
    });
    prevDepsRef.current = new Map(dependencies);
  }, [dependencies, analyticsHandler]);

  // dynamic options loader (guarded)
  useEffect(() => {
    const withDyn = config.fields.filter(f => f.dynamicOptions);
    if (!withDyn.length) return;

    const triggerMap: Record<string, string[]> = {};
    withDyn.forEach(f => {
      f.dynamicOptions!.trigger.forEach(k => (triggerMap[k] ||= []).push(f.path));
    });

    const changedTriggers = Object.keys(triggerMap).filter(k => prevValuesRef.current[k] !== values[k]);
    if (!changedTriggers.length) {
      prevValuesRef.current = values;
      return;
    }

    const paths = new Set<string>();
    changedTriggers.forEach(k => triggerMap[k].forEach(p => paths.add(p)));

    (async () => {
      for (const p of paths) {
        const f = config.lookup[p];
        if (!f?.dynamicOptions) continue;
        const newOpts = await f.dynamicOptions.loader(values);
        setDynamicOptions(prev => {
          const next = new Map(prev);
          const old = next.get(p) || [];
          if (JSON.stringify(old) !== JSON.stringify(newOpts)) next.set(p, newOpts);
          return next;
        });
      }
      prevValuesRef.current = values;
    })();
  }, [values, config]);

  return {
    config,
    values,
    errors,
    touched,
    dependencies,
    dynamicOptions,
    isFieldVisible,
    isFieldDisabled,
    getEffectiveField,
    handleChange,
    handleBlur,
    handleFocus,
    addArrayItem,
    removeArrayItem,
    handleSubmit,
    triggerValidation,
    trackEvent: analyticsHandler,
    onInit: options?.eventHooks?.onInit,
    onFieldChange: options?.eventHooks?.onFieldChange,
    onFieldBlur: options?.eventHooks?.onFieldBlur,
    onFormSubmit: options?.eventHooks?.onFormSubmit,
  };
}
