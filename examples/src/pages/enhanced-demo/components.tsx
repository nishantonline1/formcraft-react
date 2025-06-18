import React, { useState } from 'react';
import { FormRenderer } from '@dynamic_forms/react';
import { useEnhancedFormDemo, useSectionedFormDemo, useComparisonDemo } from './hooks';
import { SectionedFormRenderer } from '../../components/SectionedFormRenderer';
import { sectionedDemoModel } from './model';

import './EnhancedDemoStyles.css';

/**
 * Main wrapper component for the enhanced form solutions demo
 */
export const EnhancedDemoWrapper: React.FC = () => {
  return (
    <div className="enhanced-demo-page">
      <header className="demo-header">
        <h1>🚀 Enhanced Form Solutions Demo</h1>
        <p>
          Showcasing the new `useEnhancedForm` and `useSectionedForm` hooks that improve developer experience and form organization.
        </p>
      </header>

      <div className="demo-section">
        <EnhancedFormExample />
      </div>
      
      <div className="demo-section">
        <SectionedFormExample />
      </div>

      <div className="demo-section">
        <MigrationComparison />
      </div>
    </div>
  );
};

/**
 * Example 1: Demonstrating useEnhancedForm
 * This shows how `buildFormConfig` is no longer needed.
 */
const EnhancedFormExample: React.FC = () => {
  const { form, handleSubmit, fieldCount, fieldPaths } = useEnhancedFormDemo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const onSubmit = async () => {
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
    <div className="example-container">
      <div className="example-header">
        <h2>Solution 1: The `useEnhancedForm` Hook</h2>
        <p className="description">
          This example demonstrates the new `useEnhancedForm` hook. It automatically handles `buildFormConfig`, saving boilerplate and improving performance.
        </p>
      </div>
      <div className="example-content">
        <div className="form-area">
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            <FormRenderer form={form} config={form.config} />
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
            {submitStatus === 'success' && <div className="status-message success">Form submitted successfully!</div>}
            {submitStatus === 'error' && <div className="status-message error">Submission failed. Please check errors.</div>}
          </form>
        </div>
        <div className="info-area">
          <h3>✅ Key Benefits</h3>
          <ul>
            <li><strong>No `buildFormConfig` call needed:</strong> The hook handles it internally.</li>
            <li><strong>Automatic Memoization:</strong> Config is only rebuilt when the model changes.</li>
            <li><strong>Simplified Code:</strong> Reduces form setup boilerplate by ~75%.</li>
            <li><strong>Config Access:</strong> `form.config` is still available for custom rendering.</li>
          </ul>
          <h4>Form Details</h4>
          <p><strong>Field Count:</strong> {fieldCount}</p>
          <p><strong>Field Paths:</strong></p>
          <pre><code>{JSON.stringify(fieldPaths, null, 2)}</code></pre>
        </div>
      </div>
    </div>
  );
};

/**
 * Example 2: Demonstrating useSectionedForm
 * This shows how to organize complex forms into logical sections.
 */
const SectionedFormExample: React.FC = () => {
  const { form, handleSubmit, overallProgress, sectionProgress } = useSectionedFormDemo();

  return (
    <div className="example-container">
      <div className="example-header">
        <h2>Solution 2: The `useSectionedForm` Hook</h2>
        <p className="description">
          This example demonstrates organizing a form into collapsible sections with progress tracking.
        </p>
      </div>
      <div className="example-content">
        <div className="form-area">
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <SectionedFormRenderer 
              sectionedModel={sectionedDemoModel} 
              form={form} 
              showProgress
            />
            <button type="submit" className="submit-button">Submit Sectioned Form</button>
          </form>
        </div>
        <div className="info-area">
          <h3>📊 Form Progress</h3>
          <div className="progress-summary">
            <h4>Overall Progress ({overallProgress.percentage}%)</h4>
            <ProgressBar progress={overallProgress.percentage} />
          </div>
          <div className="section-progress-list">
            {Object.entries(sectionProgress).map(([id, progress]) => (
              <div key={id} className="progress-item">
                <p><strong>{id.charAt(0).toUpperCase() + id.slice(1)} Section:</strong> {progress.percentage}%</p>
                <ProgressBar progress={progress.percentage} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Example 3: Migration Comparison
 * Shows a side-by-side of old vs. new patterns.
 */
const MigrationComparison: React.FC = () => {
  const { stats } = useComparisonDemo();

  return (
    <div className="example-container">
      <div className="example-header">
        <h2>🔧 Migration Path & Benefits</h2>
        <p className="description">
          A direct comparison between the old pattern (`useForm` + `buildFormConfig`) and the new `useEnhancedForm` hook.
        </p>
      </div>
      <div className="comparison-grid">
        <div className="code-block">
          <h4>❌ Old Way</h4>
          <pre><code>
{`import { useForm, buildFormConfig } from '@dynamic_forms/react';

const MyComponent = () => {
  const config = useMemo(
    () => buildFormConfig(model), 
    []
  );
  
  const form = useForm(config, {
    initialValues: {...}
  });

  return <FormRenderer config={config} form={form} />;
}`}
          </code></pre>
        </div>
        <div className="code-block">
          <h4>✅ New Way</h4>
          <pre><code>
{`import { useEnhancedForm } from './enhanced-hooks';

const MyComponent = () => {
  const form = useEnhancedForm(model, {
    initialValues: {...}
  });

  return <FormRenderer config={form.config} form={form} />;
}`}
          </code></pre>
        </div>
      </div>
       <div className="info-area centered">
          <h3>📈 Tangible Benefits</h3>
          <ul>
            <li><strong>Lines of Code Saved Per Form:</strong> {stats.linesOfCodeSaved}</li>
            <li><strong>Config Automatically Available:</strong> {stats.configAvailable ? 'Yes' : 'No'}</li>
            <li><strong>Reduced Complexity:</strong> One hook instead of two imports and a `useMemo`.</li>
          </ul>
        </div>
    </div>
  );
};


const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="progress-bar-container">
    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
  </div>
);

export default EnhancedDemoWrapper; 