import React from 'react';

interface BathChemistryDecisionProps {
  value: 'with' | 'without';
  onChange: (value: 'with' | 'without') => void;
  rememberChoice: boolean;
  onRememberChoiceChange: (remember: boolean) => void;
}

export const BathChemistryDecision: React.FC<BathChemistryDecisionProps> = ({
  value,
  onChange,
  rememberChoice,
  onRememberChoiceChange
}) => {
  return (
    <div className="bath-chemistry-decision">
      <div className="decision-header">
        <div className="warning-icon">⚠️</div>
        <h3>Bath Chemistry Decision</h3>
      </div>
      
      <p className="decision-description">
        This choice affects melt-correction algorithms. Choose carefully based on your process requirements.
      </p>

      <div className="statistics-info">
        <div className="info-icon">ℹ️</div>
        <span>
          <strong>72% of customers</strong> use Bath Chemistry for enhanced accuracy.
          <strong>28%</strong> prefer traditional target-only chemistry.
        </span>
      </div>

      <div className="decision-options">
        <label className={`option-card ${value === 'with' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="bathChemistry"
            value="with"
            checked={value === 'with'}
            onChange={() => onChange('with')}
            className="option-radio"
          />
          <div className="option-content">
            <h4>With Bath Chemistry</h4>
            <p>Enable bath range controls and advanced melt correction (Recommended for DI grades)</p>
            <span className="impact-badge high-impact">High Impact</span>
          </div>
        </label>

        <label className={`option-card ${value === 'without' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="bathChemistry"
            value="without"
            checked={value === 'without'}
            onChange={() => onChange('without')}
            className="option-radio"
          />
          <div className="option-content">
            <h4>Without Bath Chemistry</h4>
            <p>Use target chemistry only with standard correction algorithms</p>
          </div>
        </label>
      </div>

      <div className="remember-choice">
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={rememberChoice}
            onChange={(e) => onRememberChoiceChange(e.target.checked)}
            className="remember-checkbox"
          />
          <span>Remember my choice for new grades</span>
        </label>
      </div>
    </div>
  );
};
