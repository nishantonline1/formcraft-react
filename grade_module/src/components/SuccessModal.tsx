import React from 'react';
import { GradeFormData, ModuleType } from '../types';

interface SuccessModalProps {
  isOpen: boolean;
  gradeData: Partial<GradeFormData>;
  onClose: () => void;
  onCreateAnother: () => void;
  onViewDetails: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  gradeData,
  onClose,
  onCreateAnother,
  onViewDetails,
}) => {
  if (!isOpen) {
    return null;
  }

  const selectedModuleNames = gradeData.selectedModules?.map(moduleId => {
    const moduleMap: Record<ModuleType, string> = {
      SPECTRO: 'Spectroscopic Analysis',
      EAF: 'Electric Arc Furnace',
      MTC: 'Material Tracking & Control',
      IF: 'Induction Furnace',
      CHARGEMIX: 'Charge Mix Optimization',
    };
    return moduleMap[moduleId];
  }).join(', ') || 'None';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-3)' }}>
            ✅
          </div>
          <h2 className="modal-title">Grade Created Successfully!</h2>
          <p className="modal-description">
            Your new grade has been created and is ready for use in production.
          </p>
        </div>

        <div style={{ 
          padding: 'var(--spacing-4)', 
          backgroundColor: 'var(--muted)', 
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-6)'
        }}>
          <h3 style={{ margin: '0 0 var(--spacing-3) 0', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
            Grade Summary
          </h3>
          
          <div className="form-grid-2" style={{ gap: 'var(--spacing-4)' }}>
            <div>
              <div style={{ marginBottom: 'var(--spacing-2)' }}>
                <strong>Tag ID:</strong> {gradeData.gradeOverview?.tagId || 'N/A'}
              </div>
              <div style={{ marginBottom: 'var(--spacing-2)' }}>
                <strong>Name:</strong> {gradeData.gradeOverview?.gradeName || 'N/A'}
              </div>
              <div style={{ marginBottom: 'var(--spacing-2)' }}>
                <strong>Type:</strong> {gradeData.gradeOverview?.gradeType || 'N/A'}
              </div>
              <div style={{ marginBottom: 'var(--spacing-2)' }}>
                <strong>Status:</strong> 
                <span style={{ 
                  marginLeft: 'var(--spacing-2)', 
                  padding: '2px 8px', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: gradeData.gradeOverview?.status === 'Active' ? 'var(--green-500)' : 'var(--yellow-500)',
                  color: 'white',
                  fontSize: 'var(--font-size-xs)'
                }}>
                  {gradeData.gradeOverview?.status || 'Active'}
                </span>
              </div>
            </div>
            
            <div>
              <div style={{ marginBottom: 'var(--spacing-2)' }}>
                <strong>Temperature Range:</strong><br />
                {gradeData.gradeOverview?.tappingTemperatureMin}°C - {gradeData.gradeOverview?.tappingTemperatureMax}°C
              </div>
              <div style={{ marginBottom: 'var(--spacing-2)' }}>
                <strong>Bath Chemistry:</strong> {gradeData.targetChemistry?.withBathChemistry ? 'Enabled' : 'Disabled'}
              </div>
              <div style={{ marginBottom: 'var(--spacing-2)' }}>
                <strong>Elements Configured:</strong> {gradeData.targetChemistry?.elements?.length || 0}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: 'var(--spacing-3)' }}>
            <strong>Selected Modules:</strong>
            <div style={{ 
              marginTop: 'var(--spacing-2)', 
              padding: 'var(--spacing-2)', 
              backgroundColor: 'white', 
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-sm)'
            }}>
              {selectedModuleNames}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onCreateAnother}
          >
            Create Another Grade
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={onViewDetails}
          >
            View Grade Details
          </button>
        </div>

        <div style={{ 
          marginTop: 'var(--spacing-4)', 
          padding: 'var(--spacing-3)', 
          backgroundColor: 'var(--yellow-100)', 
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
            🎉 <strong>Next Steps:</strong> You can now use this grade in your production workflows, 
            configure additional parameters, or create variations based on this configuration.
          </p>
        </div>
      </div>
    </div>
  );
};


