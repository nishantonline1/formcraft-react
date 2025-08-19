import React, { useState } from 'react';
import { useFormConfig } from '@dynamic_forms/react';
import type { FormModel, EventHooks } from '@dynamic_forms/react';
import './styles.css';

// Example form model for project management
const projectModel: FormModel = [
  {
    key: 'projectName',
    type: 'text',
    label: 'Project Name',
    validators: { required: true, min: 3 },
    layout: { row: 0, col: 0, colSpan: 2 },
  },
  {
    key: 'projectType',
    type: 'select',
    label: 'Project Type',
    validators: { required: true },
    options: () =>
      Promise.resolve([
        { value: 'web', label: 'Web Application' },
        { value: 'mobile', label: 'Mobile App' },
        { value: 'desktop', label: 'Desktop Application' },
        { value: 'api', label: 'API Service' },
      ]),
    layout: { row: 1, col: 0 },
  },
  {
    key: 'budget',
    type: 'number',
    label: 'Budget ($)',
    validators: { required: true, min: 1000 },
    layout: { row: 1, col: 1 },
  },
  {
    key: 'hasDeadline',
    type: 'checkbox',
    label: 'Has Specific Deadline',
    layout: { row: 2, col: 0 },
  },
  {
    key: 'deadline',
    type: 'date',
    label: 'Project Deadline',
    hidden: true,
    validators: { required: true },
    dependencies: [
      {
        field: 'hasDeadline',
        condition: (value) => value === true,
        overrides: { hidden: false },
      },
    ],
    layout: { row: 2, col: 1 },
  },
  {
    key: 'features',
    type: 'array',
    label: 'Required Features',
    validators: { minItems: 1, maxItems: 10 },
    itemModel: [
      {
        key: 'name',
        type: 'text',
        label: 'Feature Name',
        validators: { required: true },
      },
      {
        key: 'priority',
        type: 'select',
        label: 'Priority',
        validators: { required: true },
        options: () =>
          Promise.resolve([
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ]),
      },
    ],
    layout: { row: 3, col: 0, colSpan: 2 },
  },
];

export function UseFormConfigExample() {
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [formId, setFormId] = useState('project-form');

  // Event hooks for demonstration
  const eventHooks: EventHooks = {
    onFieldChange: (path, value) => {
      const logEntry = `Field Changed: ${path} = ${JSON.stringify(value)}`;
      setEventLog((prev) => [logEntry, ...prev.slice(0, 9)]);
    },
    onFieldBlur: (path) => {
      const logEntry = `Field Blurred: ${path}`;
      setEventLog((prev) => [logEntry, ...prev.slice(0, 9)]);
    },
    onFormSubmit: (values) => {
      const logEntry = `Form Submitted: ${Object.keys(values).length} fields`;
      setEventLog((prev) => [logEntry, ...prev.slice(0, 9)]);
    },
  };

  // Initialize form with useFormConfig
  const form = useFormConfig(projectModel, {
    initialValues: {
      projectName: 'My Awesome Project',
      projectType: 'web',
      budget: 10000,
      hasDeadline: false,
      deadline: '',
      features: [
        { name: 'User Authentication', priority: 'high' },
        { name: 'Dashboard', priority: 'medium' },
      ],
    },
    formId,
    enableAnalytics: analyticsEnabled,
    eventHooks: analyticsEnabled ? eventHooks : undefined,
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('Form submitted with values:', values);
    console.log('✅ Form submitted successfully!');
  };

  const addFeature = () => {
    form.addArrayItem('features');
  };

  const removeFeature = (index: number) => {
    form.removeArrayItem('features', index);
  };

  const resetForm = () => {
    form.reset({
      projectName: '',
      projectType: '',
      budget: 0,
      hasDeadline: false,
      deadline: '',
      features: [{ name: '', priority: '' }],
    });
    setEventLog([]);
  };

  const validateForm = async () => {
    const isValid = await form.triggerValidation();
    console.log(`📋 Form validation result: ${isValid ? 'valid' : 'invalid'}`);
  };

  return (
    <div className="use-form-config-example">
      <h1>useFormConfig API Example</h1>
      <p>
        This example demonstrates the enhanced <code>useFormConfig</code> hook
        with advanced features like event hooks, analytics, array management,
        and real-time validation.
      </p>

      <div className="example-layout">
        <div className="form-panel">
          <div className="form-controls">
            <h2>Form Configuration</h2>
            <div className="control-row">
              <label>
                Form ID:
                <input
                  type="text"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                />
                Enable Analytics & Events
              </label>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="project-form"
          >
            <h2>Project Details</h2>

            {/* Basic Fields */}
            <div className="form-grid">
              <div className="field-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  value={String(form.values.projectName || '')}
                  onChange={(e) => form.setValue('projectName', e.target.value)}
                  onFocus={() => form.handleFocus('projectName')}
                  onBlur={() => form.handleBlur('projectName')}
                  className={
                    form.errors.projectName && form.touched.projectName
                      ? 'error'
                      : ''
                  }
                />
                {form.errors.projectName && form.touched.projectName && (
                  <div className="error-message">
                    {form.errors.projectName[0]}
                  </div>
                )}
              </div>

              <div className="field-group">
                <label>Project Type *</label>
                <select
                  value={String(form.values.projectType || '')}
                  onChange={(e) => form.setValue('projectType', e.target.value)}
                  onFocus={() => form.handleFocus('projectType')}
                  onBlur={() => form.handleBlur('projectType')}
                >
                  <option value="">Select type...</option>
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop Application</option>
                  <option value="api">API Service</option>
                </select>
                {form.errors.projectType && form.touched.projectType && (
                  <div className="error-message">
                    {form.errors.projectType[0]}
                  </div>
                )}
              </div>

              <div className="field-group">
                <label>Budget ($) *</label>
                <input
                  type="number"
                  value={typeof form.values.budget === 'number' ? form.values.budget : ''}
                  onChange={(e) =>
                    form.setValue('budget', parseInt(e.target.value) || 0)
                  }
                  onFocus={() => form.handleFocus('budget')}
                  onBlur={() => form.handleBlur('budget')}
                  min="1000"
                />
                {form.errors.budget && form.touched.budget && (
                  <div className="error-message">{form.errors.budget[0]}</div>
                )}
              </div>

              <div className="field-group">
                <label>
                  <input
                    type="checkbox"
                    checked={typeof form.values.hasDeadline === 'boolean' ? form.values.hasDeadline : false}
                    onChange={(e) =>
                      form.setValue('hasDeadline', e.target.checked)
                    }
                    onFocus={() => form.handleFocus('hasDeadline')}
                    onBlur={() => form.handleBlur('hasDeadline')}
                  />
                  Has Specific Deadline
                </label>
              </div>

              {form.isFieldVisible('deadline') && (
                <div className="field-group">
                  <label>Project Deadline *</label>
                  <input
                    type="date"
                    value={String(form.values.deadline || '')}
                    onChange={(e) => form.setValue('deadline', e.target.value)}
                    onFocus={() => form.handleFocus('deadline')}
                    onBlur={() => form.handleBlur('deadline')}
                  />
                  {form.errors.deadline && form.touched.deadline && (
                    <div className="error-message">
                      {form.errors.deadline[0]}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Array Field - Features */}
            <div className="features-section">
              <h3>Required Features</h3>
              {Array.isArray(form.values.features) ? form.values.features.map(
                (
                  feature: unknown,
                  index: number,
                ) => {
                  const typedFeature = feature as { name?: string; priority?: string };
                  return (
                  <div key={index} className="feature-item">
                    <div className="feature-fields">
                      <input
                        type="text"
                        placeholder="Feature name"
                        value={typedFeature.name || ''}
                        onChange={(e) =>
                          form.setValue(
                            `features.${index}.name`,
                            e.target.value,
                          )
                        }
                        onFocus={() =>
                          form.handleFocus(`features.${index}.name`)
                        }
                        onBlur={() => form.handleBlur(`features.${index}.name`)}
                      />
                      <select
                        value={typedFeature.priority || ''}
                        onChange={(e) =>
                          form.setValue(
                            `features.${index}.priority`,
                            e.target.value,
                          )
                        }
                        onFocus={() =>
                          form.handleFocus(`features.${index}.priority`)
                        }
                        onBlur={() =>
                          form.handleBlur(`features.${index}.priority`)
                        }
                      >
                        <option value="">Select priority...</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="remove-btn"
                        disabled={!Array.isArray(form.values.features) || form.values.features.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                    {form.errors[`features.${index}.name`] && (
                      <div className="error-message">
                        {form.errors[`features.${index}.name`][0]}
                      </div>
                    )}
                  </div>
                  );
                }
              ) : null}
              <button type="button" onClick={addFeature} className="add-btn">
                Add Feature
              </button>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={!form.isValid}
                className="submit-btn"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={validateForm}
                className="validate-btn"
              >
                Validate Form
              </button>
              <button type="button" onClick={resetForm} className="reset-btn">
                Reset Form
              </button>
            </div>
          </form>
        </div>

        <div className="info-panel">
          <div className="form-state">
            <h3>Form State</h3>
            <div className="state-grid">
              <div className="state-item">
                <span className="label">Valid:</span>
                <span className={`value ${form.isValid ? 'success' : 'error'}`}>
                  {form.isValid ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="state-item">
                <span className="label">Dirty:</span>
                <span
                  className={`value ${form.isDirty ? 'warning' : 'neutral'}`}
                >
                  {form.isDirty ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="state-item">
                <span className="label">Fields:</span>
                <span className="value">{form.fields.length}</span>
              </div>
              <div className="state-item">
                <span className="label">Touched:</span>
                <span className="value">
                  {Object.keys(form.touched).length}
                </span>
              </div>
              <div className="state-item">
                <span className="label">Errors:</span>
                <span
                  className={`value ${Object.keys(form.errors).length > 0 ? 'error' : 'success'}`}
                >
                  {Object.keys(form.errors).length}
                </span>
              </div>
              <div className="state-item">
                <span className="label">Features:</span>
                <span className="value">
                  {Array.isArray(form.values.features) ? form.values.features.length : 0}
                </span>
              </div>
            </div>
          </div>

          {analyticsEnabled && (
            <div className="event-log">
              <h3>Event Log</h3>
              <div className="log-entries">
                {eventLog.length === 0 ? (
                  <div className="no-events">
                    No events yet. Interact with the form!
                  </div>
                ) : (
                  eventLog.map((entry, index) => (
                    <div key={index} className="log-entry">
                      {entry}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="field-visibility">
            <h3>Field Visibility</h3>
            <div className="visibility-list">
              {form.fields.map((field) => (
                <div key={field.path} className="visibility-item">
                  <span className="field-name">{field.label}</span>
                  <span
                    className={`visibility-status ${form.isFieldVisible(field.path) ? 'visible' : 'hidden'}`}
                  >
                    {form.isFieldVisible(field.path) ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="code-example">
        <h2>Code Example</h2>
        <pre>
          <code>{`import { useFormConfig } from '@dynamic_forms/react';

const form = useFormConfig(projectModel, {
  initialValues: {
    projectName: 'My Awesome Project',
    projectType: 'web',
    budget: 10000,
    hasDeadline: false,
    features: [
      { name: 'User Authentication', priority: 'high' }
    ]
  },
  formId: '${formId}',
  enableAnalytics: ${analyticsEnabled},
  eventHooks: {
    onFieldChange: (path, value) => {
      console.log(\`Field \${path} changed to:\`, value);
    },
    onFieldFocus: (path) => {
      console.log(\`Field \${path} focused\`);
    },
    onFormSubmit: (values) => {
      console.log('Form submitted:', values);
    }
  }
});

// Use form state and methods
const handleSubmit = form.handleSubmit(async (values) => {
  await api.createProject(values);
});

// Array operations
form.addArrayItem('features');
form.removeArrayItem('features', 0);

// Validation
const isValid = await form.triggerValidation();

// State queries
const isVisible = form.isFieldVisible('deadline');
const isDisabled = form.isFieldDisabled('deadline');`}</code>
        </pre>
      </div>
    </div>
  );
}
