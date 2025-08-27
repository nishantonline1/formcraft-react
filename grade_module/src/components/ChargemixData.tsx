import React, { useState } from 'react';
import { ChargemixMaterial, ChargemixData as ChargemixDataType, ModuleType } from '../types';

interface ChargemixDataProps {
  data: ChargemixDataType;
  selectedModules: ModuleType[];
  onChange: (field: keyof ChargemixDataType, value: any) => void;
  onMaterialChange: (materialId: string, field: keyof ChargemixMaterial, value: string | number) => void;
  onAddMaterial: () => void;
  onRemoveMaterial: (materialId: string) => void;
  errors: Record<string, string>;
}

export const ChargemixData: React.FC<ChargemixDataProps> = ({
  data,
  selectedModules,
  onChange,
  onMaterialChange,
  onAddMaterial,
  onRemoveMaterial,
  errors,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isChargemixSelected = selectedModules.includes('IF') || selectedModules.includes('CHARGEMIX');

  if (!isChargemixSelected) {
    return null;
  }

  const totalPercentage = data.materials?.reduce((sum, material) => sum + (material.percentage || 0), 0) || 0;
  const isValidTotal = totalPercentage <= 100;

  return (
    <div className="form-section">
      <div 
        className="form-section-header"
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="form-section-title">
          ⚖️ Chargemix Configuration
          <span style={{ fontSize: 'var(--font-size-sm)', marginLeft: 'var(--spacing-2)' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        </h2>
        <p className="form-section-description">
          Configure chargemix materials and their quantities for optimal furnace operation and cost efficiency.
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
              <span>Enable Chargemix Configuration</span>
            </label>
          </div>

          {data.enabled && (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="chargemix-table">
                  <thead>
                    <tr>
                      <th>Material Name</th>
                      <th>Percentage (%)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.materials?.map((material) => (
                      <tr key={material.id}>
                        <td>
                          <input
                            type="text"
                            value={material.name}
                            onChange={(e) => onMaterialChange(material.id, 'name', e.target.value)}
                            placeholder="Material name"
                            style={{ minWidth: '150px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={material.percentage || ''}
                            onChange={(e) => onMaterialChange(material.id, 'percentage', parseFloat(e.target.value) || 0)}
                            placeholder="0.0"
                            style={{ width: '100px' }}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => onRemoveMaterial(material.id)}
                            disabled={(data.materials?.length || 0) <= 1}
                            title="Remove material"
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
                  onClick={onAddMaterial}
                >
                  ➕ Add Material
                </button>

                <div style={{ textAlign: 'right' }}>
                  <div className={`chargemix-total-indicator ${isValidTotal ? 'valid' : 'invalid'}`}>
                    Total: <strong>{totalPercentage.toFixed(1)}%</strong>
                  </div>
                  {!isValidTotal && (
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--destructive)', marginTop: 'var(--spacing-1)' }}>
                      ⚠️ Total exceeds 100%
                    </div>
                  )}
                  {totalPercentage < 100 && totalPercentage > 0 && (
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--yellow-500)', marginTop: 'var(--spacing-1)' }}>
                      💡 {(100 - totalPercentage).toFixed(1)}% remaining
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
                backgroundColor: 'var(--muted)', 
                borderRadius: 'var(--radius-md)' 
              }}>
                <h4 style={{ margin: '0 0 var(--spacing-2) 0', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  💡 Chargemix Guidelines
                </h4>
                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>
                  <li>Total percentage should not exceed 100%</li>
                  <li>Material names must be unique within the chargemix</li>
                  <li>Consider typical ratios: Steel Scrap (40-50%), Pig Iron (30-40%), Returns (10-30%)</li>
                  <li>Percentages can be adjusted during production based on availability and cost</li>
                  <li>Each material percentage must be a positive value</li>
                </ul>
              </div>

              {/* Material Cost Estimation */}
              <div style={{ 
                marginTop: 'var(--spacing-4)', 
                padding: 'var(--spacing-3)', 
                backgroundColor: 'var(--yellow-100)', 
                borderRadius: 'var(--radius-md)' 
              }}>
                <h4 style={{ margin: '0 0 var(--spacing-2) 0', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  📊 Material Distribution
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-2)' }}>
                  {data.materials?.map((material) => (
                    material.name && material.percentage > 0 && (
                      <div key={material.id} style={{ 
                        padding: 'var(--spacing-2)', 
                        backgroundColor: 'white', 
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                          {material.name}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-lg)', color: 'var(--primary)' }}>
                          {material.percentage.toFixed(1)}%
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};


