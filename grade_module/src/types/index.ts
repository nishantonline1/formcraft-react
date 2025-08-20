// Grade Module Types
export type ModuleType = 'SPECTRO' | 'EAF' | 'MTC' | 'IF' | 'CHARGEMIX';

export type GradeType = 'DI' | 'CI' | 'SS' | 'SG' | 'GI';

export interface Module {
  id: ModuleType;
  name: string;
  description: string;
  icon: string;
  features: string[];
  businessImpact: string;
  enabled: boolean;
}

export interface GradeOverview {
  tagId: string;
  gradeName: string;
  gradeType: GradeType;
  tappingTemperatureMin: number;
  tappingTemperatureMax: number;
  status: 'Active' | 'Inactive';
}

export interface ChemicalElement {
  id: string;
  element: string;
  finalMin: number;
  finalMax: number;
  bathMin?: number;
  bathMax?: number;
  toleranceMin: number;
  toleranceMax: number;
}

export interface TargetChemistry {
  elements: ChemicalElement[];
  withBathChemistry: boolean;
  rememberChoice: boolean;
}

export interface SpectroOptions {
  enabled: boolean;
  elements: string[];
  rawMaterialMinPercentage: number;
  rawMaterialMaxPercentage: number;
  additionMaterials: string[];
  dilutionMaterials: string[];
  analysisFrequency: number;
  calibrationSettings: Record<string, unknown>;
}

export interface ChargemixMaterial {
  id: string;
  name: string;
  percentage: number;
}

export interface ChargemixData {
  enabled: boolean;
  materials: ChargemixMaterial[];
}

export interface GradeFormData {
  selectedModules: ModuleType[];
  gradeOverview: GradeOverview;
  targetChemistry: TargetChemistry;
  spectroOptions: SpectroOptions;
  chargemixData: ChargemixData;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface GradeCreationState {
  currentStep: number;
  isValid: boolean;
  errors: ValidationError[];
  isSubmitting: boolean;
  submitSuccess: boolean;
}


