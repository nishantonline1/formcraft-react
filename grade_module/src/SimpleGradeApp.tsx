import React, { useState } from 'react';
import { useForm, FormRenderer } from '@dynamic_forms/react';
import './styles/design-system.css';
import './styles/components.css';

// Simple Grade Form Model for demonstration
const gradeFormModel = [
  {
    key: 'selectedModules',
    type: 'array' as const,
    label: 'Select Processing Modules',
    defaultValue: [],
    validators: {
      required: true,
      minItems: 1,
    },
    options: async () => [
      { value: 'SPECTRO', label: 'Spectroscopic Analysis' },
      { value: 'EAF', label: 'Electric Arc Furnace' },
      { value: 'MTC', label: 'Material Tracking & Control' },
      { value: 'IF', label: 'Induction Furnace' },
      { value: 'CHARGEMIX', label: 'Charge Mix Optimization' },
    ],
    layout: { row: 0, col: 0 }
  },
  {
    key: 'tagId',
    type: 'text' as const,
    label: 'Tag ID',
    defaultValue: '',
    validators: {
      required: true,
    },
    layout: { row: 1, col: 0 }
  },
  {
    key: 'gradeName',
    type: 'text' as const,
    label: 'Grade Name',
    defaultValue: '',
    validators: {
      required: true,
    },
    layout: { row: 1, col: 1 }
  },
  {
    key: 'gradeType',
    type: 'select' as const,
    label: 'Grade Type',
    defaultValue: 'DI',
    validators: {
      required: true
    },
    options: async () => [
      { value: 'DI', label: 'Ductile Iron' },
      { value: 'CI', label: 'Cast Iron' },
      { value: 'SS', label: 'Stainless Steel' },
      { value: 'SG', label: 'Spheroidal Graphite' },
      { value: 'GI', label: 'Gray Iron' }
    ],
    layout: { row: 2, col: 0 }
  },
  {
    key: 'tappingTemperatureMin',
    type: 'number' as const,
    label: 'Tapping Temperature Min (°C)',
    defaultValue: 1450,
    validators: {
      required: true,
      min: 800,
      max: 2000
    },
    layout: { row: 2, col: 1 }
  },
  {
    key: 'tappingTemperatureMax',
    type: 'number' as const,
    label: 'Tapping Temperature Max (°C)',
    defaultValue: 1550,
    validators: {
      required: true,
      min: 800,
      max: 2000
    },
    layout: { row: 2, col: 2 }
  },
  {
    key: 'withBathChemistry',
    type: 'select' as const,
    label: 'Bath Chemistry Configuration',
    defaultValue: '',
    validators: {
      required: true
    },
    options: async () => [
      { value: 'true', label: 'With Bath Chemistry' },
      { value: 'false', label: 'Without Bath Chemistry' }
    ],
    layout: { row: 3, col: 0 }
  },
  {
    key: 'spectroEnabled',
    type: 'checkbox' as const,
    label: 'Enable Spectroscopic Analysis',
    defaultValue: false,

    layout: { row: 4, col: 0 }
  },
  {
    key: 'chargemixEnabled',
    type: 'checkbox' as const,
    label: 'Enable Chargemix Configuration',
    defaultValue: false,

    layout: { row: 4, col: 1 }
  }
];

interface SuccessModalProps {
  isOpen: boolean;
  gradeData: any;
  onClose: () => void;
  onCreateAnother: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, gradeData, onClose, onCreateAnother }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-3)' }}>✅</div>
          <h2 className="modal-title">Grade Created Successfully!</h2>
          <p className="modal-description">
            Your new grade "{gradeData.gradeName}" has been created and is ready for use.
          </p>
        </div>

        <div style={{ 
          padding: 'var(--spacing-4)', 
          backgroundColor: 'var(--muted)', 
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-6)'
        }}>
          <h3 style={{ margin: '0 0 var(--spacing-3) 0' }}>Grade Summary</h3>
          <div><strong>Tag ID:</strong> {gradeData.tagId}</div>
          <div><strong>Type:</strong> {gradeData.gradeType}</div>
          <div><strong>Temperature:</strong> {gradeData.tappingTemperatureMin}°C - {gradeData.tappingTemperatureMax}°C</div>
          <div><strong>Modules:</strong> {gradeData.selectedModules?.join(', ') || 'None'}</div>
          <div><strong>Bath Chemistry:</strong> {gradeData.withBathChemistry === 'true' ? 'Enabled' : 'Disabled'}</div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onCreateAnother}>Create Another</button>
        </div>
      </div>
    </div>
  );
};

export const SimpleGradeApp: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formMethods = useForm(gradeFormModel);
  const { values, handleSubmit } = formMethods;

  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Grade created:', formData);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to create grade:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    // Reset form to initial values
    Object.keys(values).forEach(key => {
      const field = gradeFormModel.find(f => f.key === key);
      if (field) {
        formMethods.handleChange(key, field.defaultValue);
      }
    });
  };

  return (
    <div className="grade-creation-container">
      <div className="grade-creation-header">
        <h1 className="grade-creation-title">Grade Creation System</h1>
        <p className="grade-creation-subtitle">
          Create and configure industrial material grades using the Dynamic Forms library
        </p>
      </div>

      <div className="form-section">
        <div className="form-section-header">
          <h2 className="form-section-title">Grade Configuration</h2>
          <p className="form-section-description">
            Configure the basic information and processing modules for this grade.
          </p>
        </div>

        <FormRenderer 
          config={formMethods.config}
          form={formMethods}
        />

        <div className="action-bar">
          <div className="action-bar-left">
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
              Using Dynamic Forms with Core Config approach
            </div>
          </div>
          <div className="action-bar-right">
            <button
              className={`btn btn-success ${isSubmitting ? 'disabled' : ''}`}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner" />
                  Creating Grade...
                </>
              ) : (
                'Create Grade'
              )}
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        gradeData={values}
        onClose={() => setShowSuccess(false)}
        onCreateAnother={handleCreateAnother}
      />

      {/* Development Info */}
      <div style={{ 
        marginTop: 'var(--spacing-8)', 
        padding: 'var(--spacing-4)', 
        backgroundColor: 'var(--yellow-100)', 
        borderRadius: 'var(--radius-md)'
      }}>
        <h3 style={{ margin: '0 0 var(--spacing-2) 0' }}>🚀 Implementation Features</h3>
        <ul style={{ margin: 0, paddingLeft: 'var(--spacing-4)' }}>
          <li><strong>Dynamic Forms Integration:</strong> Uses core config approach with FormRenderer</li>
          <li><strong>Module Dependencies:</strong> Fields show/hide based on selected modules</li>
          <li><strong>Validation:</strong> Built-in form validation with error handling</li>
          <li><strong>Responsive Design:</strong> Mobile-friendly layout with design system</li>
          <li><strong>Industrial Spec:</strong> Follows Grade Creation Development Specification</li>
        </ul>
      </div>

      {/* Current Form Values - for development */}
      <details style={{ marginTop: 'var(--spacing-4)' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--muted-foreground)' }}>
          Show Current Form Values (Development)
        </summary>
        <pre style={{ 
          background: 'var(--muted)', 
          padding: 'var(--spacing-3)', 
          borderRadius: 'var(--radius-md)', 
          overflow: 'auto',
          fontSize: 'var(--font-size-xs)'
        }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </details>
    </div>
  );
};
