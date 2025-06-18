import React, { useState } from 'react';
import { ConfigField, FormRenderer } from 'react-form-builder-ts';
import type { SectionedFormModel, FormSection } from '../enhanced-hooks';
import type { SectionedFormReturn } from '../enhanced-hooks/useSectionedForm';

/**
 * Section header component with progress bar and collapsible toggle
 */
export const SectionHeader: React.FC<{
  section: FormSection;
  progress: { completed: number; total: number; percentage: number };
  isCollapsed: boolean;
  onToggle: () => void;
}> = ({ section, progress, isCollapsed, onToggle }) => {
  return (
    <div 
      className={`form-section-header ${section.collapsible ? 'collapsible' : ''}`}
      onClick={section.collapsible ? onToggle : undefined}
    >
      <div className="section-header-content">
        <div className="section-title-area">
          {section.title && (
            <h3 className="section-title">
              {section.collapsible && (
                <span className={`section-toggle ${isCollapsed ? 'collapsed' : ''}`}>
                  ▶
                </span>
              )}
              {section.title}
            </h3>
          )}
          {section.description && (
            <p className="section-description">{section.description}</p>
          )}
        </div>
        
        {progress && (
          <div className="section-progress">
            <div className="progress-text">
              {progress.completed}/{progress.total} fields complete
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Enhanced FormRenderer that supports rendering forms organized by sections
 */
export const SectionedFormRenderer: React.FC<{
  sectionedModel: SectionedFormModel;
  form: SectionedFormReturn;
  showProgress?: boolean;
  renderField?: (field: ConfigField, form: SectionedFormReturn) => React.ReactNode;
  className?: string;
}> = ({ 
  sectionedModel, 
  form, 
  showProgress = true, 
  renderField,
  className 
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(sectionedModel.sections.filter(s => s.collapsed).map(s => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const defaultFieldRenderer = (field: ConfigField, formInstance: SectionedFormReturn) => {
    // This creates a minimal config for the standard FormRenderer to render a single field
    const singleFieldConfig = { fields: [field], lookup: { [field.path]: field } };
    return <FormRenderer config={singleFieldConfig} form={formInstance} />;
  };

  const fieldRenderer = renderField || defaultFieldRenderer;

  return (
    <div className={`sectioned-form ${className || ''} ${sectionedModel.layout?.className || ''}`}>
      {sectionedModel.sections.map(section => {
        const isCollapsed = collapsedSections.has(section.id);
        const sectionFields = form.getSectionFields(section.id);
        const progress = showProgress ? form.getSectionProgress(section.id) : undefined;

        if (!sectionFields.length) return null;

        return (
          <div key={section.id} className={`form-section ${section.className || ''}`}>
            <SectionHeader 
              section={section}
              progress={progress!}
              isCollapsed={isCollapsed}
              onToggle={() => toggleSection(section.id)}
            />
            
            {!isCollapsed && (
              <div className={`section-fields ${section.layout?.className || ''}`}>
                <div 
                  className="fields-grid"
                  style={{
                    gridTemplateColumns: section.layout?.columns 
                      ? `repeat(${section.layout.columns}, 1fr)` 
                      : 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: section.layout?.gap || '1rem'
                  }}
                >
                  {sectionFields.map(field => fieldRenderer(field, form))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 