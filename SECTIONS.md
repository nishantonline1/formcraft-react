# Form Sections Guide

This guide shows you how to handle sections/groups in Form models and hooks for flexible rendering with or without headers.

## 🚀 Quick Start

```typescript
import {
  useForm,
  useSections,
  FormModel,
  FieldSection,
} from 'react-form-builder-ts';

// 1. Define your form model with section assignments
const formModel: FormModel = [
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    section: { sectionId: 'personal', order: 1 },
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    section: { sectionId: 'personal', order: 2 },
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email',
    section: { sectionId: 'contact', order: 1 },
  },
];

// 2. Use the form and sections hooks
const form = useForm(formModel);
const sections = useSections(formModel, form);

// 3. Render your sections however you want!
```

## 📋 Table of Contents

- [Core Concepts](#core-concepts)
- [Section Definition](#section-definition)
- [Rendering Approaches](#rendering-approaches)
- [Advanced Features](#advanced-features)
- [Complete Examples](#complete-examples)

## 🎯 Core Concepts

### Section Assignment in Fields

```typescript
interface FieldProps {
  // ... other properties
  section?: {
    sectionId: string; // Required: which section this field belongs to
    order?: number; // Optional: order within the section
  };
}
```

### Section Configuration

```typescript
interface FieldSection {
  id: string; // Unique section identifier
  title?: string; // Optional: section header title
  description?: string; // Optional: section description
  collapsible?: boolean; // Optional: can be collapsed/expanded
  collapsed?: boolean; // Optional: start collapsed
  className?: string; // Optional: CSS class
  layout?: {
    // Optional: section layout
    columns?: number; // Grid columns
    gap?: string; // CSS gap value
    className?: string; // Layout CSS class
  };
}
```

## 📦 Section Definition

### Method 1: Inline Section Definition

Define sections directly in field metadata:

```typescript
const formModel: FormModel = [
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    section: { sectionId: 'personal' },
    meta: {
      sectionConfig: {
        title: 'Personal Information',
        description: 'Basic details about yourself',
        collapsible: true,
        layout: { columns: 2 },
      },
    },
  },
];
```

### Method 2: Explicit Sectioned Model

Define sections separately for better organization:

```typescript
import { SectionedFormModel } from 'react-form-builder-ts';

const sections: FieldSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic details about yourself',
    collapsible: true,
    layout: { columns: 2, gap: '1rem' },
  },
  {
    id: 'contact',
    title: 'Contact Information',
    collapsible: true,
    layout: { columns: 1 },
  },
];

const sectionedModel: SectionedFormModel = {
  sections,
  fields: formModel,
  layout: {
    orientation: 'vertical',
    renderMode: 'grouped',
  },
};

const sectionsHook = useSections(sectionedModel, form);
```

## 🎨 Rendering Approaches

### 1. Full Featured Sections (With Headers)

Complete sections with headers, progress, and collapsible behavior:

```typescript
function FullFeaturedForm() {
  const form = useForm(formModel);
  const sections = useSections(sectionedModel, form);

  return (
    <form>
      {sections.sections.map((sectionGroup) => (
        <div key={sectionGroup.section.id} className="section-container">
          {/* Render Section Header */}
          {sectionGroup.section.title && (
            <div className="section-header">
              {sectionGroup.section.collapsible && (
                <button
                  type="button"
                  onClick={() => sections.toggleSection(sectionGroup.section.id)}
                >
                  {sectionGroup.isCollapsed ? '▶' : '▼'}
                </button>
              )}
              <h3>{sectionGroup.section.title}</h3>
              {sectionGroup.section.description && (
                <p>{sectionGroup.section.description}</p>
              )}

              {/* Progress Indicator */}
              {(() => {
                const progress = sections.getSectionProgress(sectionGroup.section.id);
                return (
                  <div className="progress">
                    {progress.percentage}% ({progress.completed}/{progress.total})
                    {progress.hasErrors && ' ⚠️'}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Render Section Fields */}
          {!sectionGroup.isCollapsed && (
            <div
              className="section-fields"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${sectionGroup.section.layout?.columns || 1}, 1fr)`,
                gap: sectionGroup.section.layout?.gap || '1rem'
              }}
            >
              {sectionGroup.fields.map((field) =>
                renderField(field, form)
              )}
            </div>
          )}
        </div>
      ))}
    </form>
  );
}
```

### 2. Headerless Sections (Fields Only)

Render grouped fields without section headers:

```typescript
function HeaderlessForm() {
  const form = useForm(formModel);
  const sections = useSections(formModel, form);

  return (
    <form>
      {sections.sections.map((sectionGroup) => (
        <div
          key={sectionGroup.section.id}
          className="fields-group"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${sectionGroup.section.layout?.columns || 1}, 1fr)`,
            gap: sectionGroup.section.layout?.gap || '1rem',
            marginBottom: '2rem'
          }}
        >
          {sectionGroup.fields.map((field) =>
            renderField(field, form)
          )}
        </div>
      ))}
    </form>
  );
}
```

### 3. Flat Layout (No Section Grouping)

Render all fields in sequence without section containers:

```typescript
function FlatForm() {
  const form = useForm(formModel);
  const sections = useSections(formModel, form);

  return (
    <form className="flat-form">
      {sections.getVisibleFields().map((field) =>
        renderField(field, form)
      )}
    </form>
  );
}
```

### 4. Mixed Layout (Some Sections, Some Flat)

Selectively render some sections with headers and others flat:

```typescript
function MixedForm() {
  const form = useForm(formModel);
  const sections = useSections(formModel, form);

  return (
    <form>
      {sections.sections.map((sectionGroup) => {
        const { section } = sectionGroup;

        // Render certain sections without headers
        if (section.id === 'hidden-fields' || !section.title) {
          return (
            <div key={section.id} className="fields-group">
              {sectionGroup.fields.map((field) =>
                renderField(field, form)
              )}
            </div>
          );
        }

        // Render other sections with full headers
        return (
          <div key={section.id} className="section-container">
            <div className="section-header">
              <h3>{section.title}</h3>
              {section.description && <p>{section.description}</p>}
            </div>
            <div className="section-fields">
              {sectionGroup.fields.map((field) =>
                renderField(field, form)
              )}
            </div>
          </div>
        );
      })}
    </form>
  );
}
```

## 🔧 Advanced Features

### Progress Tracking

```typescript
function ProgressTrackingForm() {
  const form = useForm(formModel);
  const sections = useSections(formModel, form);

  // Get progress for all sections
  const allProgress = sections.getAllProgress();
  const overallProgress = {
    completed: allProgress.reduce((sum, p) => sum + p.completed, 0),
    total: allProgress.reduce((sum, p) => sum + p.total, 0),
    hasErrors: allProgress.some(p => p.hasErrors)
  };

  return (
    <div>
      {/* Overall Progress */}
      <div className="overall-progress">
        <h3>Form Progress: {Math.round((overallProgress.completed / overallProgress.total) * 100)}%</h3>
        {overallProgress.hasErrors && <span className="error">⚠️ Please fix errors</span>}
      </div>

      {/* Section Progress */}
      {allProgress.map((progress) => (
        <div key={progress.sectionId} className="section-progress">
          <span>{progress.sectionId}: {progress.percentage}%</span>
          {progress.hasErrors && <span className="error">⚠️</span>}
        </div>
      ))}

      {/* Form sections... */}
    </div>
  );
}
```

### Dynamic Section Control

```typescript
function DynamicSectionForm() {
  const form = useForm(formModel);
  const sections = useSections(formModel, form);

  return (
    <div>
      {/* Section Controls */}
      <div className="section-controls">
        <button onClick={sections.expandAll}>Expand All</button>
        <button onClick={sections.collapseAll}>Collapse All</button>

        {sections.sections.map((sectionGroup) => (
          <button
            key={sectionGroup.section.id}
            onClick={() => sections.toggleSection(sectionGroup.section.id)}
          >
            {sections.isCollapsed(sectionGroup.section.id) ? 'Expand' : 'Collapse'} {sectionGroup.section.title}
          </button>
        ))}
      </div>

      {/* Form sections... */}
    </div>
  );
}
```

### Conditional Section Visibility

```typescript
function ConditionalSectionForm() {
  const form = useForm(formModel);
  const sections = useSections(formModel, form, {
    autoHideEmptySections: true  // Automatically hide sections with no visible fields
  });

  return (
    <form>
      {sections.sections
        .filter(sectionGroup => sectionGroup.isVisible)  // Only render visible sections
        .map((sectionGroup) => (
          <div key={sectionGroup.section.id}>
            {/* Section rendering... */}
          </div>
        ))}
    </form>
  );
}
```

## 🎯 Complete Examples

### User Registration Form

```typescript
import React from 'react';
import { useForm, useSections, FormModel, FieldSection } from 'react-form-builder-ts';

const registrationSections: FieldSection[] = [
  {
    id: 'account',
    title: 'Account Information',
    description: 'Create your account credentials',
    layout: { columns: 1 }
  },
  {
    id: 'personal',
    title: 'Personal Details',
    description: 'Tell us about yourself',
    layout: { columns: 2, gap: '1rem' }
  },
  {
    id: 'preferences',
    title: 'Preferences',
    collapsible: true,
    collapsed: true,
    layout: { columns: 2 }
  },
  {
    id: 'terms',
    // No title = headerless section
    layout: { columns: 1 }
  }
];

const registrationModel: FormModel = [
  // Account Section
  {
    key: 'username',
    type: 'text',
    label: 'Username',
    validators: { required: true },
    section: { sectionId: 'account', order: 1 }
  },
  {
    key: 'password',
    type: 'text',
    label: 'Password',
    validators: { required: true },
    section: { sectionId: 'account', order: 2 }
  },

  // Personal Section
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    validators: { required: true },
    section: { sectionId: 'personal', order: 1 }
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    validators: { required: true },
    section: { sectionId: 'personal', order: 2 }
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email',
    validators: { required: true },
    section: { sectionId: 'personal', order: 3 }
  },
  {
    key: 'phone',
    type: 'text',
    label: 'Phone',
    section: { sectionId: 'personal', order: 4 }
  },

  // Preferences Section
  {
    key: 'newsletter',
    type: 'checkbox',
    label: 'Subscribe to newsletter',
    section: { sectionId: 'preferences', order: 1 }
  },
  {
    key: 'notifications',
    type: 'select',
    label: 'Email Notifications',
    options: async () => [
      { value: 'all', label: 'All notifications' },
      { value: 'important', label: 'Important only' },
      { value: 'none', label: 'None' }
    ],
    section: { sectionId: 'preferences', order: 2 }
  },

  // Terms Section (headerless)
  {
    key: 'agreeToTerms',
    type: 'checkbox',
    label: 'I agree to the Terms of Service',
    validators: { required: true },
    section: { sectionId: 'terms', order: 1 }
  }
];

export function RegistrationForm() {
  const sectionedModel = {
    sections: registrationSections,
    fields: registrationModel
  };

  const form = useForm(registrationModel);
  const sections = useSections(sectionedModel, form);

  const renderField = (field: any) => {
    // Your field rendering logic here
    // ...
  };

  return (
    <div className="registration-form">
      <h1>Create Account</h1>

      <form onSubmit={form.handleSubmit}>
        {sections.sections.map((sectionGroup) => {
          const progress = sections.getSectionProgress(sectionGroup.section.id);

          return (
            <div key={sectionGroup.section.id} className="section">
              {/* Conditional Header Rendering */}
              {sectionGroup.section.title && (
                <div className="section-header">
                  {sectionGroup.section.collapsible && (
                    <button
                      type="button"
                      onClick={() => sections.toggleSection(sectionGroup.section.id)}
                      className="section-toggle"
                    >
                      {sectionGroup.isCollapsed ? '▶' : '▼'}
                    </button>
                  )}
                  <div className="header-content">
                    <h2>{sectionGroup.section.title}</h2>
                    {sectionGroup.section.description && (
                      <p>{sectionGroup.section.description}</p>
                    )}
                  </div>
                  <div className="progress-indicator">
                    {progress.percentage}% complete
                    {progress.hasErrors && <span className="error"> ⚠️</span>}
                  </div>
                </div>
              )}

              {/* Fields Container */}
              {!sectionGroup.isCollapsed && (
                <div
                  className="section-fields"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${sectionGroup.section.layout?.columns || 1}, 1fr)`,
                    gap: sectionGroup.section.layout?.gap || '1rem'
                  }}
                >
                  {sectionGroup.fields.map(renderField)}
                </div>
              )}
            </div>
          );
        })}

        <button type="submit" className="submit-btn">
          Create Account
        </button>
      </form>
    </div>
  );
}
```

## 🔧 API Reference

### `useSections(model, form, options)`

**Parameters:**

- `model`: `FormModel | SectionedFormModel` - Your form model with section assignments
- `form`: `UseFormReturn` - The form hook instance
- `options`: `SectionOptions` - Optional configuration

**Returns:** `UseSectionsReturn`

### `SectionOptions`

```typescript
interface SectionOptions {
  defaultCollapsed?: boolean; // Start all sections collapsed
  collapsibleByDefault?: boolean; // Make all sections collapsible
  autoHideEmptySections?: boolean; // Hide sections with no visible fields
}
```

### `UseSectionsReturn`

```typescript
interface UseSectionsReturn {
  sections: SectionGroup[]; // All section groups
  getSectionFields: (sectionId: string) => FieldProps[]; // Get fields for section
  getSectionProgress: (sectionId: string) => SectionProgress; // Get section progress
  getAllProgress: () => SectionProgress[]; // Get all section progress
  toggleSection: (sectionId: string) => void; // Toggle section collapse
  expandAll: () => void; // Expand all sections
  collapseAll: () => void; // Collapse all sections
  isCollapsed: (sectionId: string) => boolean; // Check if section is collapsed
  getVisibleFields: () => FieldProps[]; // Get all visible fields
  getSectionByField: (fieldPath: string) => FieldSection | undefined; // Find field's section
}
```

## 🎨 Styling Guidelines

```css
/* Section Container */
.section {
  margin-bottom: 2rem;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  overflow: hidden;
}

/* Section Header */
.section-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Section Fields */
.section-fields {
  padding: 1.5rem;
  background: white;
}

/* Collapsed State */
.section.collapsed .section-fields {
  display: none;
}

/* Progress Indicator */
.progress-indicator {
  margin-left: auto;
  font-size: 0.9rem;
  opacity: 0.9;
}
```

This comprehensive guide gives you complete control over how sections are rendered in your forms, from full-featured sectioned layouts to minimal flat designs! 🚀
