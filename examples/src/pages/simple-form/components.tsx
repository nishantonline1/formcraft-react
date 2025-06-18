import React, { useState } from 'react';
import { FormRenderer } from 'react-form-builder-ts';
import { useSimpleForm } from './hooks';
import './SimpleFormStyles.css';

/**
 * Main form component that combines all parts and applies the new styling.
 */
export const SimpleFormComponent: React.FC = () => {
  const { form, handleSubmit, stats, validationState } = useSimpleForm();
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
    <div className="example-container simple-form-example">
      <div className="example-header">
        <h2>Simple Form with Dependencies</h2>
        <p className="description">
          A demonstration of a basic form with fields that depend on each other's values.
        </p>
      </div>
      <div className="example-content">
        <div className="form-area">
          <form onSubmit={onSubmit}>
            <FormRenderer form={form} config={form.config} />
            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={!validationState.canSubmit || isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
              {submitStatus === 'success' && <div className="status-message success">Form submitted successfully!</div>}
              {submitStatus === 'error' && <div className="status-message error">Submission failed. Please check errors.</div>}
            </div>
          </form>
        </div>
        <div className="info-area">
          <FormStatusDashboard stats={stats} validation={validationState} />
        </div>
      </div>
    </div>
  );
};

/**
 * Form status dashboard component that shows real-time form state.
 * It now receives stats and validation directly.
 */
const FormStatusDashboard: React.FC<{
  stats: ReturnType<typeof useSimpleForm>['stats'];
  validation: ReturnType<typeof useSimpleForm>['validationState'];
}> = ({ stats, validation }) => {
  return (
    <>
      <h3>Form State Dashboard</h3>
      <div className="dashboard-grid">
        <div className="status-section">
          <h4>Statistics</h4>
          <p>Total Fields: {stats.totalFields}</p>
          <p>Visible Fields: {stats.visibleFields}</p>
          <p>Disabled Fields: {stats.disabledFields}</p>
          <p>Fields with Errors: {stats.fieldsWithErrors}</p>
          <p>Touched Fields: {stats.touchedFields}</p>
        </div>
        <div className="status-section">
          <h4>Validation</h4>
          <p>Is Valid: {validation.isFormValid ? '✅' : '❌'}</p>
          <p>Is Touched: {validation.isFormTouched ? '✅' : '❌'}</p>
          <p>Is Dirty: {validation.isFormDirty ? '✅' : '❌'}</p>
          <p>Can Submit: {validation.canSubmit ? '✅' : '❌'}</p>
        </div>
      </div>
    </>
  );
}; 