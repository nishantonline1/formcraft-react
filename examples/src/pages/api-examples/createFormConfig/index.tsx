import React, { useState, useEffect } from 'react';
import { createFormConfig } from '@dynamic_forms/react';
import type { FormModel, FormConfigResult } from '@dynamic_forms/react';
import './styles.css';

// Example form model for user registration
const registrationModel: FormModel = [
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    validators: { required: true, min: 2 }
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    validators: { required: true, min: 2 }
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email Address',
    validators: { 
      required: true, 
      pattern: /^\S+@\S+\.\S+$/ 
    }
  },
  {
    key: 'userType',
    type: 'select',
    label: 'User Type',
    validators: { required: true },
    options: () => Promise.resolve([
      { value: 'basic', label: 'Basic User' },
      { value: 'premium', label: 'Premium User' },
      { value: 'enterprise', label: 'Enterprise User' }
    ])
  },
  {
    key: 'premiumFeatures',
    type: 'checkbox',
    label: 'Enable Premium Features',
    hidden: true,
    dependencies: [
      {
        field: 'userType',
        condition: (value) => value === 'premium' || value === 'enterprise',
        overrides: { hidden: false }
      }
    ]
  }
];

export function CreateFormConfigExample() {
  const [configResult, setConfigResult] = useState<FormConfigResult | null>(null);
  const [initialValues, setInitialValues] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    userType: 'basic',
    premiumFeatures: false
  });
  const [flags, setFlags] = useState({
    betaFeatures: true,
    advancedValidation: true
  });

  // Generate configuration when inputs change
  useEffect(() => {
    const result = createFormConfig(registrationModel, {
      initialValues,
      flags,
      enableDependencies: true,
      enableValidation: true
    });
    
    setConfigResult(result);
  }, [initialValues, flags]);

  const handleInitialValueChange = (key: string, value: any) => {
    setInitialValues(prev => ({ ...prev, [key]: value }));
  };

  const handleFlagChange = (flag: string, value: boolean) => {
    setFlags(prev => ({ ...prev, [flag]: value }));
  };

  return (
    <div className="create-form-config-example">
      <h1>createFormConfig API Example</h1>
      <p>
        This example demonstrates how to use <code>createFormConfig</code> to generate 
        form configurations without React dependencies. Perfect for server-side rendering 
        or non-React environments.
      </p>

      <div className="example-layout">
        <div className="controls-panel">
          <h2>Configuration Options</h2>
          
          <div className="control-group">
            <h3>Initial Values</h3>
            <div className="control">
              <label>First Name:</label>
              <input
                type="text"
                value={initialValues.firstName}
                onChange={(e) => handleInitialValueChange('firstName', e.target.value)}
              />
            </div>
            <div className="control">
              <label>Last Name:</label>
              <input
                type="text"
                value={initialValues.lastName}
                onChange={(e) => handleInitialValueChange('lastName', e.target.value)}
              />
            </div>
            <div className="control">
              <label>Email:</label>
              <input
                type="email"
                value={initialValues.email}
                onChange={(e) => handleInitialValueChange('email', e.target.value)}
              />
            </div>
            <div className="control">
              <label>User Type:</label>
              <select
                value={initialValues.userType}
                onChange={(e) => handleInitialValueChange('userType', e.target.value)}
              >
                <option value="basic">Basic User</option>
                <option value="premium">Premium User</option>
                <option value="enterprise">Enterprise User</option>
              </select>
            </div>
          </div>

          <div className="control-group">
            <h3>Feature Flags</h3>
            <div className="control">
              <label>
                <input
                  type="checkbox"
                  checked={flags.betaFeatures}
                  onChange={(e) => handleFlagChange('betaFeatures', e.target.checked)}
                />
                Beta Features
              </label>
            </div>
            <div className="control">
              <label>
                <input
                  type="checkbox"
                  checked={flags.advancedValidation}
                  onChange={(e) => handleFlagChange('advancedValidation', e.target.checked)}
                />
                Advanced Validation
              </label>
            </div>
          </div>
        </div>

        <div className="results-panel">
          <h2>Generated Configuration</h2>
          
          {configResult && (
            <div className="config-results">
              <div className="result-section">
                <h3>Fields ({configResult.fields.length})</h3>
                <div className="fields-list">
                  {configResult.fields.map(field => (
                    <div key={field.path} className="field-item">
                      <strong>{field.label}</strong>
                      <div className="field-details">
                        <span>Type: {field.type}</span>
                        <span>Path: {field.path}</span>
                        <span>Required: {field.validators?.required ? 'Yes' : 'No'}</span>
                        <span>Hidden: {field.hidden ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="result-section">
                <h3>Dependencies</h3>
                <div className="dependencies-list">
                  {Array.from(configResult.dependencies.entries()).map(([fieldPath, resolution]) => (
                    <div key={fieldPath} className="dependency-item">
                      <strong>{fieldPath}</strong>
                      <div className="dependency-details">
                        <span>Visible: {resolution.visible ? 'Yes' : 'No'}</span>
                        <span>Disabled: {resolution.disabled ? 'Yes' : 'No'}</span>
                        {resolution.overrides && (
                          <span>Has Overrides: Yes</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="result-section">
                <h3>Validation Rules</h3>
                <div className="validation-info">
                  <p>Validation utilities are available for:</p>
                  <ul>
                    <li>Field-level validation</li>
                    <li>Form-level validation</li>
                    <li>Custom validation rules</li>
                    <li>Async validation support</li>
                  </ul>
                </div>
              </div>

              <div className="result-section">
                <h3>State Queries</h3>
                <div className="state-info">
                  <p>Available state query functions:</p>
                  <ul>
                    <li>isFieldVisible(path)</li>
                    <li>isFieldDisabled(path)</li>
                    <li>getEffectiveFieldProps(path)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="code-example">
        <h2>Code Example</h2>
        <pre><code>{`import { createFormConfig } from '@dynamic_forms/react';

const configResult = createFormConfig(formModel, {
  initialValues: ${JSON.stringify(initialValues, null, 2)},
  flags: ${JSON.stringify(flags, null, 2)},
  enableDependencies: true,
  enableValidation: true
});

// Use the configuration
console.log('Fields:', configResult.fields);
console.log('Dependencies:', configResult.dependencies);
console.log('Validation:', configResult.validation);

// Server-side usage example
app.get('/api/form-config', (req, res) => {
  const config = createFormConfig(formModel, {
    initialValues: getUserData(req.user.id),
    flags: getUserFeatureFlags(req.user.id)
  });
  
  res.json({
    fields: config.fields,
    dependencies: Array.from(config.dependencies.entries()),
    hasValidation: !!config.validation
  });
});`}</code></pre>
      </div>

      <div className="use-cases">
        <h2>Use Cases</h2>
        <div className="use-case-grid">
          <div className="use-case">
            <h3>Server-Side Rendering</h3>
            <p>Generate form configurations on the server for faster initial page loads.</p>
          </div>
          <div className="use-case">
            <h3>Non-React Environments</h3>
            <p>Use form logic in Vue.js, Angular, or vanilla JavaScript applications.</p>
          </div>
          <div className="use-case">
            <h3>API Endpoints</h3>
            <p>Provide form configurations through REST APIs for dynamic form generation.</p>
          </div>
          <div className="use-case">
            <h3>Build-Time Generation</h3>
            <p>Pre-generate form configurations during build process for optimal performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}