import React from 'react';

interface BTCDecisionGateProps {
  withBathChemistry: boolean | null;
  rememberChoice: boolean;
  onDecisionChange: (withBath: boolean) => void;
  onRememberChange: (remember: boolean) => void;
  error?: string;
}

export const BTCDecisionGate: React.FC<BTCDecisionGateProps> = ({
  withBathChemistry,
  rememberChoice,
  onDecisionChange,
  onRememberChange,
  error,
}) => {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <h2 className="form-section-title">Bath Chemistry Configuration</h2>
        <p className="form-section-description">
          Choose whether to include bath chemistry specifications for this grade. 
          This decision affects the available configuration options in the next steps.
        </p>
      </div>

      <div className="btc-decision-cards">
        <div
          className={`btc-decision-card ${withBathChemistry === true ? 'selected' : ''}`}
          onClick={() => onDecisionChange(true)}
        >
          <div className="btc-decision-card-title">
            🧪 With Bath Chemistry
          </div>
          <div className="btc-decision-card-description">
            Include bath chemistry specifications for precise control over the melting process. 
            This provides more detailed configuration options and better quality control.
          </div>
          <div style={{ marginTop: 'var(--spacing-3)', fontSize: 'var(--font-size-xs)', color: 'var(--green-500)' }}>
            ✓ Enhanced quality control<br />
            ✓ Precise process optimization<br />
            ✓ Advanced monitoring capabilities
          </div>
        </div>

        <div
          className={`btc-decision-card ${withBathChemistry === false ? 'selected' : ''}`}
          onClick={() => onDecisionChange(false)}
        >
          <div className="btc-decision-card-title">
            📊 Without Bath Chemistry
          </div>
          <div className="btc-decision-card-description">
            Use final chemistry targets only. This provides a simplified configuration 
            focused on the end product specifications.
          </div>
          <div style={{ marginTop: 'var(--spacing-3)', fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>
            ✓ Simplified configuration<br />
            ✓ Faster setup process<br />
            ✓ Final product focus
          </div>
        </div>
      </div>

      {error && (
        <div className="form-error" style={{ textAlign: 'center', marginTop: 'var(--spacing-3)' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center' }}>
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={rememberChoice}
            onChange={(e) => onRememberChange(e.target.checked)}
          />
          <span>Remember my choice for future grades</span>
        </label>
        <div className="form-helper" style={{ marginTop: 'var(--spacing-1)' }}>
          This preference will be saved for new grade creation sessions
        </div>
      </div>

      {withBathChemistry !== null && (
        <div style={{ 
          marginTop: 'var(--spacing-4)', 
          padding: 'var(--spacing-3)', 
          backgroundColor: 'var(--muted)', 
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
            You have selected: <strong>
              {withBathChemistry ? 'With Bath Chemistry' : 'Without Bath Chemistry'}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
};


