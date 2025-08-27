import React from 'react';
import { useGradeCreation } from './hooks';
import { 
  ModuleSelectionCard,
  ChemistryTable,
  BathChemistryDecision,
  CollapsibleSection,
  ToleranceSettings,
  MaterialSelection
} from '../../components';
import { moduleInfo } from './models';
import type { ChemicalElement, Material, ToleranceSettings as ToleranceSettingsType, GradeFormData } from './types';

// Success Modal Component
interface SuccessModalProps {
  gradeName: string;
  gradeType: string;
  selectedModules: string[];
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ gradeName, gradeType, selectedModules, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Grade Created Successfully! 🎉</h2>
      <div className="success-details">
        <p><strong>Grade Name:</strong> {gradeName}</p>
        <p><strong>Grade Type:</strong> {gradeType}</p>
        <p><strong>Selected Modules:</strong> {selectedModules.join(', ')}</p>
      </div>
      <button onClick={onClose} className="btn btn-primary">Close</button>
    </div>
  </div>
);

const GradeCreatePage: React.FC = () => {
  const {
    form,
    formData,
    state,
    handleSubmit,
    onReset,
    updateChemistryElements,
    updateToleranceSettings,
    updateMaterials,
    toggleModule
  } = useGradeCreation();

  // Extract and type form data properly
  const values = formData as Partial<GradeFormData>;
  const formMethods = form;
  const showSuccessModal = state.submitSuccess;
  const handleCloseSuccessModal = onReset;

  // Safely extract typed values with defaults
  const selectedModules = (values.selectedModules as string[]) ?? [];
  const chemistryElements = (values.chemistryElements as ChemicalElement[]) ?? [];
  const toleranceSettings = (values.toleranceSettings as ToleranceSettingsType[]) ?? [];
  const materials = (values.materials as Material[]) ?? [];
  const bathChemistryDecision = (values.bathChemistryDecision as 'with' | 'without') ?? 'without';
  const rememberChoice = (values.rememberChoice as boolean) ?? false;

  return (
    <div className="grade-creation-app">
      <header className="grade-creation-header">
        <h1 className="section-title">Grade Management</h1>
      </header>

      <form onSubmit={handleSubmit} className="grade-form">
        {/* Module Selection Section */}
        <section className="form-section">
          <div className="form-section-header">
            <h2 className="section-title">Module Selection</h2>
            <p className="section-description">
              SPECTRO module is enabled by default. Select IF Kiosk if charge mixture management is required.
            </p>
          </div>
          
          <div className="module-selection-grid">
            {Object.keys(moduleInfo).map((moduleKey) => (
              <ModuleSelectionCard
                key={moduleKey}
                moduleKey={moduleKey as keyof typeof moduleInfo}
                isSelected={selectedModules.includes(moduleKey)}
                onToggle={toggleModule}
              />
            ))}
          </div>
        </section>

        {/* Grade Overview & Identification Section */}
        <section className="form-section">
          <div className="form-section-header">
            <h2 className="section-title">Grade Overview & Identification</h2>
            <p className="section-description">
              Define the basic grade information and metallurgical parameters.
            </p>
          </div>
          
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">Tag ID *</label>
              <input
                type="text"
                value={values.tagId as string || ''}
                onChange={(e) => formMethods.handleChange('tagId', e.target.value)}
                className="form-input"
                placeholder="DI-001"
              />
              <div className="form-helper">Unique alphanumeric identifier for spectrometer integration</div>
            </div>
            
            <div className="form-field">
              <label className="form-label">Grade Name *</label>
              <input
                type="text"
                value={values.gradeName as string || ''}
                onChange={(e) => formMethods.handleChange('gradeName', e.target.value)}
                className="form-input"
                placeholder="Ductile 60-40-18"
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">Grade Code *</label>
              <input
                type="text"
                value={values.gradeCode as string || ''}
                onChange={(e) => formMethods.handleChange('gradeCode', e.target.value)}
                className="form-input"
                placeholder="60-40-18"
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">Grade Type *</label>
              <select
                value={values.gradeType as string || 'DI'}
                onChange={(e) => formMethods.handleChange('gradeType', e.target.value)}
                className="form-select"
              >
                <option value="DI">DI - Ductile Iron</option>
                <option value="CI">CI - Cast Iron</option>
                <option value="SS">SS - Stainless Steel</option>
                <option value="SG">SG - Spheroidal Graphite</option>
                <option value="GI">GI - Gray Iron</option>
              </select>
            </div>
          </div>
        </section>

        {/* DI Specific Parameters */}
        <section className="form-section">
          <div className="form-section-header">
            <h3 className="section-title">DI Specific Parameters</h3>
          </div>
          
          <div className="form-grid-3">
            <div className="form-field">
              <label className="form-label">Tapping Temperature Range (°C)</label>
              <div className="temperature-range">
                <input
                  type="number"
                  value={values.tappingTemperatureMin as number || 1500}
                  onChange={(e) => formMethods.handleChange('tappingTemperatureMin', parseInt(e.target.value))}
                  className="form-input"
                  placeholder="1500"
                />
                <span className="range-separator">-</span>
                <input
                  type="number"
                  value={values.tappingTemperatureMax as number || 1540}
                  onChange={(e) => formMethods.handleChange('tappingTemperatureMax', parseInt(e.target.value))}
                  className="form-input"
                  placeholder="1540"
                />
              </div>
            </div>
            
            <div className="form-field">
              <label className="form-label">Mg Treatment Time (minutes)</label>
              <input
                type="number"
                value={values.mgTreatmentTime as number || 1}
                onChange={(e) => formMethods.handleChange('mgTreatmentTime', parseInt(e.target.value))}
                className="form-input"
                placeholder="1"
              />
              <div className="form-helper">Duration between Mg treatment and beginning of pouring</div>
            </div>
          </div>
        </section>

        {/* Bath Chemistry Decision */}
        <section className="form-section">
          <BathChemistryDecision
            value={bathChemistryDecision}
            onChange={(value) => formMethods.handleChange('bathChemistryDecision', value)}
            rememberChoice={rememberChoice}
            onRememberChoiceChange={(remember) => formMethods.handleChange('rememberChoice', remember)}
          />
        </section>

        {/* Target Chemistry */}
        <section className="form-section">
          <div className="form-section-header">
            <h2 className="section-title">Target Chemistry</h2>
          </div>
          
          <ChemistryTable
            elements={chemistryElements}
            onChange={updateChemistryElements}
            showBathColumns={bathChemistryDecision === 'with'}
          />
        </section>

        {/* Collapsible Advanced Sections */}
        <CollapsibleSection
          title="Set Final-Chemistry Tolerance"
          iconLeft="⚙️"
        >
          <ToleranceSettings
            settings={toleranceSettings}
            onChange={updateToleranceSettings}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Addition/Dilution Settings"
          iconLeft="⚗️"
          iconRight="Power User"
          variant="power-user"
        >
          <MaterialSelection
            materials={materials}
            onChange={updateMaterials}
          />
        </CollapsibleSection>

        {/* Submit Button */}
        <div className="action-bar">
          <div className="action-bar-left">
            <button 
              type="button" 
              onClick={onReset}
              className="btn btn-secondary"
            >
              Reset Form
            </button>
          </div>
          
          <div className="action-bar-right">
            <button type="submit" className="btn btn-primary btn-lg">
              Create Grade
            </button>
          </div>
        </div>
      </form>

      {showSuccessModal && (
        <SuccessModal
          gradeName={values.gradeName as string || 'N/A'}
          gradeType={values.gradeType as string || 'N/A'}
          selectedModules={selectedModules}
          onClose={handleCloseSuccessModal}
        />
      )}
    </div>
  );
};

export default GradeCreatePage;