import { FieldProps } from '@dynamic_forms/react';
import type {
  ChemicalElement,
  Material,
  ToleranceSettings,
  GradeFormData,
  ModuleInfoMap
} from './types';

/**
 * Grade Creation Form Field Models
 * Enhanced models matching the sophisticated UI design
 * Contains all form field declarations and configurations
 */

// Module selection field
export const moduleSelectionField: FieldProps = {
  key: 'selectedModules',
  type: 'array',
  label: 'Select Processing Modules',
  defaultValue: [],
  validators: {
    required: true,
    minItems: 1,
  },
  options: async () => [
    { value: 'SPECTRO', label: 'Spectroscopic Analysis' },
    { value: 'EAF', label: 'Electric Arc Furnace' },
    { value: 'MTC', label: 'Material Tracking & Control' },
    { value: 'IF', label: 'Induction Furnace' },
    { value: 'CHARGEMIX', label: 'Charge Mix Optimization' },
  ],
  layout: { row: 0, col: 0 }
};

// Grade overview fields - enhanced based on design
export const gradeOverviewFields: FieldProps[] = [
  {
    key: 'tagId',
    type: 'text',
    label: 'Tag ID',
    defaultValue: 'DI-001',
    validators: {
      required: true,
      pattern: /^[A-Z0-9_-]+$/,
    },
    layout: { row: 1, col: 0 }
  },
  {
    key: 'gradeName',
    type: 'text',
    label: 'Grade Name',
    defaultValue: 'Ductile 60-40-18',
    validators: {
      required: true
    },
    layout: { row: 1, col: 1 }
  },
  {
    key: 'gradeCode',
    type: 'text',
    label: 'Grade Code',
    defaultValue: '60-40-18',
    validators: {
      required: true,
    },
    layout: { row: 2, col: 0 }
  },
  {
    key: 'gradeType',
    type: 'select',
    label: 'Grade Type',
    defaultValue: 'DI',
    validators: {
      required: true
    },
    options: async () => [
      { value: 'DI', label: 'DI - Ductile Iron' },
      { value: 'CI', label: 'CI - Cast Iron' },
      { value: 'SS', label: 'SS - Stainless Steel' },
      { value: 'SG', label: 'SG - Spheroidal Graphite' },
      { value: 'GI', label: 'GI - Gray Iron' }
    ],
    layout: { row: 2, col: 1 }
  }
];

// DI Specific Parameters - enhanced from design
export const diSpecificFields: FieldProps[] = [
  {
    key: 'tappingTemperatureMin',
    type: 'number',
    label: 'Tapping Temperature Min (°C)',
    defaultValue: 1500,
    validators: {
      required: true,
      min: 800,
      max: 2000
    },
    layout: { row: 3, col: 0 }
  },
  {
    key: 'tappingTemperatureMax',
    type: 'number',
    label: 'Tapping Temperature Max (°C)',
    defaultValue: 1540,
    validators: {
      required: true,
      min: 800,
      max: 2000
    },
    layout: { row: 3, col: 1 }
  },
  {
    key: 'mgTreatmentTime',
    type: 'number',
    label: 'Mg Treatment Time (minutes)',
    defaultValue: 1,
    validators: {
      required: true,
      min: 0,
      max: 30
    },
    layout: { row: 3, col: 2 }
  }
];

// Bath chemistry decision field - enhanced from design
export const bathChemistryField: FieldProps = {
  key: 'bathChemistryDecision',
  type: 'select',
  label: 'Bath Chemistry Decision',
  defaultValue: 'without',
  validators: {
    required: true
  },
  options: async () => [
    { value: 'with', label: 'With Bath Chemistry' },
    { value: 'without', label: 'Without Bath Chemistry' }
  ],
  layout: { row: 4, col: 0 }
};

// Remember choice field
export const rememberChoiceField: FieldProps = {
  key: 'rememberChoice',
  type: 'checkbox',
  label: 'Remember my choice for new grades',
  defaultValue: false,
  layout: { row: 4, col: 1 }
};

// Module-specific configuration fields
export const moduleSpecificFields: FieldProps[] = [
  {
    key: 'spectroEnabled',
    type: 'checkbox',
    label: 'Enable Spectroscopic Analysis',
    defaultValue: false,
    layout: { row: 4, col: 0 }
  },
  {
    key: 'chargemixEnabled',
    type: 'checkbox',
    label: 'Enable Chargemix Configuration',
    defaultValue: false,
    layout: { row: 4, col: 1 }
  }
];

// Complete form model combining all fields
export const gradeFormModel: FieldProps[] = [
  moduleSelectionField,
  ...gradeOverviewFields,
  ...diSpecificFields,
  bathChemistryField,
  rememberChoiceField,
  ...moduleSpecificFields
];

// Field groups for organized rendering - updated from design
export const fieldGroups = {
  moduleSelection: [moduleSelectionField],
  gradeOverview: gradeOverviewFields,
  diSpecific: diSpecificFields,
  bathChemistry: [bathChemistryField, rememberChoiceField],
  moduleSpecific: moduleSpecificFields
} as const;

// Default chemistry elements based on design
export const defaultChemistryElements: ChemicalElement[] = [
  {
    symbol: 'C',
    bathMin: 3.40,
    bathMax: 3.60,
    finalMin: 3.45,
    finalMax: 3.55
  },
  {
    symbol: 'Si',
    bathMin: 3.40,
    bathMax: 3.60,
    finalMin: 2.3,
    finalMax: 2.35
  }
];

// Available materials for addition/dilution
export const availableMaterials: Material[] = [
  { name: 'Pig Iron', type: 'Furnace', minPercent: 0, maxPercent: 100, selected: true },
  { name: 'Steel Scrap', type: 'Furnace', minPercent: 0, maxPercent: 100, selected: false },
  { name: 'Cast Iron Returns', type: 'Furnace', minPercent: 0, maxPercent: 100, selected: false },
  { name: 'Ferro Silicon', type: 'Additives', minPercent: 0, maxPercent: 10, selected: false },
  { name: 'Ferro Manganese', type: 'Additives', minPercent: 0, maxPercent: 5, selected: false },
  { name: 'Ferro Chrome', type: 'Additives', minPercent: 0, maxPercent: 3, selected: false },
  { name: 'Magnesium Ferrosilicon', type: 'Nodularizer', minPercent: 10, maxPercent: 20, selected: false },
  { name: 'Rare Earth Alloy', type: 'Nodularizer', minPercent: 0, maxPercent: 5, selected: false }
];

// Default tolerance settings
export const defaultToleranceSettings: ToleranceSettings[] = [
  {
    element: 'C',
    baseMin: 3.45,
    baseMax: 3.55,
    toleranceMin: 3.40,
    toleranceMax: 3.60
  },
  {
    element: 'Si',
    baseMin: 2.3,
    baseMax: 2.35,
    toleranceMin: 2.25,
    toleranceMax: 2.40
  }
];



// Default values for the form - enhanced from design
export const defaultGradeData: Partial<GradeFormData> = {
  selectedModules: ['SPECTRO'],
  tagId: 'DI-001',
  gradeName: 'Ductile 60-40-18',
  gradeCode: '60-40-18',
  gradeType: 'DI',
  tappingTemperatureMin: 1500,
  tappingTemperatureMax: 1540,
  mgTreatmentTime: 1,
  bathChemistryDecision: 'without',
  rememberChoice: false,
  spectroEnabled: true,
  chargemixEnabled: false,
  chemistryElements: defaultChemistryElements,
  materials: availableMaterials,
  toleranceSettings: defaultToleranceSettings
};

// Module information for display - enhanced from design
export const moduleInfo: ModuleInfoMap = {
  SPECTRO: {
    name: 'Spectrometer Module (Default)',
    shortName: 'SPECTRO',
    description: 'Provides precise chemical composition analysis',
    features: [
      'Advanced spectro configuration',
      'Element analysis and tolerance settings'
    ],
    icon: '🔬',
    isDefault: true,
    businessImpact: 'Improves quality control and reduces material waste'
  },
  IF_KIOSK: {
    name: 'Induction Furnace Kiosk (Optional)',
    shortName: 'IF Kiosk',
    description: 'Optimizes induction furnace charge preparation',
    features: [
      'Comprehensive charge mixture management',
      'Chargemix item configuration'
    ],
    icon: '🔥',
    isDefault: false,
    businessImpact: 'Improves melting consistency and reduces cycle time'
  }
};

