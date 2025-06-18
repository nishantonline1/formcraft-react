import React, { useState } from 'react';
import { FormRenderer } from '@dynamic_forms/react';
import { useValidationForm } from './hooks';
import './ValidationFormStyles.css';

/**
 * Main component for the Validation Form example.
 * It's been refactored to use the consolidated `useValidationForm` hook and modern styling.
 */
export const ValidationFormComponent: React.FC = () => {
  const { form, handleSubmit, validationMetrics } = useValidationForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await form.handleSubmit(handleSubmit)();
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="example-container validation-form-example">
      <div className="example-header">
        <h2>Advanced Validation Patterns</h2>
        <p className="description">
          An example of complex, real-time validation for various input types.
        </p>
      </div>
      <div className="example-content">
        <div className="form-area">
          <form onSubmit={onSubmit}>
            <ValidationStatusDashboard metrics={validationMetrics} />
            <FormRenderer form={form} config={form.config} />
            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={!validationMetrics.canSubmit || isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
              {submitStatus === 'success' && <div className="status-message success">Form submitted successfully!</div>}
              {submitStatus === 'error' && <div className="status-message error">Submission failed. Please check errors.</div>}
            </div>
          </form>
        </div>
        <div className="info-area">
          <ValidationInfoPanel />
        </div>
      </div>
    </div>
  );
};

/**
 * A dashboard showing real-time validation metrics.
 */
const ValidationStatusDashboard: React.FC<{
  metrics: ReturnType<typeof useValidationForm>['validationMetrics'];
}> = ({ metrics }) => {
  return (
    <div className="validation-dashboard">
      <div className="stat-item">
        <span className="stat-label">Completion</span>
        <span className="stat-value">{metrics.completionPercentage}%</span>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${metrics.completionPercentage}%` }}/>
        </div>
      </div>
      <div className="stat-item">
        <span className="stat-label">Valid Fields</span>
        <span className={`stat-value ${metrics.isFormValid ? 'success' : 'warning'}`}>
          {metrics.validFields}/{metrics.totalFields}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Errors</span>
        <span className={`stat-value ${metrics.hasErrors ? 'error' : 'success'}`}>
          {metrics.fieldsWithErrors}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Can Submit</span>
        <span className={`stat-value ${metrics.canSubmit ? 'success' : 'error'}`}>
          {metrics.canSubmit ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  );
};

/**
 * An informational panel explaining the validation features.
 */
const ValidationInfoPanel: React.FC = () => {
  return (
    <>
      <h3>Validation Features</h3>
      <p>This example demonstrates:</p>
      <ul>
        <li>Email format validation with regex.</li>
        <li>Password strength (length, case, etc.).</li>
        <li>Age range validation.</li>
        <li>Username format and length.</li>
        <li>Real-time validation dashboard.</li>
        <li>Smart error messaging.</li>
        <li>Submission state management.</li>
      </ul>
      <h4>Why this is better:</h4>
      <p>
        The `useValidationForm` hook now consolidates all validation logic, fixing a previous bug and making the code more efficient and readable.
      </p>
    </>
  );
}; 