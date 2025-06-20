import React, { useState } from 'react';
import { SimpleFormWrapper as SimpleForm } from './pages/simple-form';
import { ValidationFormWrapper as ValidationForm } from './pages/validation-form';
import { DependenciesWrapper as Dependencies } from './pages/dependencies';
import { EventHooksWrapper as EventHooks } from './pages/event-hooks';
import { FormHooksWrapper as FormHooks } from './pages/form-hooks';
import Layouts from './pages/layouts';
import { EnhancedDemoWrapper as EnhancedDemo } from './pages/enhanced-demo';
import SectionedFormExample from './pages/sectioned-form';
import AdvancedFormExample from './pages/advanced-form';
import GettingStarted from './pages/getting-started';

import './App.css';

const examples = {
  'getting-started': { component: GettingStarted, title: '🚀 Getting Started', hasNavigation: true },
  'enhanced-demo': { component: EnhancedDemo, title: '⭐ Enhanced Demo', hasNavigation: false },
  'simple-form': { component: SimpleForm, title: 'Simple Form', hasNavigation: false },
  'validation-form': { component: ValidationForm, title: 'Validation Form', hasNavigation: false },
  'dependencies': { component: Dependencies, title: 'Dependencies', hasNavigation: false },
  'event-hooks': { component: EventHooks, title: 'Event Hooks', hasNavigation: false },
  'form-hooks': { component: FormHooks, title: 'Form Hooks', hasNavigation: false },
  'layouts': { component: Layouts, title: 'Layouts', hasNavigation: false },
  'sectioned-form': { component: SectionedFormExample, title: 'Sectioned Form', hasNavigation: false },
  'advanced-form': { component: AdvancedFormExample, title: 'Advanced Form', hasNavigation: false },
};

type ExampleKey = keyof typeof examples;

const App: React.FC = () => {
  const [activeExample, setActiveExample] = useState<ExampleKey>('getting-started');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const ActiveComponent = examples[activeExample].component;
  const hasNavigation = examples[activeExample].hasNavigation;

  const handleNavigate = (example: string) => {
    if (example in examples) {
      setActiveExample(example as ExampleKey);
    }
  };

  const handleMenuClick = (key: ExampleKey) => {
    setActiveExample(key);
    setSidebarOpen(false); // Close sidebar on selection
  };

  return (
    <div className="app-container">
      {!isSidebarOpen && (
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
          ☰
        </button>
      )}
      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Form Builder Examples</h2>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            ×
          </button>
        </div>
        <ul>
          {Object.keys(examples).map(key => (
            <li
              key={key}
              className={activeExample === key ? 'active' : ''}
              onClick={() => handleMenuClick(key as ExampleKey)}
            >
              {examples[key as ExampleKey].title}
            </li>
          ))}
        </ul>
      </nav>
      <main className="content">
        <div className="content-header">
          <h1>{examples[activeExample].title}</h1>
        </div>
        <div className="component-container">
          {hasNavigation ? (
            <ActiveComponent onNavigate={handleNavigate} />
          ) : (
            <ActiveComponent />
          )}
        </div>
      </main>
      {isSidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default App; 