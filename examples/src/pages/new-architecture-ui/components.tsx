import React, { useState } from 'react';
// Temporarily using direct import for development
// import { FormRenderer } from '@dynamic_forms/react/ui';
// For now, we'll create a simple placeholder
const FormRenderer: React.FC<any> = ({ form, config }) => {
  return (
    <div className="form-renderer-placeholder">
      <p>FormRenderer placeholder - UI components would render here</p>
      <p>Form has {config?.fields?.length || 0} fields</p>
      <pre>{JSON.stringify(form.values, null, 2)}</pre>
    </div>
  );
};
import { useNewArchitectureForm } from './hooks';
import './NewArchitectureStyles.css';

/**
 * Main component demonstrating new architecture with UI components
 */
export const NewArchitectureUIComponent: React.FC = () => {
  const form = useNewArchitectureForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'analysis'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await form.handleSubmit(form.values);
      setSubmitResult({ type: 'success', data: result });
    } catch (error) {
      setSubmitResult({ type: 'error', error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="example-container new-architecture-example">
      <div className="example-header">
        <h2>New Architecture with UI Components</h2>
        <p className="description">
          Demonstrates the refactored form library using useFormConfig with the optional UI components.
          Shows improved modularity, better tree-shaking, and enhanced developer experience.
        </p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Form Builder
        </button>
        <button 
          className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Project Analysis
        </button>
      </div>

      <div className="example-content">
        {activeTab === 'form' ? (
          <FormBuilderTab 
            form={form}
            isSubmitting={isSubmitting}
            submitResult={submitResult}
            onSubmit={handleSubmit}
          />
        ) : (
          <ProjectAnalysisTab 
            form={form}
            submitResult={submitResult}
          />
        )}
      </div>
    </div>
  );
};/**

 * Form builder tab component
 */
const FormBuilderTab: React.FC<{
  form: ReturnType<typeof useNewArchitectureForm>;
  isSubmitting: boolean;
  submitResult: any;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ form, isSubmitting, submitResult, onSubmit }) => {
  return (
    <div className="form-builder-tab">
      <div className="form-section">
        <div className="form-header">
          <h3>Project Configuration Form</h3>
          <div className="completion-indicator">
            <div className="completion-bar">
              <div 
                className="completion-fill" 
                style={{ width: `${form.formState.completionPercentage}%` }}
              />
            </div>
            <span className="completion-text">
              {form.formState.completionPercentage}% Complete
            </span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="project-form">
          <FormRenderer form={form} config={form.config} />
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={!form.formState.canSubmit || isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </button>
            
            <button 
              type="button" 
              onClick={() => window.location.reload()}
              className="reset-button"
              disabled={isSubmitting}
            >
              Reset Form
            </button>
          </div>

          {submitResult && (
            <SubmitResultDisplay result={submitResult} />
          )}
        </form>
      </div>

      <div className="sidebar-section">
        <FormStatsSidebar form={form} />
      </div>
    </div>
  );
};/**
 *
 Project analysis tab component
 */
const ProjectAnalysisTab: React.FC<{
  form: ReturnType<typeof useNewArchitectureForm>;
  submitResult: any;
}> = ({ form, submitResult }) => {
  return (
    <div className="analysis-tab">
      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>Project Overview</h3>
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-label">Project Type:</span>
              <span className="stat-value">{String(form.values.projectType || 'Not selected')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Framework/Language:</span>
              <span className="stat-value">
                {String(form.values.framework || form.values.language || 'Not selected')}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Team Size:</span>
              <span className="stat-value">{String(form.values.teamSize || 0)} members</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Timeline:</span>
              <span className="stat-value">{String(form.values.timeline || 0)} weeks</span>
            </div>
          </div>
        </div>

        <div className="analysis-card">
          <h3>Cost Analysis</h3>
          <div className="cost-breakdown">
            <div className="cost-item primary">
              <span className="cost-label">Estimated Cost:</span>
              <span className="cost-value">
                ${form.projectStats.estimatedCost.toLocaleString()}
              </span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Original Budget:</span>
              <span className="cost-value">
                ${(form.values.budget || 0).toLocaleString()}
              </span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Variance:</span>
              <span className={`cost-value ${
                form.projectStats.estimatedCost > (form.values.budget || 0) ? 'over' : 'under'
              }`}>
                {form.projectStats.estimatedCost > (form.values.budget || 0) ? '+' : ''}
                ${Math.abs(form.projectStats.estimatedCost - Number(form.values.budget || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="analysis-card">
          <h3>Risk Assessment</h3>
          <div className="risk-indicators">
            <div className="risk-item">
              <span className="risk-label">Complexity:</span>
              <span className={`risk-badge complexity-${form.projectStats.complexity.toLowerCase().replace(' ', '-')}`}>
                {form.projectStats.complexity}
              </span>
            </div>
            <div className="risk-item">
              <span className="risk-label">Risk Level:</span>
              <span className={`risk-badge risk-${form.projectStats.riskLevel.toLowerCase()}`}>
                {form.projectStats.riskLevel}
              </span>
            </div>
            <div className="risk-item">
              <span className="risk-label">Team Productivity:</span>
              <span className="risk-value">{form.projectStats.teamProductivity}x</span>
            </div>
          </div>
        </div>

        <div className="analysis-card full-width">
          <h3>Feature Breakdown</h3>
          <div className="features-list">
            {Array.isArray(form.values.features) && form.values.features.length > 0 ? (
              form.values.features.map((feature: string, index: number) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-name">{feature}</span>
                </div>
              ))
            ) : (
              <p className="no-features">No features specified</p>
            )}
          </div>
        </div>

        {submitResult?.type === 'success' && submitResult.data.recommendations && (
          <div className="analysis-card full-width">
            <h3>Recommendations</h3>
            <div className="recommendations-list">
              {submitResult.data.recommendations.map((rec: string, index: number) => (
                <div key={index} className="recommendation-item">
                  <span className="recommendation-icon">💡</span>
                  <span className="recommendation-text">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};/**
 * Fo
rm statistics sidebar component
 */
const FormStatsSidebar: React.FC<{
  form: ReturnType<typeof useNewArchitectureForm>;
}> = ({ form }) => {
  return (
    <div className="stats-sidebar">
      <div className="stats-section">
        <h4>Form Statistics</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Fields:</span>
            <span className="stat-value">{form.fieldStats.totalFields}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Visible Fields:</span>
            <span className="stat-value">{form.fieldStats.visibleFields}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Required Fields:</span>
            <span className="stat-value">{form.fieldStats.requiredFields}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Array Fields:</span>
            <span className="stat-value">{form.fieldStats.arrayFields}</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h4>Validation Status</h4>
        <div className="validation-indicators">
          <div className="validation-item">
            <span className="validation-label">Form Valid:</span>
            <span className={`validation-status ${form.formState.isValid ? 'valid' : 'invalid'}`}>
              {form.formState.isValid ? '✅' : '❌'}
            </span>
          </div>
          <div className="validation-item">
            <span className="validation-label">Errors:</span>
            <span className="validation-count">{form.formState.errorCount}</span>
          </div>
          <div className="validation-item">
            <span className="validation-label">Touched:</span>
            <span className="validation-count">{form.formState.touchedCount}</span>
          </div>
          <div className="validation-item">
            <span className="validation-label">Can Submit:</span>
            <span className={`validation-status ${form.formState.canSubmit ? 'valid' : 'invalid'}`}>
              {form.formState.canSubmit ? '✅' : '❌'}
            </span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h4>Architecture Info</h4>
        <div className="architecture-info">
          <div className="info-item">
            <span className="info-label">Hook Used:</span>
            <span className="info-value">useFormConfig</span>
          </div>
          <div className="info-item">
            <span className="info-label">UI Components:</span>
            <span className="info-value">@dynamic_forms/react/ui</span>
          </div>
          <div className="info-item">
            <span className="info-label">Bundle Impact:</span>
            <span className="info-value">Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Submit result display component
 */
const SubmitResultDisplay: React.FC<{
  result: any;
}> = ({ result }) => {
  if (result.type === 'success') {
    return (
      <div className="submit-result success">
        <div className="result-header">
          <span className="result-icon">✅</span>
          <span className="result-title">Project Created Successfully!</span>
        </div>
        <div className="result-details">
          <p><strong>Project ID:</strong> {result.data.projectId}</p>
          <p><strong>Estimated Cost:</strong> ${result.data.estimatedCost?.toLocaleString()}</p>
          {result.data.recommendations && result.data.recommendations.length > 0 && (
            <p><strong>Recommendations:</strong> {result.data.recommendations.length} items</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="submit-result error">
      <div className="result-header">
        <span className="result-icon">❌</span>
        <span className="result-title">Submission Failed</span>
      </div>
      <div className="result-details">
        <p>{result.error || 'An unexpected error occurred'}</p>
      </div>
    </div>
  );
};