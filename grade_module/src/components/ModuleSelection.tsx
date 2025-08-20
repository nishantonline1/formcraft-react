import React from 'react';
import { ModuleType } from '../types';
import { AVAILABLE_MODULES } from '../utils';

interface ModuleSelectionProps {
  selectedModules: ModuleType[];
  onToggleModule: (module: ModuleType) => void;
}

export const ModuleSelection: React.FC<ModuleSelectionProps> = ({
  selectedModules,
  onToggleModule,
}) => {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <h2 className="form-section-title">Select Processing Modules</h2>
        <p className="form-section-description">
          Choose the processing modules you want to configure for this grade. Each module provides 
          specific functionality for different aspects of the production process.
        </p>
      </div>

      <div className="module-selection-grid">
        {Object.values(AVAILABLE_MODULES).map((module) => (
          <div
            key={module.id}
            className={`module-card ${selectedModules.includes(module.id) ? 'selected' : ''}`}
            onClick={() => onToggleModule(module.id)}
          >
            <div className="module-card-header">
              <span className="module-card-icon">{module.icon}</span>
              <h3 className="module-card-title">{module.name}</h3>
            </div>
            
            <p className="module-card-description">{module.description}</p>
            
            <ul className="module-card-features">
              {module.features.map((feature, index) => (
                <li key={index} className="module-card-feature">
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="module-card-business-impact">
              <small style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
                {module.businessImpact}
              </small>
            </div>
            
            <input
              type="checkbox"
              className="module-card-checkbox"
              checked={selectedModules.includes(module.id)}
              onChange={() => onToggleModule(module.id)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ))}
      </div>

      {selectedModules.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
            Selected modules: {selectedModules.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};


