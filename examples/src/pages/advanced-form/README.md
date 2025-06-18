# Advanced Form Wizard Example

This example demonstrates a sophisticated, multi-step wizard form that showcases some of the most powerful features of the `form-builder` library. It's an excellent reference for building complex, real-world forms.

## Features Demonstrated

- **Multi-Step Wizard**: A three-step process guides the user through different stages of data entry, with clear navigation controls.
- **Complex Layouts**: The first step uses grid-based layouts to position fields, creating a structured and visually appealing design.
- **Field Sections**: Fields are grouped into logical sections, improving clarity and organization.
- **Deeply Nested Arrays**: The second step features a three-level nested array, demonstrating how to handle complex, dynamic data structures (e.g., work experiences with multiple projects, each with multiple tasks).
- **Advanced Data Handling**: The form manages a complex data model that combines simple fields, sections, and nested arrays.
- **Professional Styling**: The entire example is styled to be clean, modern, and professional, providing a solid foundation for your own designs.

## File Structure

The example is organized into the following files, promoting a clean separation of concerns:

- `index.tsx`: The main component that manages the wizard's state (current step) and renders the appropriate components.
- `model.ts`: Defines the entire data structure for the form using `FormModel`, including layouts, sections, and nested `itemModel` definitions.
- `hooks.ts`: Contains the `useAdvancedForm` hook, which initializes the form state with `useForm` and provides initial data.
- `components.tsx`: Includes all React components for the wizard, such as `Step1`, `Step2`, `Step3`, and the recursive `ArrayFieldRenderer`.
- `styles.css`: Provides the professional styling for the wizard, form fields, and layout.
- `README.md`: This documentation file.

## Key Implementation Patterns

### 1. Wizard State Management

The wizard's state is managed in `index.tsx` using a simple `useState` hook. Navigation functions control the current step.

```typescript
// in index.tsx
const [step, setStep] = useState(1);

const handleNext = () => setStep((prev) => prev + 1);
const handlePrev = () => setStep((prev) => prev - 1);
```

### 2. Combining Layouts and Sections

`Step1` demonstrates how to use both `layout` and `section` properties to create a rich UI. Fields are filtered based on whether they have a `layout` or `section` property.

```typescript
// in components.tsx (Step1)
const stepFields = form.config.fields.filter((f) => f.meta?.step === 1);
const layoutFields = stepFields.filter((f) => f.layout && !f.section);
const sectionModel = stepFields.filter((f) => f.section);
const sections = useSections(sectionModel, form);
```

### 3. Recursive Array Rendering

The `ArrayFieldRenderer` in `components.tsx` is a powerful pattern for handling nested data structures. It recursively calls itself for any field of type `array`, allowing it to render arrays of any depth.

```typescript
// in components.tsx
const ArrayFieldRenderer = ({ path, form, itemModel, depth }) => {
  // ...
  return (
    <div>
      {itemModel.map((field) => {
        if (field.type === 'array') {
          // Recursive call for nested array
          return <ArrayFieldRenderer ... />;
        }
        return <FieldRenderer ... />;
      })}
    </div>
  );
};
```

### 4. Defining Nested Data in the Model

The `model.ts` file shows how to define nested arrays using the `itemModel` property. This approach is recursive, allowing for deeply nested structures.

```typescript
// in model.ts
export const advancedFormModel: FormModel = [
  {
    key: 'experiences',
    type: 'array',
    label: 'Work Experiences',
    itemModel: [
      { key: 'company', ... },
      {
        key: 'projects',
        type: 'array', // 2nd level nested array
        label: 'Projects',
        itemModel: [
          { key: 'projectName', ... },
          {
            key: 'tasks',
            type: 'array', // 3rd level nested array
            label: 'Tasks',
            itemModel: [ ... ],
          },
        ],
      },
    ],
  },
];
```

## Learning Outcomes

By studying this example, you will learn how to:

- Structure a complex, multi-step form.
- Use grid-based layouts and sections to organize fields.
- Implement and manage deeply nested array fields.
- Create recursive components for rendering dynamic data structures.
- Apply professional styling to create a clean and modern UI.
