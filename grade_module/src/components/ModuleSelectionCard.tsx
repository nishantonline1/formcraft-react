import React from 'react';
import { moduleInfo } from '../pages/create/models';
import type { ModuleInfoMap } from '../pages/create/types';

interface ModuleSelectionCardProps {
  moduleKey: keyof ModuleInfoMap;
  isSelected: boolean;
  onToggle: (moduleKey: string) => void;
}

export const ModuleSelectionCard: React.FC<ModuleSelectionCardProps> = ({
  moduleKey,
  isSelected,
  onToggle
}) => {
  const module = moduleInfo[moduleKey];

  return (
    <div 
      className={`module-card ${isSelected ? 'selected' : ''} ${module.isDefault ? 'default' : 'optional'}`}
      onClick={() => onToggle(moduleKey)}
    >
      <div className="module-header">
        <div className="module-checkbox-wrapper">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(moduleKey)}
            className="module-checkbox"
          />
          <span className="module-icon">{module.icon}</span>
        </div>
        <div className="module-title">
          <h3>{module.shortName || moduleKey}</h3>
          <p className="module-subtitle">{module.name}</p>
        </div>
      </div>
      
      <div className="module-content">
        <p className="module-description">{module.description}</p>
        
        <div className="module-features">
          {module.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <span className="feature-bullet">•</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
