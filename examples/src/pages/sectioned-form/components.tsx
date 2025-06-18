import React from 'react';
import type { UseFormReturn, SectionGroup, SectionProgress, FieldProps, FieldSection } from '@dynamic_forms/react';
import { sections } from './model';

/**
 * Props for field renderer
 */
interface FieldRendererProps {
  field: FieldProps;
  form: UseFormReturn;
}

/**
 * Render individual field component
 */
export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, form }) => {
  const value = form.values[field.key] || '';
  const errors = form.errors[field.key] || [];
  const isVisible = form.isFieldVisible(field.key);

  if (!isVisible) return null;

  return (
    <div key={field.key} className="form-field">
      <label htmlFor={field.key} className="field-label">
        {field.label}
        {field.validators?.required && <span className="required">*</span>}
      </label>
      
      {field.type === 'checkbox' ? (
        <input
          id={field.key}
          type="checkbox"
          checked={!!value}
          onChange={(e) => form.handleChange(field.key, e.target.checked)}
          className="field-input checkbox"
        />
      ) : field.type === 'select' ? (
        <select
          id={field.key}
          value={String(value)}
          onChange={(e) => form.handleChange(field.key, e.target.value)}
          className="field-input select"
        >
          <option value="">Select...</option>
          <option value="all">All notifications</option>
          <option value="important">Important only</option>
          <option value="none">None</option>
        </select>
      ) : (
        <input
          id={field.key}
          type={field.type === 'number' ? 'number' : 'text'}
          value={String(value)}
          onChange={(e) => form.handleChange(field.key, e.target.value)}
          onBlur={() => form.handleBlur(field.key)}
          className="field-input"
        />
      )}
      
      {errors.length > 0 && (
        <div className="field-errors">
          {errors.map((error, idx) => (
            <span key={idx} className="error">{error}</span>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Props for section header
 */
interface SectionHeaderProps {
  section: FieldSection;
  progress?: SectionProgress;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

/**
 * Custom section header component with progress
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  section,
  progress,
  isCollapsed,
  onToggle
}) => {
  // Skip header for sections without title
  if (!section.title && !section.description) return null;

  return (
    <div className="custom-section-header">
      <div className="header-main">
        {section.collapsible !== false && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="section-toggle-btn"
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? '📁' : '📂'}
          </button>
        )}
        
        <div className="header-content">
          <h3 className="section-title">{section.title}</h3>
          {section.description && (
            <p className="section-description">{section.description}</p>
          )}
        </div>
        
        {progress && (
          <div className="section-progress-badge">
            <div className="progress-circle">
              <span className="progress-percentage">{progress.percentage}%</span>
            </div>
            <div className="progress-details">
              <span className="progress-count">{progress.completed}/{progress.total}</span>
              {progress.hasErrors && <span className="error-indicator">⚠️</span>}
            </div>
          </div>
        )}
      </div>
      
      {progress && progress.total > 0 && (
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className={`progress-fill ${progress.hasErrors ? 'has-errors' : ''}`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Props for section wrapper
 */
interface SectionWrapperProps {
  section: FieldSection;
  isCollapsed?: boolean;
  children: React.ReactNode;
}

/**
 * Custom section wrapper component
 */
export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  section,
  isCollapsed,
  children
}) => {
  const wrapperClass = `custom-section-wrapper ${section.className || ''} ${isCollapsed ? 'collapsed' : 'expanded'}`;
  
  const gridStyle: React.CSSProperties = {};
  if (section.layout?.columns) {
    gridStyle.display = 'grid';
    gridStyle.gridTemplateColumns = `repeat(${section.layout.columns}, 1fr)`;
    gridStyle.gap = section.layout.gap || '1rem';
  }

  return (
    <div className={wrapperClass}>
      <div className="section-content" style={gridStyle}>
        {!isCollapsed && children}
      </div>
    </div>
  );
};

/**
 * Props for full featured form
 */
interface FullFeaturedFormProps {
  sectionsHook: ReturnType<typeof import('./hooks').useSectionedFormDemo>['sections'];
  form: UseFormReturn;
}

/**
 * Full featured sectioned form component
 */
export const FullFeaturedForm: React.FC<FullFeaturedFormProps> = ({
  sectionsHook,
  form
}) => (
  <form className="sectioned-form">
    {sectionsHook.sections.map((sectionGroup: SectionGroup) => (
      <div key={sectionGroup.section.id} className="section-container">
        <SectionHeader
          section={sectionGroup.section}
          progress={sectionsHook.getSectionProgress(sectionGroup.section.id)}
          isCollapsed={sectionGroup.isCollapsed}
          onToggle={() => sectionsHook.toggleSection(sectionGroup.section.id)}
        />
        
        <SectionWrapper
          section={sectionGroup.section}
          isCollapsed={sectionGroup.isCollapsed}
        >
          {sectionGroup.fields.map((field) => (
            <FieldRenderer key={field.key} field={field} form={form} />
          ))}
        </SectionWrapper>
      </div>
    ))}
  </form>
);

/**
 * Props for headerless form
 */
interface HeaderlessFormProps {
  sectionsHook: ReturnType<typeof import('./hooks').useHeaderlessFormDemo>['sections'];
  form: UseFormReturn;
}

/**
 * Headerless sectioned form component
 */
export const HeaderlessForm: React.FC<HeaderlessFormProps> = ({
  sectionsHook,
  form
}) => (
  <form className="headerless-form">
    {sectionsHook.sections.map((sectionGroup: SectionGroup) => (
      <div key={sectionGroup.section.id} className="fields-group">
        {sectionGroup.fields.map((field) => (
          <FieldRenderer key={field.key} field={field} form={form} />
        ))}
      </div>
    ))}
  </form>
);

/**
 * Props for flat form
 */
interface FlatFormProps {
  sectionsHook: ReturnType<typeof import('./hooks').useFlatFormDemo>['sections'];
  form: UseFormReturn;
}

/**
 * Flat form component
 */
export const FlatForm: React.FC<FlatFormProps> = ({
  sectionsHook,
  form
}) => (
  <form className="flat-form">
    {sectionsHook.getVisibleFields().map((field: FieldProps) => (
      <FieldRenderer key={field.key} field={field} form={form} />
    ))}
  </form>
);

/**
 * Props for section controls
 */
interface SectionControlsProps {
  sectionsHook: ReturnType<typeof import('./hooks').useSectionedFormDemo>['sections'];
  allProgress: SectionProgress[];
}

/**
 * Section controls component
 */
export const SectionControls: React.FC<SectionControlsProps> = ({
  sectionsHook,
  allProgress
}) => (
  <div className="section-controls">
    <h3>Section Controls</h3>
    <div className="controls-buttons">
      <button 
        type="button" 
        onClick={sectionsHook.expandAll}
        className="control-btn"
      >
        Expand All
      </button>
      <button 
        type="button" 
        onClick={sectionsHook.collapseAll}
        className="control-btn"
      >
        Collapse All
      </button>
    </div>
    
    <div className="overall-progress">
      <h4>Overall Progress</h4>
      {allProgress.map((progress) => (
        <div key={progress.sectionId} className="progress-item">
          <span className="progress-label">
            {sections.find(s => s.id === progress.sectionId)?.title || progress.sectionId}:
          </span>
          <span className="progress-value">
            {progress.percentage}% ({progress.completed}/{progress.total})
            {progress.hasErrors && ' ⚠️'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Props for debug section
 */
interface DebugSectionProps {
  values: Record<string, unknown>;
}

/**
 * Debug section component
 */
export const DebugSection: React.FC<DebugSectionProps> = ({ values }) => (
  <div className="debug-section">
    <h3>Form Values</h3>
    <pre>{JSON.stringify(values, null, 2)}</pre>
  </div>
); 