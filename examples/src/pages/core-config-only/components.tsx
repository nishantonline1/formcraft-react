import React, { useState } from 'react';
import { useStandaloneConfig, useAdvancedCoreConfig, useBasicCoreConfig } from './hooks';
import { testScenarios, configurationPresets } from './model';
import './CoreConfigStyles.css';

/**
 * Enhanced component demonstrating comprehensive core configuration usage
 */
export const CoreConfigOnlyComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'standalone' | 'basic' | 'advanced'>('basic');

  return (
    <div className="example-container core-config-example">
      <div className="example-header">
        <h2>🚀 Core Configuration Only - Comprehensive Example</h2>
        <p className="description">
          Demonstrates the full power of the form library's core configuration approach with detailed field definitions,
          advanced validation, dependency management, and comprehensive usage patterns.
        </p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'standalone' ? 'active' : ''}`}
          onClick={() => setActiveTab('standalone')}
        >
          📊 Standalone Config
        </button>
        <button 
          className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          🎯 Basic Implementation
        </button>
        <button 
          className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          🔧 Advanced Features
        </button>
      </div>

      <div className="example-content">
        {activeTab === 'standalone' && <StandaloneConfigDemo />}
        {activeTab === 'basic' && <BasicImplementationDemo />}
        {activeTab === 'advanced' && <AdvancedFeaturesDemo />}
      </div>
    </div>
  );
};

/**
 * Demonstrates standalone configuration analysis and introspection
 */
const StandaloneConfigDemo: React.FC = () => {
  const configResult = useStandaloneConfig();
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'overview' | 'fields' | 'validation'>('overview');

  return (
    <div className="config-demo">
      <div className="demo-section">
        <h3>📊 Configuration Analysis</h3>
        
        <div className="analysis-controls">
          <button 
            className={`analysis-btn ${analysisMode === 'overview' ? 'active' : ''}`}
            onClick={() => setAnalysisMode('overview')}
          >
            Overview
          </button>
          <button 
            className={`analysis-btn ${analysisMode === 'fields' ? 'active' : ''}`}
            onClick={() => setAnalysisMode('fields')}
          >
            Field Details
          </button>
          <button 
            className={`analysis-btn ${analysisMode === 'validation' ? 'active' : ''}`}
            onClick={() => setAnalysisMode('validation')}
          >
            Validation Rules
          </button>
        </div>

        {analysisMode === 'overview' && (
          <div className="config-stats">
            <div className="stat-grid">
              <div className="stat-item">
                <span className="stat-label">Total Fields:</span>
                <span className="stat-value">{configResult.stats.totalFields}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Conditional Fields:</span>
                <span className="stat-value">{configResult.stats.conditionalFields}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Required Fields:</span>
                <span className="stat-value">{configResult.stats.requiredFields}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Field Types:</span>
                <span className="stat-value">{Object.keys(configResult.stats.fieldTypes).length}</span>
              </div>
            </div>
            
            <div className="field-type-breakdown">
              <h4>Field Type Distribution</h4>
              <div className="type-stats">
                {Object.entries(configResult.stats.fieldTypes).map(([type, count]) => (
                  <div key={type} className="type-stat">
                    <span className="type-name">{type}:</span>
                    <span className="type-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {analysisMode === 'fields' && (
          <div className="field-analysis">
            <div className="field-categories">
              <div className="category">
                <h4>🔧 Conditional Fields ({configResult.getConditionalFields().length})</h4>
                <ul>
                  {configResult.getConditionalFields().map(field => (
                    <li key={field.key} className="field-item">
                      <code>{field.key}</code> - {field.label}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="category">
                <h4>✅ Required Fields</h4>
                <ul>
                  {configResult.fields
                    .filter(f => f.validators?.required)
                    .map(field => (
                      <li key={field.key} className="field-item">
                        <code>{field.key}</code> - {field.label}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {analysisMode === 'validation' && (
          <div className="validation-analysis">
            <h4>🛡️ Validation Rules Overview</h4>
            <div className="validation-demo">
              <div className="validation-test">
                <label>Test Field Validation:</label>
                <select 
                  value={selectedField || ''} 
                  onChange={(e) => setSelectedField(e.target.value)}
                >
                  <option value="">Select a field to test...</option>
                  {configResult.fields.map(field => (
                    <option key={field.key} value={field.key}>{field.label}</option>
                  ))}
                </select>
              </div>
              
              {selectedField && (
                <div className="validation-results">
                  <h5>Validation for: {selectedField}</h5>
                  <div className="test-cases">
                    <div className="test-case">
                      <strong>Empty value:</strong>
                      <code>{JSON.stringify(configResult.validation.validateField(selectedField, ''))}</code>
                    </div>
                    <div className="test-case">
                      <strong>Invalid format:</strong>
                      <code>{JSON.stringify(configResult.validation.validateField(selectedField, 'invalid'))}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="code-example">
        <h4>💻 Code Example</h4>
        <pre className="code-block">
{`// Standalone Configuration Usage
import { createFormConfig } from '@dynamic_forms/react';

const configResult = createFormConfig(formModel, {
  enableDependencies: true,
  enableValidation: true
});

// Access configuration data
console.log('Fields:', configResult.fields);
console.log('Dependencies:', configResult.dependencies);

// Field introspection
const emailField = configResult.fields.find(f => f.key === 'email');
console.log('Email field:', emailField);

// Validation testing
const errors = validateField('email', 'invalid-email');
console.log('Validation errors:', errors);`}
        </pre>
      </div>
    </div>
  );
};

/**
 * Demonstrates basic implementation with minimal configuration
 */
const BasicImplementationDemo: React.FC = () => {
  const form = useBasicCoreConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await form.handleSubmit(form.values);
      setSubmitResult(result);
    } catch (error: any) {
      setSubmitResult({ success: false, error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const summary = form.getFormSummary();
  
  return (
    <div className="basic-demo">
      <div className="demo-header">
        <h3>🎯 Basic Implementation</h3>
        <p>Simple form implementation using minimal configuration preset</p>
        
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${summary.completionPercentage}%` }}
            />
          </div>
          <span className="progress-text">
            {summary.filledFields}/{summary.totalFields} fields completed ({summary.completionPercentage}%)
          </span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="basic-form">
        {form.config.fields
          ?.filter(field => form.isFieldVisible(field.key))
          .map(field => (
            <div key={field.key} className="form-field">
              <label className="field-label">
                {field.label}
                {field.validators?.required && <span className="required">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  value={form.values[field.key] || ''}
                  onChange={(e) => form.handleChange(field.key, e.target.value)}
                  className={`field-input ${form.errors[field.key] ? 'error' : ''}`}
                >
                  <option value="">Select...</option>
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.values[field.key] || false}
                    onChange={(e) => form.handleChange(field.key, e.target.checked)}
                    className="field-checkbox"
                  />
                  <span className="checkbox-text">{field.label}</span>
                </label>
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={form.values[field.key] || ''}
                  onChange={(e) => form.handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`field-input ${form.errors[field.key] ? 'error' : ''}`}
                />
              )}
              
              {form.errors[field.key] && (
                <div className="field-error">
                  {form.errors[field.key][0]}
                </div>
              )}
            </div>
          ))}
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting || !summary.isComplete}
            className="submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
      
      {submitResult && (
        <div className={`submit-result ${submitResult.success ? 'success' : 'error'}`}>
          <h4>{submitResult.success ? '✅ Success!' : '❌ Error'}</h4>
          <pre>{JSON.stringify(submitResult, null, 2)}</pre>
        </div>
      )}

      <div className="code-example">
        <h4>💻 Basic Implementation Code</h4>
        <pre className="code-block">
{`// Basic Form Implementation
import { useForm } from '@dynamic_forms/react';

const MyForm = () => {
  const form = useForm(minimalFormModel, {
    initialValues: { userType: '', firstName: '', lastName: '', email: '', agreesToTerms: false }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {form.config.fields
        .filter(field => form.isFieldVisible(field.key))
        .map(field => (
          <MyCustomInput
            key={field.key}
            field={field}
            value={form.values[field.key]}
            onChange={(value) => form.handleChange(field.key, value)}
            error={form.errors[field.key]}
          />
        ))}
      <button type="submit">Submit</button>
    </form>
  );
};`}
        </pre>
      </div>
    </div>
  );
};

/**
 * Demonstrates advanced features including presets, scenarios, and analytics
 */
const AdvancedFeaturesDemo: React.FC = () => {
  const {
    form,
    config,
    values,
    errors,
    handleChange,
    formAnalytics,
    currentPreset,
    switchPreset,
    availablePresets,
    loadTestScenario,
    availableScenarios,
    fieldIntrospection,
    validationMode,
    setValidationMode,
    performAdvancedValidation,
    handleAdvancedSubmit
  } = useAdvancedCoreConfig();
  
  const [activeSection, setActiveSection] = useState<'presets' | 'scenarios' | 'analytics' | 'introspection'>('analytics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await handleAdvancedSubmit();
      setSubmitResult(result);
    } catch (error: any) {
      setSubmitResult({ success: false, error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="advanced-demo">
      <div className="demo-header">
        <h3>🔧 Advanced Features</h3>
        <p>Comprehensive demonstration of advanced configuration capabilities</p>
      </div>
      
      <div className="feature-navigation">
        {['analytics', 'presets', 'scenarios', 'introspection'].map(section => (
          <button
            key={section}
            className={`feature-btn ${activeSection === section ? 'active' : ''}`}
            onClick={() => setActiveSection(section as any)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="feature-content">
        {activeSection === 'analytics' && (
          <div className="analytics-section">
            <h4>📊 Real-time Form Analytics</h4>
            
            <div className="analytics-grid">
              <div className="analytics-card">
                <h5>Completion Progress</h5>
                <div className="big-number">{formAnalytics.completionPercentage}%</div>
                <div className="metric-detail">
                  {formAnalytics.completedFields} of {formAnalytics.visibleFields} fields
                </div>
              </div>
              
              <div className="analytics-card">
                <h5>Validation Score</h5>
                <div className="big-number">{formAnalytics.validationScore}%</div>
                <div className="metric-detail">
                  {formAnalytics.touchedFields - formAnalytics.fieldsWithErrors} valid / {formAnalytics.touchedFields} touched
                </div>
              </div>
              
              <div className="analytics-card">
                <h5>Field Visibility</h5>
                <div className="big-number">{formAnalytics.visibleFields}</div>
                <div className="metric-detail">
                  of {formAnalytics.totalFields} total fields
                </div>
              </div>
              
              <div className="analytics-card">
                <h5>Conditional Fields</h5>
                <div className="big-number">{formAnalytics.activeConditionalFields}</div>
                <div className="metric-detail">
                  of {formAnalytics.conditionalFields} conditional
                </div>
              </div>
            </div>
            
            {Object.keys(formAnalytics.fieldsByType).length > 0 && (
              <div className="field-type-chart">
                <h5>Field Type Distribution</h5>
                <div className="type-distribution">
                  {Object.entries(formAnalytics.fieldsByType).map(([type, count]) => (
                    <div key={type} className="type-bar">
                      <span className="type-label">{type}</span>
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${(count / formAnalytics.totalFields) * 100}%` }}
                        />
                      </div>
                      <span className="type-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeSection === 'presets' && (
          <div className="presets-section">
            <h4>🎛️ Configuration Presets</h4>
            
            <div className="preset-controls">
              <label>Active Preset:</label>
              <select 
                value={currentPreset} 
                onChange={(e) => switchPreset(e.target.value as any)}
                className="preset-selector"
              >
                {availablePresets.map(preset => (
                  <option key={preset} value={preset}>
                    {preset.charAt(0).toUpperCase() + preset.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="preset-info">
              <h5>Current Configuration: {currentPreset}</h5>
              <div className="preset-stats">
                <div>Fields: {form.config.fields?.length || 0}</div>
                <div>Visible: {formAnalytics.visibleFields}</div>
                <div>Required: {form.config.fields?.filter(f => f.validators?.required).length || 0}</div>
              </div>
            </div>
            
            <div className="preset-descriptions">
              <div className="preset-card">
                <h6>Minimal</h6>
                <p>Essential fields only - perfect for quick signups</p>
                <small>5 fields: userType, firstName, lastName, email, agreesToTerms</small>
              </div>
              
              <div className="preset-card">
                <h6>Business</h6>
                <p>Comprehensive business information collection</p>
                <small>Includes company details, budget, and feature requirements</small>
              </div>
              
              <div className="preset-card">
                <h6>Enterprise</h6>
                <p>Full feature set with advanced customization options</p>
                <small>Complete field set with conditional enterprise-only fields</small>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'scenarios' && (
          <div className="scenarios-section">
            <h4>🧪 Test Scenarios</h4>
            
            <div className="scenario-controls">
              <label>Load Test Data:</label>
              <div className="scenario-buttons">
                {availableScenarios.map(scenario => (
                  <button
                    key={scenario}
                    onClick={() => loadTestScenario(scenario)}
                    className="scenario-btn"
                  >
                    {scenario.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="validation-controls">
              <label>Validation Mode:</label>
              <div className="validation-mode">
                <label>
                  <input
                    type="radio"
                    value="standard"
                    checked={validationMode === 'standard'}
                    onChange={(e) => setValidationMode(e.target.value as any)}
                  />
                  Standard
                </label>
                <label>
                  <input
                    type="radio"
                    value="strict"
                    checked={validationMode === 'strict'}
                    onChange={(e) => setValidationMode(e.target.value as any)}
                  />
                  Strict (with custom rules)
                </label>
              </div>
            </div>
            
            <div className="current-values">
              <h5>Current Form Values</h5>
              <pre className="values-display">
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        {activeSection === 'introspection' && (
          <div className="introspection-section">
            <h4>🔍 Field Introspection</h4>
            
            <div className="field-sections">
              {Object.entries(fieldIntrospection.getFieldsBySection()).map(([section, fieldKeys]) => (
                <div key={section} className="field-section">
                  <h5>{section.charAt(0).toUpperCase() + section.slice(1)} ({fieldKeys.length})</h5>
                  <div className="field-list">
                    {fieldKeys.map(fieldKey => {
                      const metadata = fieldIntrospection.getFieldMetadata(fieldKey);
                      return (
                        <div key={fieldKey} className="field-metadata">
                          <div className="field-header">
                            <code>{fieldKey}</code>
                            <div className="field-badges">
                              {metadata?.isVisible && <span className="badge visible">Visible</span>}
                              {metadata?.hasError && <span className="badge error">Error</span>}
                              {metadata?.isTouched && <span className="badge touched">Touched</span>}
                            </div>
                          </div>
                          <div className="field-details">
                            <div>Type: {metadata?.type}</div>
                            <div>Value: {JSON.stringify(metadata?.currentValue)}</div>
                            {metadata?.hasError && (
                              <div className="error-details">Errors: {JSON.stringify(errors[fieldKey])}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="advanced-actions">
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="advanced-submit-btn"
        >
          {isSubmitting ? 'Processing...' : 'Advanced Submit'}
        </button>
        
        <button 
          onClick={async () => {
            const validationResult = await performAdvancedValidation();
            console.log('Advanced validation result:', validationResult);
          }}
          className="validation-btn"
        >
          Run Advanced Validation
        </button>
      </div>
      
      {submitResult && (
        <div className={`submit-result ${submitResult.success ? 'success' : 'error'}`}>
          <h4>{submitResult.success ? '✅ Advanced Submission Success!' : '❌ Submission Error'}</h4>
          <pre>{JSON.stringify(submitResult, null, 2)}</pre>
        </div>
      )}

      <div className="code-example">
        <h4>💻 Advanced Implementation Code</h4>
        <pre className="code-block">
{`// Advanced Form with Analytics and Presets
import { useAdvancedCoreConfig } from './hooks';

const AdvancedForm = () => {
  const {
    config, values, errors, handleChange,
    formAnalytics, currentPreset, switchPreset,
    loadTestScenario, fieldIntrospection
  } = useAdvancedCoreConfig();

  return (
    <div className="advanced-form">
      {/* Configuration Controls */}
      <select value={currentPreset} onChange={(e) => switchPreset(e.target.value)}>
        <option value="minimal">Minimal</option>
        <option value="business">Business</option>
        <option value="enterprise">Enterprise</option>
      </select>
      
      {/* Analytics Dashboard */}
      <div className="analytics">
        <div>Completion: {formAnalytics.completionPercentage}%</div>
        <div>Validation Score: {formAnalytics.validationScore}%</div>
      </div>
      
      {/* Dynamic Form */}
      <form>
        {fieldIntrospection.getVisibleFieldKeys().map(fieldKey => (
          <AdvancedInput
            key={fieldKey}
            metadata={fieldIntrospection.getFieldMetadata(fieldKey)}
            value={values[fieldKey]}
            onChange={(value) => handleChange(fieldKey, value)}
          />
        ))}
      </form>
    </div>
  );
};`}
        </pre>
      </div>
    </div>
  );
};