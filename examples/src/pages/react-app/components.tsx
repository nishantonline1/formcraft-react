import React, { useState } from 'react';
import { FormRenderer } from '@dynamic_forms/react';
import { useEnhancedForm } from '../../enhanced-hooks';
import { multiStepFormModel, initialMultiStepValues } from './model';
import './ReactAppStyles.css';

const steps = [
  { id: 1, title: 'Personal Information', fields: ['firstName', 'lastName', 'email'] },
  { id: 2, title: 'Address Details', fields: ['address', 'city', 'zipCode'] },
  { id: 3, title: 'Account Setup', fields: ['username', 'password'] },
];

export const ReactAppFormComponent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useEnhancedForm(multiStepFormModel, { initialValues: initialMultiStepValues });

  const handleNext = async () => {
    const currentStepFields = steps.find(s => s.id === currentStep)?.fields || [];
    const isValid = await form.triggerValidation(currentStepFields);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const currentStepConfig = {
    ...form.config,
    fields: form.config.fields.filter(f => steps[currentStep - 1].fields.includes(f.key)),
  };

  return (
    <div className="example-container react-app-example">
      <div className="example-header">
        <h2>Multi-Step Form with React Context (Simulation)</h2>
        <p className="description">
          This example simulates a multi-step form, demonstrating how one large form model can be split into browsable steps.
        </p>
      </div>
      <div className="multi-step-form">
        <div className="step-indicator">
          {steps.map(step => (
            <div key={step.id} className={`step-item ${step.id === currentStep ? 'active' : ''} ${step.id < currentStep ? 'completed' : ''}`}>
              <div className="step-number">{step.id}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>
        <div className="form-content">
          <FormRenderer form={form} config={currentStepConfig} />
        </div>
        <div className="form-navigation">
          {currentStep > 1 && <button onClick={handleBack}>Back</button>}
          {currentStep < steps.length && <button onClick={handleNext}>Next</button>}
          {currentStep === steps.length && <button onClick={() => alert('Form Submitted!')}>Submit</button>}
        </div>
      </div>
    </div>
  );
}; 