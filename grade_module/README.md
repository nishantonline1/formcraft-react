# Grade Creation System

A comprehensive Grade Creation System built with the Dynamic Forms library, implementing the industrial material grades specification with advanced chemistry management, module selection, and spectroscopic options.

## Features

### 🏭 **Module Selection**

- **SPECTRO**: Spectroscopic Analysis for precise element detection
- **EAF**: Electric Arc Furnace process optimization
- **MTC**: Material Tracking & Control system
- **IF**: Induction Furnace process control
- **CHARGEMIX**: Charge Mix Optimization for cost efficiency

### 📊 **Grade Configuration**

- **Grade Overview**: Basic information (Tag ID, Name, Type, Temperature ranges)
- **Chemistry Management**: Target chemistry with tolerance specifications
- **Bath Chemistry**: Optional advanced chemistry controls
- **Temperature Control**: Configurable tapping temperature ranges (800-2000°C)

### 🔬 **Advanced Features**

- **Spectroscopic Analysis**: Multi-element detection with customizable parameters
- **Chargemix Optimization**: Material percentage management with cost tracking
- **Real-time Validation**: Form-level and field-level validation
- **Step-by-step Workflow**: Guided creation process with progress indicators

## Design System

### Color Palette

- **Primary**: `#2563eb` (Blue) for interactive elements
- **Success**: `#10b981` (Green) for positive states
- **Warning**: `#eab308` (Yellow) for tolerance highlights
- **Error**: `#ef4444` (Red) for error states
- **Muted**: `#f9fafb` (Light Gray) for backgrounds

### Typography

- **Headers**: Large semibold text for section titles
- **Labels**: Medium weight for field labels
- **Values**: Regular weight for inputs and display text
- **Helper**: Smaller muted text for guidance

## Project Structure

```
grade_module/
├── src/
│   ├── components/           # React components
│   │   ├── GradeCreationApp.tsx    # Main application
│   │   ├── ModuleSelection.tsx     # Module selection interface
│   │   ├── GradeOverview.tsx       # Basic grade configuration
│   │   ├── BTCDecisionGate.tsx     # Bath chemistry decision
│   │   ├── TargetChemistry.tsx     # Chemistry specifications
│   │   ├── SpectroOptions.tsx      # Spectroscopic configuration
│   │   ├── ChargemixData.tsx       # Chargemix materials
│   │   └── SuccessModal.tsx        # Success confirmation
│   ├── hooks/               # Custom React hooks
│   │   └── useGradeForm.ts         # Form state management
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts                # Grade system types
│   ├── utils/               # Utility functions
│   │   └── index.ts                # Validation and helpers
│   ├── configs/             # Form configurations
│   │   └── gradeFormConfig.ts      # Core config definitions
│   └── styles/              # CSS styling
│       ├── design-system.css       # Design tokens
│       └── components.css          # Component styles
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # This file
```

## Installation

1. **Install Dependencies**

   ```bash
   cd grade_module
   npm install
   ```

2. **Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

### Basic Integration

```tsx
import React from 'react';
import { GradeCreationApp } from '@grade_module/react';

function App() {
  return (
    <div className="App">
      <GradeCreationApp />
    </div>
  );
}

export default App;
```

### Advanced Usage with Custom Hook

```tsx
import React from 'react';
import { useGradeForm } from '@grade_module/react';

function CustomGradeCreation() {
  const { formState, formData, formMethods, submitGrade, resetForm } =
    useGradeForm();

  return <form onSubmit={submitGrade}>{/* Custom form implementation */}</form>;
}
```

## Configuration

### Module Types

```typescript
type ModuleType = 'SPECTRO' | 'EAF' | 'MTC' | 'IF' | 'CHARGEMIX';
```

### Grade Types

```typescript
type GradeType = 'DI' | 'CI' | 'SS' | 'SG' | 'GI';
```

### Chemical Elements

```typescript
interface ChemicalElement {
  id: string;
  element: string;
  finalMin: number;
  finalMax: number;
  bathMin?: number;
  bathMax?: number;
  toleranceMin: number;
  toleranceMax: number;
}
```

## Validation Rules

### Temperature Validation

- **Range**: 800°C to 2000°C
- **Logic**: Minimum must be less than maximum
- **Real-time**: Validates on input blur

### Chemistry Validation

- **Element Ranges**: Min < Max for all values
- **Tolerance**: Must be positive values
- **Total Percentage**: Final max values should not exceed 100%

### Chargemix Validation

- **Material Percentages**: Must be positive
- **Total**: Cannot exceed 100%
- **Uniqueness**: Material names must be unique

## Workflow Steps

1. **Module Selection** → Choose processing modules
2. **Grade Overview** → Configure basic information
3. **BTC Decision** → Choose bath chemistry option
4. **Target Chemistry** → Set element specifications
5. **Module Options** → Configure module-specific settings

## Responsive Design

### Desktop (1024px+)

- Two-column layout for grade overview
- Grid layout for module cards (2-3 columns)
- Full table view for chemistry configuration

### Tablet (768px - 1023px)

- Single column with wider cards
- Reduced module columns (max 2)
- Horizontal scroll for tables if needed

### Mobile (< 768px)

- Single column layout throughout
- Stacked module cards
- Simplified table layouts
- Full-screen modals

## Accessibility

### Keyboard Navigation

- Tab order follows logical flow
- Enter activates buttons and selections
- Escape closes modals
- Arrow keys navigate tables

### Screen Reader Support

- Semantic HTML with proper landmarks
- ARIA labels for complex interactions
- Status announcements for validation
- Table headers properly associated

### Visual Accessibility

- High contrast ratios (4.5:1 minimum)
- Visible focus indicators
- Clear error state distinctions
- Minimum 16px text on mobile

## Performance

### Loading States

- Skeleton loading for initial render
- Progressive section loading
- Smooth state transitions
- No layout shift during loading

### Optimization

- First contentful paint < 1.5s
- Interactive elements ready < 2s
- Form submission feedback < 500ms
- 60fps animations

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please refer to the main Dynamic Forms documentation or create an issue in the repository.

---

**Built with ❤️ using Dynamic Forms React Library**


