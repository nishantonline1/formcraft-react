import React, { useState } from 'react';
import { FormRenderer } from '@dynamic_forms/react';
import { useEventHooksForm } from './hooks';
import type { AnalyticsEvent } from './model';
import './EventHooksStyles.css';

/**
 * Main component for the Event Hooks example.
 */
export const EventHooksFormComponent: React.FC = () => {
  const { form, handleSubmit, analyticsEvents, analyticsStats } = useEventHooksForm();
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
    <div className="example-container event-hooks-example">
      <div className="example-header">
        <h2>Real-time Event Tracking & Analytics</h2>
        <p className="description">
          Demonstrates capturing form events (focus, blur, change) to power an analytics dashboard.
        </p>
      </div>
      <div className="example-content">
        <div className="form-area">
          <form onSubmit={onSubmit}>
            <FormRenderer form={form} config={form.config} />
            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit with Analytics'}
              </button>
              {submitStatus === 'success' && <div className="status-message success">Form submitted successfully!</div>}
              {submitStatus === 'error' && <div className="status-message error">Submission failed.</div>}
            </div>
          </form>
        </div>
        <div className="info-area">
          <AnalyticsDashboard stats={analyticsStats} />
          <EventStream events={analyticsEvents} />
        </div>
      </div>
    </div>
  );
};

/**
 * A dashboard showing real-time analytics stats.
 */
const AnalyticsDashboard: React.FC<{
  stats: ReturnType<typeof useEventHooksForm>['analyticsStats'];
}> = ({ stats }) => {
  return (
    <div className="analytics-dashboard">
      <h3>Analytics Dashboard</h3>
      <div className="dashboard-grid">
        <div className="stat-item">
          <strong>Total Interactions:</strong> {stats.totalInteractions}
        </div>
        <div className="stat-item">
          <strong>Field Changes:</strong> {stats.fieldChanges}
        </div>
        <div className="stat-item">
          <strong>Focus Events:</strong> {stats.focusEvents}
        </div>
        <div className="stat-item">
          <strong>Validation Errors:</strong> {stats.errorEvents}
        </div>
        <div className="stat-item">
          <strong>Session Duration:</strong> {Math.round(stats.sessionDuration / 1000)}s
        </div>
      </div>
    </div>
  );
};

/**
 * A panel showing the stream of tracked events.
 */
const EventStream: React.FC<{ events: AnalyticsEvent[] }> = ({ events }) => {
  return (
    <div className="event-stream">
      <h4>Live Event Stream</h4>
      <div className="event-list">
        {events.slice(-10).reverse().map((event) => (
          <div key={event.id} className="event-item">
            <span className={`event-type-tag ${event.type.split(':')[0]}`}>{event.type}</span>
            <span className="event-details">
              {event.field && <strong>{event.field}</strong>}
              <span className="event-time">{event.timestamp.toLocaleTimeString()}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 