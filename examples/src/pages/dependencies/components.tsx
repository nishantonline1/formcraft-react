import React, { useState } from 'react';
import { FormRenderer } from '@dynamic_forms/react';
import { useDependenciesForm } from './hooks';
import './DependenciesFormStyles.css';

/**
 * Main component for the Field Dependencies example.
 * This has been refactored to use the internal dependency engine and modern styling.
 */
export const DependenciesFormComponent: React.FC = () => {
  const { form, handleSubmit, dependencyStats } = useDependenciesForm();
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
    <div className="example-container dependencies-form-example">
      <div className="example-header">
        <h2>Dynamic Field Dependencies</h2>
        <p className="description">
          Fields dynamically show or hide based on the "Account Type" selection, using the internal dependency engine.
        </p>
      </div>
      <div className="example-content">
        <div className="form-area">
          <form onSubmit={onSubmit}>
            <FormRenderer form={form} config={form.config} />
            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
              {submitStatus === 'success' && <div className="status-message success">Form submitted successfully!</div>}
              {submitStatus === 'error' && <div className="status-message error">Submission failed. Please check errors.</div>}
            </div>
          </form>
        </div>
        <div className="info-area">
          <DependenciesInfoPanel stats={dependencyStats} />
        </div>
      </div>
    </div>
  );
};

/**
 * An informational panel showing dependency stats and features.
 */
export const DependenciesInfoPanel: React.FC<{
  stats: ReturnType<typeof useDependenciesForm>['dependencyStats'];
}> = ({ stats }) => {
  return (
    <>
      <h3>Dependencies Dashboard</h3>
      <div className="dashboard-grid">
        <div className="status-section">
          <h4>Current State</h4>
          <p><strong>Account Type:</strong> {stats.accountType || 'N/A'}</p>
          <p><strong>Visible Fields:</strong> {stats.visibleFieldsCount}</p>
          <p><strong>Required Fields:</strong> {stats.requiredFieldsCount}</p>
          <p><strong>Total Fields:</strong> {stats.totalFieldsCount}</p>
        </div>
        <div className="status-section">
          <h4>Visibility Rules</h4>
          <ul>
            <li><strong>Always Visible:</strong> Account Type, Name, Email</li>
            <li><strong>Business/Enterprise:</strong> Company, Tax ID</li>
            <li><strong>Enterprise Only:</strong> Department, Employee Count</li>
          </ul>
        </div>
      </div>
      <h4>Why this is better:</h4>
      <p>
        The form now uses the library's internal dependency engine. This is more efficient than rebuilding the form on each change and correctly preserves the state of hidden fields.
      </p>
    </>
  );
}; 