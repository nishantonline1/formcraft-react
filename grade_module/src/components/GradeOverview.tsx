import React from 'react';
import { GradeOverview as GradeOverviewType, GradeType } from '../types';

interface GradeOverviewProps {
  data: Partial<GradeOverviewType>;
  onChange: (field: keyof GradeOverviewType, value: string | number) => void;
  errors: Record<string, string>;
}

const gradeTypeOptions: { value: GradeType; label: string }[] = [
  { value: 'DI', label: 'Ductile Iron' },
  { value: 'CI', label: 'Cast Iron' },
  { value: 'SS', label: 'Stainless Steel' },
  { value: 'SG', label: 'Spheroidal Graphite' },
  { value: 'GI', label: 'Gray Iron' },
];

export const GradeOverview: React.FC<GradeOverviewProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <h2 className="form-section-title">Grade Overview</h2>
        <p className="form-section-description">
          Configure the basic information and parameters for this grade.
        </p>
      </div>

      <div className="form-grid-2">
        {/* Left Column */}
        <div>
          <div className="form-field">
            <label className="form-label" htmlFor="tagId">
              Tag ID *
            </label>
            <input
              id="tagId"
              type="text"
              className={`form-input ${errors.tagId ? 'error' : ''}`}
              value={data.tagId || ''}
              onChange={(e) => onChange('tagId', e.target.value.toUpperCase())}
              placeholder="e.g., GRADE_001"
              pattern="[A-Z0-9_-]+"
              title="Only uppercase letters, numbers, underscore, and hyphen allowed"
            />
            {errors.tagId && <div className="form-error">{errors.tagId}</div>}
            <div className="form-helper">
              Unique identifier for the grade (3-20 characters, alphanumeric)
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="gradeName">
              Grade Name *
            </label>
            <input
              id="gradeName"
              type="text"
              className={`form-input ${errors.gradeName ? 'error' : ''}`}
              value={data.gradeName || ''}
              onChange={(e) => onChange('gradeName', e.target.value)}
              placeholder="e.g., High Strength Ductile Iron"
              maxLength={50}
            />
            {errors.gradeName && <div className="form-error">{errors.gradeName}</div>}
            <div className="form-helper">
              Descriptive name for the grade (max 50 characters)
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="gradeType">
              Grade Type *
            </label>
            <select
              id="gradeType"
              className={`form-select ${errors.gradeType ? 'error' : ''}`}
              value={data.gradeType || ''}
              onChange={(e) => onChange('gradeType', e.target.value as GradeType)}
            >
              <option value="">Select grade type...</option>
              {gradeTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.gradeType && <div className="form-error">{errors.gradeType}</div>}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="form-field">
            <label className="form-label">Temperature Range (°C) *</label>
            <div className="form-grid-2">
              <div>
                <input
                  type="number"
                  className={`form-input ${errors.tappingTemperatureMin ? 'error' : ''}`}
                  value={data.tappingTemperatureMin || ''}
                  onChange={(e) => onChange('tappingTemperatureMin', parseFloat(e.target.value))}
                  placeholder="Min temp"
                  min={800}
                  max={2000}
                  step={1}
                />
                <div className="form-helper">Min (800-2000°C)</div>
              </div>
              <div>
                <input
                  type="number"
                  className={`form-input ${errors.tappingTemperatureMax ? 'error' : ''}`}
                  value={data.tappingTemperatureMax || ''}
                  onChange={(e) => onChange('tappingTemperatureMax', parseFloat(e.target.value))}
                  placeholder="Max temp"
                  min={800}
                  max={2000}
                  step={1}
                />
                <div className="form-helper">Max (800-2000°C)</div>
              </div>
            </div>
            {(errors.tappingTemperatureMin || errors.tappingTemperatureMax) && (
              <div className="form-error">
                {errors.tappingTemperatureMin || errors.tappingTemperatureMax}
              </div>
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="form-select"
              value={data.status || 'Active'}
              onChange={(e) => onChange('status', e.target.value as 'Active' | 'Inactive')}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Additional fields for Ductile Iron */}
          {data.gradeType === 'DI' && (
            <div style={{ 
              padding: 'var(--spacing-3)', 
              backgroundColor: 'var(--yellow-100)', 
              borderRadius: 'var(--radius-md)',
              marginTop: 'var(--spacing-3)'
            }}>
              <h4 style={{ margin: '0 0 var(--spacing-2) 0', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                Ductile Iron Specific Configuration
              </h4>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--muted-foreground)' }}>
                Additional configuration options will be available in the Target Chemistry section for Ductile Iron grades.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


