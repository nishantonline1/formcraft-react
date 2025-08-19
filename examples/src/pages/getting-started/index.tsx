import React from 'react';
import './GettingStarted.css';

interface GettingStartedProps {
  onNavigate?: (example: string) => void;
}

const GettingStarted: React.FC<GettingStartedProps> = ({ onNavigate }) => {
  return (
    <div className="getting-started">
      <div className="hero-section">
        <h1>🚀 Getting Started with Dynamic Forms React</h1>
        <p className="hero-description">
          A powerful, type-safe form builder for React applications with support for 
          validation, dependencies, layouts, sections, and much more.
        </p>
      </div>

      <div className="installation-section">
        <h2>📦 Installation</h2>
        <div className="code-block">
          <pre><code>npm install @dynamic_forms/react</code></pre>
        </div>
        <p>Or with yarn:</p>
        <div className="code-block">
          <pre><code>yarn add @dynamic_forms/react</code></pre>
        </div>
      </div>

      <div className="quick-start-section">
        <h2>⚡ Quick Start</h2>
        <div className="step">
          <h3>Step 1: Define Your Form Model</h3>
          <p>Create a <code>model.ts</code> file that describes your form structure:</p>
          <div className="code-block">
            <pre><code>{`// model.ts
import { FormModel } from '@dynamic_forms/react';

export const userFormModel: FormModel = {
  name: { type: 'text', required: true, label: 'Full Name' },
  email: { type: 'email', required: true, label: 'Email Address' },
  age: { type: 'number', label: 'Age', min: 18 },
  subscribe: { type: 'checkbox', label: 'Subscribe to newsletter' }
};`}</code></pre>
          </div>
        </div>

        <div className="step">
          <h3>Step 2: Define the Hook</h3>
          <p>Create a <code>hooks.ts</code> file to set up the form hook with model and initial values:</p>
          <div className="code-block">
            <pre><code>{`// hooks.ts
import { useForm } from '@dynamic_forms/react';
import { userFormModel } from './model';

export const useUserForm = () => {
  // Initialize form hook with model and default values
  const form = useForm({
    model: userFormModel,
    defaultValues: {
      name: '',
      email: '',
      age: 18,
      subscribe: false
    }
  });

  const handleSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  return { form, handleSubmit };
};`}</code></pre>
          </div>
        </div>

        <div className="step">
          <h3>Step 3: Define the Component</h3>
          <p>Create a <code>components.tsx</code> file using your custom hook:</p>
          <div className="code-block">
            <pre><code>{`// components.tsx
import React from 'react';
import { FormRenderer } from '@dynamic_forms/react';
import { userFormModel } from './model';
import { useUserForm } from './hooks';

const MyForm: React.FC = () => {
  const { form, handleSubmit } = useUserForm();

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormRenderer model={userFormModel} form={form} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;`}</code></pre>
          </div>
        </div>

        <div className="step">
          <h3>Step 4: Add Validation (Optional)</h3>
          <p>Enhance your form with validation rules:</p>
          <div className="code-block">
            <pre><code>{`const validatedModel: FormModel = {
  name: { 
    type: 'text', 
    required: true, 
    label: 'Full Name',
    validation: { minLength: 2, maxLength: 50 }
  },
  email: { 
    type: 'email', 
    required: true, 
    label: 'Email Address',
    validation: { pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ }
  },
  password: {
    type: 'password',
    required: true,
    label: 'Password',
    validation: { 
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/
    }
  }
};`}</code></pre>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>🎯 Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔒 Type Safety</h3>
            <p>Full TypeScript support with strict typing for form models and data.</p>
          </div>
          <div className="feature-card">
            <h3>✅ Validation</h3>
            <p>Built-in validation with support for custom rules and async validation.</p>
          </div>
          <div className="feature-card">
            <h3>🔗 Dependencies</h3>
            <p>Dynamic field visibility and behavior based on other field values.</p>
          </div>
          <div className="feature-card">
            <h3>📐 Layouts</h3>
            <p>Flexible grid-based layouts with responsive design support.</p>
          </div>
          <div className="feature-card">
            <h3>📂 Sections</h3>
            <p>Organize forms into collapsible sections for better UX.</p>
          </div>
          <div className="feature-card">
            <h3>🎣 Hooks</h3>
            <p>Powerful hooks for form state management and custom behavior.</p>
          </div>
        </div>
      </div>

      <div className="step-by-step-section">
        <h2>📚 Step-by-Step Learning Path</h2>
        <div className="learning-path">
          <div className="path-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Core Configuration Only</h3>
              <p>Learn the new architecture with core configuration without UI components. Perfect for custom UI frameworks.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('core-config-only')}>
                   View Core Config →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>New Architecture + UI</h3>
              <p>Explore the refactored library with useFormConfig and optional UI components for better modularity.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('new-architecture-ui')}>
                   View New Architecture →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Start with Simple Form</h3>
              <p>Learn the basics with our Simple Form example. Understand form models, basic field types, and form rendering.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('simple-form')}>
                   View Simple Form →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Add Validation</h3>
              <p>Explore form validation with built-in rules, custom validators, and error handling.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('validation-form')}>
                   View Validation Form →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>Field Dependencies</h3>
              <p>Learn how to create dynamic forms where fields depend on each other's values.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('dependencies')}>
                   View Dependencies →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">6</div>
            <div className="step-content">
              <h3>Event Hooks</h3>
              <p>Master form lifecycle events and custom event handling.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('event-hooks')}>
                   View Event Hooks →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">7</div>
            <div className="step-content">
              <h3>Custom Hooks</h3>
              <p>Discover powerful form management hooks for advanced use cases.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('form-hooks')}>
                   View Form Hooks →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">8</div>
            <div className="step-content">
              <h3>Layouts & Grid</h3>
              <p>Create beautiful, responsive forms with grid-based layouts.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('layouts')}>
                   View Layouts →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">9</div>
            <div className="step-content">
              <h3>Form Sections</h3>
              <p>Organize complex forms into manageable, collapsible sections.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('sectioned-form')}>
                   View Sectioned Form →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">10</div>
            <div className="step-content">
              <h3>Advanced Patterns</h3>
              <p>Master complex forms with wizards, nested arrays, and advanced layouts.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('advanced-form')}>
                   View Advanced Form →
                 </button>
               </div>
            </div>
          </div>

          <div className="path-step">
            <div className="step-number">11</div>
            <div className="step-content">
              <h3>Enhanced Demo</h3>
              <p>See everything in action with our comprehensive enhanced demo.</p>
                             <div className="step-actions">
                 <button className="nav-button" onClick={() => onNavigate?.('enhanced-demo')}>
                   View Enhanced Demo →
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="resources-section">
        <h2>📖 Additional Resources</h2>
        <div className="resources-grid">
          <div className="resource-card">
            <h3>🔧 API Reference</h3>
            <p>Complete documentation of all components, hooks, and types.</p>
            <a href="https://github.com/nishantonline1/formcraft-react" target="_blank" rel="noopener noreferrer">
              View Documentation →
            </a>
          </div>
          <div className="resource-card">
            <h3>💡 Examples Repository</h3>
            <p>Browse the source code of all examples and learn from implementations.</p>
            <a href="https://github.com/nishantonline1/formcraft-react/tree/main/examples" target="_blank" rel="noopener noreferrer">
              View Examples →
            </a>
          </div>
          <div className="resource-card">
            <h3>🐛 Issues & Support</h3>
            <p>Report bugs, request features, or get help from the community.</p>
            <a href="https://github.com/nishantonline1/formcraft-react/issues" target="_blank" rel="noopener noreferrer">
              Get Support →
            </a>
          </div>
        </div>
      </div>

      <div className="tips-section">
        <h2>💡 Pro Tips</h2>
        <div className="tips-list">
          <div className="tip">
            <h3>🎯 Start Small</h3>
            <p>Begin with simple forms and gradually add complexity as you learn the patterns.</p>
          </div>
          <div className="tip">
            <h3>🔍 Use TypeScript</h3>
            <p>Leverage full TypeScript support for better developer experience and fewer runtime errors.</p>
          </div>
          <div className="tip">
            <h3>🧩 Modular Design</h3>
            <p>Break complex forms into smaller, reusable components and models.</p>
          </div>
          <div className="tip">
            <h3>🎨 Custom Styling</h3>
            <p>Use CSS classes and custom renderers to match your application's design system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};



export default GettingStarted; 