import React from 'react';
import type { ToleranceSettings as ToleranceSettingsType } from '../pages/create/types';

interface ToleranceSettingsProps {
  settings: ToleranceSettingsType[];
  onChange: (settings: ToleranceSettingsType[]) => void;
}

export const ToleranceSettings: React.FC<ToleranceSettingsProps> = ({
  settings,
  onChange
}) => {
  const updateSetting = (index: number, field: keyof ToleranceSettingsType, value: number) => {
    const updatedSettings = [...settings];
    updatedSettings[index] = { ...updatedSettings[index], [field]: value };
    onChange(updatedSettings);
  };

  return (
    <div className="tolerance-settings">
      <div className="tolerance-explanation">
        <h4>What is Tolerance?</h4>
        <p>
          Tolerance is like a "safety margin" for your final chemistry values. It allows small variations 
          from your target ranges without affecting quality. If your target is 3.45-3.55 and you set 
          tolerance to ±0.05, the acceptable range becomes 3.40-3.60.
        </p>
        
        <div className="tolerance-example">
          <h5>Example: C Reading vs Target</h5>
          <div className="example-content">
            <div className="target-info">Target: 3.45 - 3.55 | Tolerance: 3.40 - 3.60</div>
            
            <div className="reading-examples">
              <div className="reading-item within-target">
                <span className="reading-value">Reading: 3.50</span>
                <span className="status-badge">● Within Target</span>
              </div>
              <div className="reading-item within-tolerance">
                <span className="reading-value">Reading: 3.42</span>
                <span className="status-badge">● Within Tolerance</span>
              </div>
              <div className="reading-item out-of-range">
                <span className="reading-value">Reading: 3.35</span>
                <span className="status-badge">● Out of Range</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="tolerance-note">
          <strong>Note:</strong> Tolerance affects Final chemistry only. Bath ranges remain unchanged.
        </p>
        <p className="usage-stats">26% of grades use custom tolerance settings.</p>
      </div>

      <div className="tolerance-controls">
        {settings.map((setting, index) => (
          <div key={setting.element} className="tolerance-element">
            <div className="element-header">
              <span className="element-symbol">{setting.element}</span>
              <span className="element-title">{setting.element} Tolerance</span>
            </div>
            
            <div className="base-range">
              <span className="range-label">Base: {setting.baseMin} - {setting.baseMax}</span>
            </div>
            
            <div className="tolerance-inputs">
              <div className="input-group">
                <label>Min</label>
                <input
                  type="number"
                  step="0.01"
                  value={setting.toleranceMin}
                  onChange={(e) => updateSetting(index, 'toleranceMin', parseFloat(e.target.value) || 0)}
                  className="tolerance-input"
                />
              </div>
              
              <span className="range-separator">-</span>
              
              <div className="input-group">
                <label>Max</label>
                <input
                  type="number"
                  step="0.01"
                  value={setting.toleranceMax}
                  onChange={(e) => updateSetting(index, 'toleranceMax', parseFloat(e.target.value) || 0)}
                  className="tolerance-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
