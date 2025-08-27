/**
 * Grade Creation Form Types and Interfaces
 * Contains all type definitions for the grade creation system
 */

// Chemical element interface for chemistry table
export interface ChemicalElement {
  symbol: string;
  bathMin: number;
  bathMax: number;
  finalMin: number;
  finalMax: number;
}

// Material interface for addition/dilution settings
export interface Material {
  name: string;
  type: 'Furnace' | 'Additives' | 'Nodularizer';
  minPercent: number;
  maxPercent: number;
  selected: boolean;
}

// Tolerance settings interface
export interface ToleranceSettings {
  element: string;
  baseMin: number;
  baseMax: number;
  toleranceMin: number;
  toleranceMax: number;
}

// Enhanced type definitions for the form data
export interface GradeFormData {
  selectedModules: string[];
  tagId: string;
  gradeName: string;
  gradeCode: string;
  gradeType: 'DI' | 'CI' | 'SS' | 'SG' | 'GI';
  tappingTemperatureMin: number;
  tappingTemperatureMax: number;
  mgTreatmentTime: number;
  bathChemistryDecision: 'with' | 'without';
  rememberChoice: boolean;
  spectroEnabled: boolean;
  chargemixEnabled: boolean;
  chemistryElements: ChemicalElement[];
  materials: Material[];
  toleranceSettings: ToleranceSettings[];
}

// Module information type
export interface ModuleInfo {
  name: string;
  shortName: string;
  description: string;
  features: string[];
  icon: string;
  isDefault: boolean;
  businessImpact: string;
}

// Module info mapping type
export type ModuleInfoMap = {
  readonly [K in 'SPECTRO' | 'IF_KIOSK']: ModuleInfo;
};

// Grade type enum for better type safety
export type GradeType = 'DI' | 'CI' | 'SS' | 'SG' | 'GI';

// Material type enum
export type MaterialType = 'Furnace' | 'Additives' | 'Nodularizer';

// Bath chemistry decision type
export type BathChemistryDecision = 'with' | 'without';

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
}

// Field group keys type
export type FieldGroupKey = 'moduleSelection' | 'gradeOverview' | 'diSpecific' | 'bathChemistry' | 'moduleSpecific';

// Re-export form types from @dynamic_forms/react for type safety
// We'll import the actual types from the library instead of redefining them
