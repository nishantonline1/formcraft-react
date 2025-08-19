# Grade Manager Application Example

## Overview

The Grade Manager Application is a comprehensive industrial grade management system example built with `@dynamic_forms/react`. This example demonstrates a real-world metallurgical process management system that showcases advanced form features including complex dependencies, sectioned forms, dynamic field visibility, and comprehensive validation.

## Features Demonstrated

### 🏭 **Grade Manager Page** (`/grade-manager`)

- **Multi-Module Configuration**: SPECTRO and IF (Induction Furnace) module selection
- **Complex Dependencies**: Fields that show/hide based on grade type and module selection
- **BTC Decision Gate**: Critical decision point affecting entire form structure
- **Dynamic Chemistry Configuration**: Different elements based on grade type (ferrous vs non-ferrous)
- **Advanced Tolerance Configuration**: Optional tolerance ranges with validation
- **Raw Materials Management**: SPECTRO module specific material configuration
- **Chargemix Data**: IF module specific charge mixture configuration
- **Success Modal**: Post-creation navigation options

### 📊 **Grade Details Page** (`/grade-details`)

- **Data Visualization**: Comprehensive view of created grade configurations
- **Module-Specific Sections**: Different views for SPECTRO and IF configurations
- **Associated Parts Management**: Display of parts linked to grades
- **Quick Actions**: Edit, clone, export, and delete operations

### ⚙️ **Part Creation Page** (`/part-create`)

- **Grade Association**: Link parts to existing grades
- **Physical Properties**: Weight, dimensions with automatic volume calculation
- **Manufacturing Specifications**: Surface finish, heat treatment, quality standards
- **Process Parameters**: Casting-specific parameters and methods
- **Dynamic Calculations**: Real-time volume and density calculations

## Technical Implementation

### Form Model Architecture

The Grade Manager uses a sectioned form model with complex dependencies:

```typescript
{
  title: "Grade Manager Application",
  description: "Industrial grade management system for metallurgical processes",
  sections: [
    {
      id: "module-selection",
      title: "Module Selection",
      fields: [
        {
          key: "selectedModules",
          type: "checkbox",
          options: [
            { value: "SPECTRO", label: "SPECTRO Module" },
            { value: "IF", label: "IF Kiosk Module" }
          ],
          defaultValue: ["SPECTRO"]
        }
      ]
    },
    // ... more sections
  ]
}
```

### Advanced Dependencies

The example showcases several dependency patterns:

#### 1. **Module-Based Visibility**

```typescript
dependencies: [
  {
    field: 'selectedModules',
    condition: { operator: 'contains', value: 'SPECTRO' },
    action: { type: 'show' },
  },
];
```

#### 2. **Grade Type Conditional Fields**

```typescript
dependencies: [
  {
    field: 'gradeType',
    condition: { operator: 'equals', value: 'DI' },
    action: { type: 'show' },
  },
];
```

#### 3. **Multi-Field Dependencies**

```typescript
dependencies: [
  {
    field: 'btcChoice',
    condition: { operator: 'equals', value: 'with' },
    action: { type: 'show' },
  },
  {
    field: 'gradeType',
    condition: { operator: 'in', value: ['DI', 'CI', 'GI', 'SG'] },
    action: { type: 'show' },
  },
];
```

### Business Logic Implementation

#### Grade Type Specific Behavior

- **Ferrous Grades** (DI, CI, GI, SG): Default Carbon and Silicon elements
- **Non-ferrous Grades** (SS): Empty element table to start
- **Ductile Iron Specific**: Additional temperature and Mg treatment fields

#### BTC Decision Gate

- **Critical Decision Point**: Affects entire form structure
- **With Bath Chemistry**: Enables bath min/max and tolerance configuration
- **Without Bath Chemistry**: Simplified final chemistry only
- **Validation**: Prevents form submission until decision is made

#### Dynamic Chemistry Configuration

- **Element Management**: Add/remove elements with industry-standard ranges
- **Tolerance Validation**: Real-time validation with color-coded feedback
- **Material Synchronization**: Advanced options sync with chemistry elements

## Key Form Features Showcased

### 1. **Complex Form State Management**

```typescript
const {
  config,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isFieldVisible,
  getEffectiveField,
} = useForm(gradeManagerModel, {
  initialValues: {
    selectedModules: ['SPECTRO'],
    gradeType: 'DI',
    carbonFinalMin: 3.2,
    carbonFinalMax: 3.8,
  },
});
```

### 2. **Dynamic Field Visibility**

```typescript
{
  section.fields
    .filter((field) => isFieldVisible(field.key))
    .map((field) => {
      const effectiveField = getEffectiveField(field.key) || field;
      // Render field based on effective configuration
    });
}
```

### 3. **Real-time Validation Feedback**

```typescript
const renderValidationStatus = (value, min, max, toleranceMin, toleranceMax) => {
  if (toleranceMin !== undefined && toleranceMax !== undefined) {
    if (value >= min && value <= max) {
      return <span className="text-green-600">✓ Within Target</span>;
    } else if (value >= toleranceMin && value <= toleranceMax) {
      return <span className="text-yellow-600">⚠ Within Tolerance</span>;
    } else {
      return <span className="text-red-600">✗ Out of Range</span>;
    }
  }
  return null;
};
```

### 4. **Conditional Submit Validation**

```typescript
<button
  type="submit"
  disabled={!values.btcChoice && values.selectedModules?.includes('SPECTRO')}
  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
>
  Create Grade
</button>
```

## PRD Implementation Mapping

| PRD Requirement   | Implementation Location    | Features                                         |
| ----------------- | -------------------------- | ------------------------------------------------ |
| Module Selection  | `module-selection` section | SPECTRO/IF checkbox selection with dependencies  |
| Grade Overview    | `grade-overview` section   | Type-specific fields with conditional visibility |
| BTC Decision Gate | `btc-decision` section     | Critical decision with form-wide impact          |
| Target Chemistry  | `target-chemistry` section | Dynamic element management with validation       |
| Tolerance Config  | `tolerance-config` section | Optional tolerance ranges with color coding      |
| Advanced Options  | `advanced-spectro` section | Power user features with element sync            |
| Chargemix Data    | `chargemix-data` section   | IF module specific configuration                 |
| Success Flow      | Success Modal              | Post-creation navigation options                 |

## Business Rules Demonstrated

### 1. **Grade Type Rules**

- Ferrous grades have default C and Si elements (cannot be removed)
- Non-ferrous grades start with empty element table
- Ductile Iron shows additional temperature and Mg treatment fields

### 2. **Module Dependencies**

- SPECTRO module enables BTC decision gate and advanced options
- IF module enables chargemix configuration
- Modules can be used independently or together

### 3. **BTC Decision Impact**

- Affects chemistry table structure (bath vs final only)
- Controls tolerance configuration availability
- Required decision before form submission

### 4. **Validation Rules**

- Required fields based on business logic
- Range validation for temperatures and percentages
- Pattern validation for part numbers
- Cross-field validation for tolerance ranges

## Learning Objectives

This example teaches developers how to:

1. **Build Complex Forms**: Multi-section forms with advanced dependencies
2. **Implement Business Logic**: Domain-specific rules and validation
3. **Handle Dynamic UX**: Conditional field visibility and configuration
4. **Manage Form State**: Complex state with computed values
5. **Provide User Feedback**: Real-time validation and guidance
6. **Create Professional UI**: Industry-standard interface patterns

## Usage Instructions

### Running the Example

1. Navigate to the examples directory
2. Start the development server: `npm run dev`
3. Select "🏭 Grade Manager" from the navigation

### Testing Scenarios

#### Scenario 1: Ductile Iron Grade with Bath Chemistry

1. Select both SPECTRO and IF modules
2. Choose "DI - Ductile Iron" grade type
3. Select "With Bath Chemistry"
4. Configure carbon and silicon ranges
5. Enable tolerance configuration
6. Add advanced spectro options
7. Configure chargemix data
8. Submit and test success modal

#### Scenario 2: Stainless Steel Grade (Non-ferrous)

1. Select SPECTRO module only
2. Choose "SS - Stainless Steel"
3. Notice empty chemistry table
4. Add elements manually
5. Select "Without Bath Chemistry"
6. Test simplified flow

#### Scenario 3: IF Only Configuration

1. Select IF module only
2. Notice simplified interface
3. Focus on chargemix configuration
4. Test direct IF workflow

### Integration Tips

To integrate this pattern into your own application:

1. **Adapt the Model**: Modify sections and fields for your domain
2. **Customize Dependencies**: Implement your business rules
3. **Style Consistently**: Use your design system
4. **Add Validation**: Implement domain-specific validation
5. **Connect Backend**: Replace mock data with API calls

## Advanced Features

### Dynamic Calculations

```typescript
// Auto-calculate volume from dimensions
React.useEffect(() => {
  if (values.length && values.width && values.height) {
    const volume = (values.length * values.width * values.height) / 1000;
    handleChange('volume', Math.round(volume * 100) / 100);
  }
}, [values.length, values.width, values.height, handleChange]);
```

### Conditional Styling

```typescript
className={`w-full px-3 py-2 border rounded-md ${
  effectiveField.readonly
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
    : fieldError && fieldTouched
      ? 'border-red-300 focus:border-red-500'
      : 'border-gray-300 focus:border-green-500'
}`}
```

### Success Modal with Navigation

```typescript
{showSuccessModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      {/* Modal content with navigation options */}
    </div>
  </div>
)}
```

## Conclusion

The Grade Manager example demonstrates the power and flexibility of `@dynamic_forms/react` for building enterprise-grade applications. It showcases how complex business requirements can be elegantly implemented using the library's dependency system, validation framework, and state management capabilities.

This example serves as both a learning tool and a template for building sophisticated form-based applications in industrial and enterprise contexts.
