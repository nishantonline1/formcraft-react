# Sectioned Form Example

This example demonstrates different approaches to handling sections/groups in forms using the Form Builder library's `useSections` hook.

## Features Demonstrated

### 🎯 **Core Section Features**

- **Section Assignment** - Assign fields to sections with ordering
- **Section Configuration** - Define titles, descriptions, layout options
- **Progress Tracking** - Monitor completion per section with error detection
- **Collapsible Sections** - Expand/collapse functionality
- **Flexible Rendering** - Multiple approaches to section display

### 🎨 **Rendering Approaches**

#### 1. Full Featured Sections

- Section headers with titles and descriptions
- Progress indicators with completion percentages
- Collapsible/expandable behavior
- Error indicators in progress tracking
- Beautiful gradient headers with emoji toggles

#### 2. Headerless Sections

- Grouped fields without section headers
- Maintains logical field grouping
- Clean, minimal appearance
- Grid layout support

#### 3. Flat Layout

- All fields in sequence without section containers
- No visual section separation
- Simplest possible rendering

## File Structure

```
sectioned-form/
├── index.tsx           # Main component entry point
├── model.ts           # Form model and section definitions
├── hooks.ts           # Custom hooks for different demos
├── components.tsx     # Reusable components (headers, fields, etc.)
├── SectionedFormStyles.css  # Comprehensive styling
└── README.md         # This documentation
```

## Key Components

### Form Model (`model.ts`)

```typescript
export const formModel: FormModel = [
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    validators: { required: true },
    section: { sectionId: 'personal', order: 1 },
  },
  // ... more fields
];

export const sections: FieldSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic information about yourself',
    collapsible: true,
    layout: { columns: 2, gap: '1rem' },
  },
  // ... more sections
];
```

### Custom Hooks (`hooks.ts`)

```typescript
export function useSectionedFormDemo() {
  const form = useForm(formModel, {
    initialValues: {
      /* defaults */
    },
  });

  const sections = useSections(sectionedModel, form, {
    defaultCollapsed: false,
    autoHideEmptySections: false,
  });

  // Calculate overall progress
  const allProgress = sections.getAllProgress();

  return { form, sections, allProgress, overallProgress };
}
```

### Reusable Components (`components.tsx`)

- **`FieldRenderer`** - Renders individual form fields
- **`SectionHeader`** - Section header with progress and toggles
- **`SectionWrapper`** - Section container with layout
- **`FullFeaturedForm`** - Complete sectioned form
- **`HeaderlessForm`** - Grouped fields without headers
- **`FlatForm`** - All fields in sequence
- **`SectionControls`** - Global section controls and progress
- **`DebugSection`** - Form values display

## Section Configuration Options

### Field Section Assignment

```typescript
section: {
  sectionId: 'personal',    // Required: section identifier
  order: 1                  // Optional: order within section
}
```

### Section Definition

```typescript
{
  id: 'personal',                    // Unique identifier
  title: 'Personal Information',    // Optional: header title
  description: 'Basic details...',  // Optional: header description
  collapsible: true,                // Optional: can collapse/expand
  collapsed: false,                 // Optional: start collapsed
  layout: {                         // Optional: grid layout
    columns: 2,                     // Number of columns
    gap: '1rem',                    // CSS gap value
    className: 'custom-layout'      // Additional CSS class
  }
}
```

### Section Options

```typescript
useSections(model, form, {
  defaultCollapsed: false, // Start all sections collapsed
  autoHideEmptySections: false, // Hide sections with no visible fields
});
```

## Section Management API

```typescript
const sections = useSections(model, form);

// Section state
sections.sections; // All section groups
sections.isCollapsed(sectionId); // Check if collapsed
sections.getSectionFields(sectionId); // Get fields in section

// Section control
sections.toggleSection(sectionId); // Toggle collapse state
sections.expandAll(); // Expand all sections
sections.collapseAll(); // Collapse all sections

// Progress tracking
sections.getSectionProgress(sectionId); // Individual section progress
sections.getAllProgress(); // All sections progress

// Field access
sections.getVisibleFields(); // All visible fields (flat)
sections.getSectionByField(fieldPath); // Find field's section
```

## Progress Tracking

Each section provides detailed progress information:

```typescript
interface SectionProgress {
  sectionId: string; // Section identifier
  completed: number; // Number of completed fields
  total: number; // Total number of fields
  percentage: number; // Completion percentage (0-100)
  hasErrors: boolean; // Whether section has validation errors
  isValid: boolean; // Whether section is completely valid
}
```

## Styling Architecture

The example uses a comprehensive CSS architecture:

### CSS Classes

- **`.sectioned-form`** - Full featured form container
- **`.headerless-form`** - Headerless form container
- **`.flat-form`** - Flat form container
- **`.section-container`** - Individual section wrapper
- **`.custom-section-header`** - Section header styling
- **`.section-progress-badge`** - Progress indicator styling
- **`.form-field`** - Individual field styling
- **`.section-controls`** - Global controls styling

### Responsive Design

- Mobile-friendly layouts
- Flexible section headers
- Collapsible controls for small screens

## Usage Patterns

### 1. Simple Sectioned Form

```typescript
const form = useForm(formModel);
const sections = useSections(formModel, form);

return (
  <form>
    {sections.sections.map(sectionGroup => (
      <div key={sectionGroup.section.id}>
        {sectionGroup.section.title && (
          <h3>{sectionGroup.section.title}</h3>
        )}
        {sectionGroup.fields.map(field =>
          <FieldRenderer field={field} form={form} />
        )}
      </div>
    ))}
  </form>
);
```

### 2. Progress-Aware Form

```typescript
const allProgress = sections.getAllProgress();
const overallProgress = allProgress.reduce((acc, p) => ({
  completed: acc.completed + p.completed,
  total: acc.total + p.total
}), { completed: 0, total: 0 });

return (
  <div>
    <div className="overall-progress">
      Overall: {Math.round((overallProgress.completed / overallProgress.total) * 100)}%
    </div>
    {/* Form sections */}
  </div>
);
```

### 3. Conditional Section Rendering

```typescript
return (
  <form>
    {sections.sections
      .filter(sectionGroup => sectionGroup.isVisible)
      .map(sectionGroup => (
        // Render based on section properties
        sectionGroup.section.title
          ? <SectionWithHeader {...sectionGroup} />
          : <SectionFieldsOnly {...sectionGroup} />
      ))}
  </form>
);
```

## Learning Outcomes

After exploring this example, you'll understand:

1. **How to assign fields to sections** using the `section` property
2. **How to configure section behavior** with titles, layouts, and collapsibility
3. **How to track progress** across sections with error detection
4. **How to render sections flexibly** - with headers, without headers, or flat
5. **How to manage section state** with expand/collapse controls
6. **How to create reusable section components** for consistent UX
7. **How to handle responsive section layouts** for different screen sizes

## Next Steps

- Explore the **`SECTIONS.md`** guide for comprehensive section documentation
- Try creating custom section renderers for specialized use cases
- Experiment with dynamic section creation based on form data
- Implement tab-based or accordion-style section navigation
