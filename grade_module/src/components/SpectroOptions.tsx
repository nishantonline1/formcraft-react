import React, { useState } from 'react';
import { SpectroOptions as SpectroOptionsType, ModuleType } from '../types';

interface SpectroOptionsProps {
  data: SpectroOptionsType;
  selectedModules: ModuleType[];
  onChange: (field: keyof SpectroOptionsType, value: any) => void;
  errors: Record<string, string>;
}

const availableElements = [
  { value: 'C', label: 'Carbon (C)' },
  { value: 'Si', label: 'Silicon (Si)' },
  { value: 'Mn', label: 'Manganese (Mn)' },
  { value: 'P', label: 'Phosphorus (P)' },
  { value: 'S', label: 'Sulfur (S)' },
  { value: 'Cr', label: 'Chromium (Cr)' },
  { value: 'Ni', label: 'Nickel (Ni)' },
  { value: 'Mo', label: 'Molybdenum (Mo)' },
  { value: 'Cu', label: 'Copper (Cu)' },
  { value: 'Al', label: 'Aluminum (Al)' },
  { value: 'Ti', label: 'Titanium (Ti)' },
  { value: 'V', label: 'Vanadium (V)' },
];

export const SpectroOptions: React.FC<SpectroOptionsProps> = ({
  data,
  selectedModules,
  onChange,
  errors,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSpectroSelected = selectedModules.includes('SPECTRO');

  if (!isSpectroSelected) {
    return null;
  }

  const handleElementToggle = (element: string) => {
    const currentElements = data.elements || [];
    const newElements = currentElements.includes(element)
      ? currentElements.filter(e => e !== element)
      : [...currentElements, element];
    onChange('elements', newElements);
  };

  const handleMaterialChange = (type: 'addition' | 'dilution', materials: string[]) => {
    const field = type === 'addition' ? 'additionMaterials' : 'dilutionMaterials';
    onChange(field, materials);
  };

  const addMaterial = (type: 'addition' | 'dilution') => {
    const field = type === 'addition' ? 'additionMaterials' : 'dilutionMaterials';
    const currentMaterials = data[field] || [];
    const newMaterial = prompt(`Enter ${type} material name:`);
    if (newMaterial && !currentMaterials.includes(newMaterial)) {
      handleMaterialChange(type, [...currentMaterials, newMaterial]);
    }
  };

  const removeMaterial = (type: 'addition' | 'dilution', material: string) => {
    const field = type === 'addition' ? 'additionMaterials' : 'dilutionMaterials';
    const currentMaterials = data[field] || [];
    handleMaterialChange(type, currentMaterials.filter(m => m !== material));
  };

  return (
    <div className="form-section">
      <div 
        className="form-section-header"
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="form-section-title">
          🔬 Spectroscopic Analysis Options
          <span style={{ fontSize: 'var(--font-size-sm)', marginLeft: 'var(--spacing-2)' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        </h2>
        <p className="form-section-description">
          Configure advanced spectroscopic analysis parameters for precise element detection and quality control.
        </p>
      </div>

      {isExpanded && (
        <>
          <div className="form-field">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={data.enabled}
                onChange={(e) => onChange('enabled', e.target.checked)}
              />
              <span>Enable Spectroscopic Analysis</span>
            </label>
          </div>

          {data.enabled && (
            <>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Analysis Elements</label>
                  <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: 'var(--spacing-3)' 
                  }}>
                    {availableElements.map((element) => (
                      <label key={element.value} className="form-checkbox" style={{ marginBottom: 'var(--spacing-2)' }}>
                        <input
                          type="checkbox"
                          checked={data.elements?.includes(element.value) || false}
                          onChange={() => handleElementToggle(element.value)}
                        />
                        <span>{element.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.elements && <div className="form-error">{errors.elements}</div>}
                  <div className="form-helper">
                    Selected: {data.elements?.length || 0} elements
                  </div>
                </div>

                <div>
                  <div className="form-field">
                    <label className="form-label">Raw Material Percentage Range</label>
                    <div className="form-grid-2">
                      <div>
                        <input
                          type="number"
                          className={`form-input ${errors.rawMaterialMinPercentage ? 'error' : ''}`}
                          value={data.rawMaterialMinPercentage || ''}
                          onChange={(e) => onChange('rawMaterialMinPercentage', parseFloat(e.target.value))}
                          placeholder="Min %"
                          min={0}
                          max={100}
                          step={0.1}
                        />
                        <div className="form-helper">Minimum %</div>
                      </div>
                      <div>
                        <input
                          type="number"
                          className={`form-input ${errors.rawMaterialMaxPercentage ? 'error' : ''}`}
                          value={data.rawMaterialMaxPercentage || ''}
                          onChange={(e) => onChange('rawMaterialMaxPercentage', parseFloat(e.target.value))}
                          placeholder="Max %"
                          min={0}
                          max={100}
                          step={0.1}
                        />
                        <div className="form-helper">Maximum %</div>
                      </div>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="analysisFrequency">
                      Analysis Frequency (minutes)
                    </label>
                    <input
                      id="analysisFrequency"
                      type="number"
                      className={`form-input ${errors.analysisFrequency ? 'error' : ''}`}
                      value={data.analysisFrequency || ''}
                      onChange={(e) => onChange('analysisFrequency', parseFloat(e.target.value))}
                      placeholder="15"
                      min={1}
                      max={60}
                      step={1}
                    />
                    {errors.analysisFrequency && <div className="form-error">{errors.analysisFrequency}</div>}
                    <div className="form-helper">
                      How often to perform automatic analysis (1-60 minutes)
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 'var(--spacing-4)' }}>
                <div className="form-field">
                  <label className="form-label">Addition Materials</label>
                  <div style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: 'var(--spacing-3)' 
                  }}>
                    {data.additionMaterials?.map((material, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
                        <span>{material}</span>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeMaterial('addition', material)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => addMaterial('addition')}
                    >
                      ➕ Add Material
                    </button>
                  </div>
                  <div className="form-helper">
                    Materials that can be added during the process
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Dilution Materials</label>
                  <div style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: 'var(--spacing-3)' 
                  }}>
                    {data.dilutionMaterials?.map((material, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
                        <span>{material}</span>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeMaterial('dilution', material)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => addMaterial('dilution')}
                    >
                      ➕ Add Material
                    </button>
                  </div>
                  <div className="form-helper">
                    Materials used for dilution purposes
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};


