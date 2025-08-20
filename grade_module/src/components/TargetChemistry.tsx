import React from 'react';
import { ChemicalElement } from '../types';

interface TargetChemistryProps {
  elements: ChemicalElement[];
  withBathChemistry: boolean;
  onElementChange: (elementId: string, field: keyof ChemicalElement, value: number | string) => void;
  onAddElement: () => void;
  onRemoveElement: (elementId: string) => void;
  errors: Record<string, string>;
}

export const TargetChemistry: React.FC<TargetChemistryProps> = ({
  elements,
  withBathChemistry,
  onElementChange,
  onAddElement,
  onRemoveElement,
  errors,
}) => {
  const totalPercentage = elements.reduce((sum, element) => sum + (element.finalMax || 0), 0);

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h2 className="form-section-title">Target Chemistry Configuration</h2>
        <p className="form-section-description">
          Configure chemical element specifications and tolerances for this grade.
          {withBathChemistry ? ' Bath chemistry values are included for enhanced control.' : ' Only final chemistry targets are configured.'}
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="chemistry-table">
          <thead>
            <tr>
              <th>Element</th>
              <th>Final Min (%)</th>
              <th>Final Max (%)</th>
              {withBathChemistry && (
                <>
                  <th>Bath Min (%)</th>
                  <th>Bath Max (%)</th>
                </>
              )}
              <th className="tolerance-cell">Tolerance Min (%)</th>
              <th className="tolerance-cell">Tolerance Max (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {elements.map((element) => (
              <tr key={element.id} className={element.element === 'C' ? 'carbon-row' : ''}>
                <td>
                  <input
                    type="text"
                    value={element.element}
                    onChange={(e) => onElementChange(element.id, 'element', e.target.value.toUpperCase())}
                    placeholder="Element"
                    style={{ width: '80px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={element.finalMin || ''}
                    onChange={(e) => onElementChange(element.id, 'finalMin', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={element.finalMax || ''}
                    onChange={(e) => onElementChange(element.id, 'finalMax', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </td>
                {withBathChemistry && (
                  <>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={element.bathMin || ''}
                        onChange={(e) => onElementChange(element.id, 'bathMin', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={element.bathMax || ''}
                        onChange={(e) => onElementChange(element.id, 'bathMax', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </td>
                  </>
                )}
                <td className={element.element === 'C' ? 'tolerance-cell' : ''}>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max="10"
                    value={element.toleranceMin || ''}
                    onChange={(e) => onElementChange(element.id, 'toleranceMin', parseFloat(e.target.value) || 0)}
                    placeholder="0.000"
                  />
                </td>
                <td className={element.element === 'C' ? 'tolerance-cell' : ''}>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max="10"
                    value={element.toleranceMax || ''}
                    onChange={(e) => onElementChange(element.id, 'toleranceMax', parseFloat(e.target.value) || 0)}
                    placeholder="0.000"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onRemoveElement(element.id)}
                    disabled={elements.length <= 1}
                    title="Remove element"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onAddElement}
        >
          ➕ Add Element
        </button>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
            Total Max: <strong>{totalPercentage.toFixed(2)}%</strong>
          </div>
          {totalPercentage > 100 && (
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--destructive)', marginTop: 'var(--spacing-1)' }}>
              ⚠️ Total exceeds 100%
            </div>
          )}
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div style={{ marginTop: 'var(--spacing-4)' }}>
          {Object.entries(errors).map(([field, message]) => (
            <div key={field} className="form-error">
              {message}
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: 'var(--spacing-4)', 
        padding: 'var(--spacing-3)', 
        backgroundColor: 'var(--yellow-100)', 
        borderRadius: 'var(--radius-md)' 
      }}>
        <h4 style={{ margin: '0 0 var(--spacing-2) 0', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
          💡 Chemistry Configuration Tips
        </h4>
        <ul style={{ margin: 0, paddingLeft: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>
          <li>Carbon tolerance cells are highlighted in yellow for special attention</li>
          <li>Ensure Min values are less than Max values for each element</li>
          <li>Tolerance values must be positive and realistic for your process</li>
          {withBathChemistry && <li>Bath chemistry ranges typically exceed final ranges to account for process losses</li>}
          <li>Total percentage is calculated from maximum final values</li>
        </ul>
      </div>
    </div>
  );
};


