import React, { useState } from 'react';
import { CreateFormConfigExample } from './createFormConfig';
import { UseFormConfigExample } from './useFormConfig';
import './styles.css';

type ExampleType = 'overview' | 'createFormConfig' | 'useFormConfig';

const examples = [
  {
    id: 'createFormConfig' as ExampleType,
    title: 'createFormConfig',
    description: 'Generate form configurations without React dependencies',
    category: 'Core Functions',
    bundleSize: '~15KB',
    useCase: 'Server-side, Non-React environments'
  },
  {
    id: 'useFormConfig' as ExampleType,
    title: 'useFormConfig',
    description: 'Enhanced React hook with event handling and analytics',
    category: 'React Hooks',
    bundleSize: '~15KB + React',
    useCase: 'React applications with custom UI'
  }
];

export function ApiExamplesIndex() {
  const [activeExample, setActiveExample] = useState<ExampleType>('overview');

  const renderExample = () => {
    switch (activeExample) {
      case 'createFormConfig':
        return <CreateFormConfigExample />;
      case 'useFormConfig':
        return <UseFormConfigExample />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="api-examples-index">
      <nav className="examples-nav">
        <div className="nav-header">
          <h2>API Examples</h2>
          <p>Comprehensive examples for the React Form Builder Library</p>
        </div>
        
        <div className="nav-items">
          <button
            className={`nav-item ${activeExample === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveExample('overview')}
          >
            <span className="nav-title">Overview</span>
            <span className="nav-description">API documentation overview</span>
          </button>
          
          {examples.map(example => (
            <button
              key={example.id}
              className={`nav-item ${activeExample === example.id ? 'active' : ''}`}
              onClick={() => setActiveExample(example.id)}
            >
              <div className="nav-content">
                <span className="nav-title">{example.title}</span>
                <span className="nav-description">{example.description}</span>
                <div className="nav-meta">
                  <span className="category">{example.category}</span>
                  <span className="bundle-size">{example.bundleSize}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </nav>

      <main className="example-content">
        {renderExample()}
      </main>
    </div>
  );
}

function OverviewContent() {
  return (
    <div className="overview-content">
      <h1>API Documentation Examples</h1>
      <p className="overview-intro">
        Welcome to the comprehensive API documentation for the React Form Builder Library. 
        These interactive examples demonstrate the new configuration-first architecture and 
        show you how to use each API effectively.
      </p>

      <div className="architecture-overview">
        <h2>New Architecture Overview</h2>
        <div className="architecture-diagram">
          <div className="layer core-layer">
            <h3>Core Layer</h3>
            <p>Framework-agnostic configuration generation</p>
            <ul>
              <li><code>createFormConfig</code></li>
              <li>Validation utilities</li>
              <li>Dependency resolution</li>
              <li>State management</li>
            </ul>
          </div>
          <div className="layer react-layer">
            <h3>React Layer</h3>
            <p>React-specific hooks and state management</p>
            <ul>
              <li><code>useFormConfig</code></li>
              <li><code>useForm</code> (backward compatible)</li>
              <li>Event handling</li>
              <li>Analytics integration</li>
            </ul>
          </div>
          <div className="layer ui-layer">
            <h3>UI Layer (Optional)</h3>
            <p>Pre-built components and renderers</p>
            <ul>
              <li><code>FormRenderer</code></li>
              <li>Field components</li>
              <li>Providers</li>
              <li>Layout utilities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="examples-grid">
        <h2>Available Examples</h2>
        <div className="examples-list">
          {examples.map(example => (
            <div key={example.id} className="example-card">
              <h3>{example.title}</h3>
              <p>{example.description}</p>
              <div className="example-meta">
                <span className="category">{example.category}</span>
                <span className="bundle-size">{example.bundleSize}</span>
                <span className="use-case">{example.useCase}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="key-benefits">
        <h2>Key Benefits of New Architecture</h2>
        <div className="benefits-grid">
          <div className="benefit">
            <h3>🎯 Configuration-First</h3>
            <p>Generate form configurations that work with any UI framework or custom components.</p>
          </div>
          <div className="benefit">
            <h3>📦 Bundle Optimization</h3>
            <p>Import only what you need. Core functionality is just ~15KB, UI components are optional.</p>
          </div>
          <div className="benefit">
            <h3>⚡ Performance</h3>
            <p>40% faster initialization and optimized re-rendering with better state management.</p>
          </div>
          <div className="benefit">
            <h3>🔄 Backward Compatible</h3>
            <p>All existing code continues to work without changes. Migrate at your own pace.</p>
          </div>
          <div className="benefit">
            <h3>🛠 Enhanced DX</h3>
            <p>Better TypeScript support, cleaner APIs, and comprehensive event handling.</p>
          </div>
          <div className="benefit">
            <h3>🌐 Framework Agnostic</h3>
            <p>Use form configuration logic in Vue.js, Angular, or vanilla JavaScript.</p>
          </div>
        </div>
      </div>

      <div className="getting-started">
        <h2>Getting Started</h2>
        <div className="quick-start">
          <div className="start-option">
            <h3>New Projects</h3>
            <p>Start with the new architecture for optimal performance:</p>
            <pre><code>{`import { useFormConfig } from '@dynamic_forms/react';
import { FormRenderer } from '@dynamic_forms/react/ui';

const form = useFormConfig(formModel, { initialValues });`}</code></pre>
          </div>
          <div className="start-option">
            <h3>Existing Projects</h3>
            <p>Your existing code works without changes:</p>
            <pre><code>{`import { useForm, FormRenderer } from '@dynamic_forms/react';

const form = useForm(formModel, { initialValues });`}</code></pre>
          </div>
          <div className="start-option">
            <h3>Configuration Only</h3>
            <p>Use without React for maximum flexibility:</p>
            <pre><code>{`import { createFormConfig } from '@dynamic_forms/react';

const config = createFormConfig(formModel, { initialValues });`}</code></pre>
          </div>
        </div>
      </div>

      <div className="navigation-help">
        <h2>How to Use These Examples</h2>
        <div className="help-grid">
          <div className="help-item">
            <h3>📖 Interactive Documentation</h3>
            <p>Each example is fully interactive. Modify inputs and see real-time results.</p>
          </div>
          <div className="help-item">
            <h3>💻 Copy-Paste Ready</h3>
            <p>All code examples are production-ready and can be copied directly to your project.</p>
          </div>
          <div className="help-item">
            <h3>🔍 Detailed Explanations</h3>
            <p>Each example includes detailed explanations, use cases, and best practices.</p>
          </div>
          <div className="help-item">
            <h3>🚀 Performance Tips</h3>
            <p>Learn how to optimize bundle sizes and improve form performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}