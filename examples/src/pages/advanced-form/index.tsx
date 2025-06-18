import React, { useState } from 'react';
import { useAdvancedForm } from './hooks';
import { Step1, Step2, Step3 } from './components';
import './styles.css';

export default function AdvancedFormExample() {
  const [step, setStep] = useState(1);
  const form = useAdvancedForm();

  const handleNext = async () => {
    // Add step-specific validation here if needed
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className="advanced-form-container">
      <h1>Advanced Form Wizard</h1>
      <div className="wizard-content">
        {step === 1 && <Step1 form={form} />}
        {step === 2 && <Step2 form={form} />}
        {step === 3 && <Step3 values={form.values} />}
      </div>
      <div className="wizard-controls">
        {step > 1 && (
          <button onClick={handlePrev} className="wizard-btn prev-btn">
            Previous
          </button>
        )}
        {step < 3 ? (
          <button onClick={handleNext} className="wizard-btn next-btn">
            Next
          </button>
        ) : (
          <button onClick={() => form.handleSubmit(async (values) => console.log('Final Submit:', values))} className="wizard-btn submit-btn">
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
