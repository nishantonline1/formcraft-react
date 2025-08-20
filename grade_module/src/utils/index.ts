import { ChemicalElement, ValidationError, ModuleType } from '../types';

// Default chemical elements for grade creation
export const DEFAULT_ELEMENTS: Omit<ChemicalElement, 'id'>[] = [
  {
    element: 'C',
    finalMin: 3.0,
    finalMax: 4.0,
    bathMin: 3.2,
    bathMax: 4.2,
    toleranceMin: 0.1,
    toleranceMax: 0.2,
  },
  {
    element: 'Si',
    finalMin: 1.8,
    finalMax: 3.0,
    bathMin: 2.0,
    bathMax: 3.2,
    toleranceMin: 0.1,
    toleranceMax: 0.2,
  },
  {
    element: 'Mn',
    finalMin: 0.4,
    finalMax: 1.0,
    bathMin: 0.5,
    bathMax: 1.1,
    toleranceMin: 0.05,
    toleranceMax: 0.1,
  },
  {
    element: 'P',
    finalMin: 0.0,
    finalMax: 0.08,
    bathMin: 0.0,
    bathMax: 0.1,
    toleranceMin: 0.01,
    toleranceMax: 0.02,
  },
  {
    element: 'S',
    finalMin: 0.0,
    finalMax: 0.02,
    bathMin: 0.0,
    bathMax: 0.03,
    toleranceMin: 0.005,
    toleranceMax: 0.01,
  },
];

// Available modules configuration
export const AVAILABLE_MODULES: Record<ModuleType, Omit<import('../types').Module, 'enabled'>> = {
  SPECTRO: {
    id: 'SPECTRO',
    name: 'Spectroscopic Analysis',
    description: 'Advanced spectroscopic analysis for precise element detection',
    icon: '🔬',
    features: ['Real-time analysis', 'Multi-element detection', 'High precision'],
    businessImpact: 'Improves quality control and reduces material waste',
  },
  EAF: {
    id: 'EAF',
    name: 'Electric Arc Furnace',
    description: 'Electric arc furnace process optimization',
    icon: '⚡',
    features: ['Power optimization', 'Temperature control', 'Energy efficiency'],
    businessImpact: 'Reduces energy costs and improves melting efficiency',
  },
  MTC: {
    id: 'MTC',
    name: 'Material Tracking & Control',
    description: 'Material tracking and inventory control system',
    icon: '📊',
    features: ['Real-time tracking', 'Inventory management', 'Cost optimization'],
    businessImpact: 'Reduces material waste and improves cost control',
  },
  IF: {
    id: 'IF',
    name: 'Induction Furnace',
    description: 'Induction furnace process control and optimization',
    icon: '🔥',
    features: ['Temperature control', 'Chargemix optimization', 'Process automation'],
    businessImpact: 'Improves melting consistency and reduces cycle time',
  },
  CHARGEMIX: {
    id: 'CHARGEMIX',
    name: 'Charge Mix Optimization',
    description: 'Optimize raw material charge mix for better efficiency',
    icon: '⚖️',
    features: ['Mix calculation', 'Cost optimization', 'Quality prediction'],
    businessImpact: 'Reduces raw material costs and improves final quality',
  },
};

// Validation utilities
export const validateTemperatureRange = (min: number, max: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (min >= max) {
    errors.push({
      field: 'temperature',
      message: 'Minimum temperature must be less than maximum temperature',
    });
  }
  
  if (min < 800 || min > 2000) {
    errors.push({
      field: 'tappingTemperatureMin',
      message: 'Minimum temperature must be between 800°C and 2000°C',
    });
  }
  
  if (max < 800 || max > 2000) {
    errors.push({
      field: 'tappingTemperatureMax',
      message: 'Maximum temperature must be between 800°C and 2000°C',
    });
  }
  
  return errors;
};

export const validateChemicalElement = (element: ChemicalElement): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (element.finalMin >= element.finalMax) {
    errors.push({
      field: `${element.element}_final`,
      message: `Final minimum must be less than final maximum for ${element.element}`,
    });
  }
  
  if (element.bathMin !== undefined && element.bathMax !== undefined) {
    if (element.bathMin >= element.bathMax) {
      errors.push({
        field: `${element.element}_bath`,
        message: `Bath minimum must be less than bath maximum for ${element.element}`,
      });
    }
  }
  
  if (element.toleranceMin >= element.toleranceMax) {
    errors.push({
      field: `${element.element}_tolerance`,
      message: `Tolerance minimum must be less than tolerance maximum for ${element.element}`,
    });
  }
  
  if (element.toleranceMin < 0 || element.toleranceMax < 0) {
    errors.push({
      field: `${element.element}_tolerance`,
      message: `Tolerance values must be positive for ${element.element}`,
    });
  }
  
  return errors;
};

export const validateChargemixMaterials = (materials: import('../types').ChargemixMaterial[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const totalPercentage = materials.reduce((sum, material) => sum + material.percentage, 0);
  
  if (totalPercentage > 100) {
    errors.push({
      field: 'chargemix_total',
      message: 'Total percentage cannot exceed 100%',
    });
  }
  
  materials.forEach((material, index) => {
    if (material.percentage < 0) {
      errors.push({
        field: `chargemix_${index}`,
        message: `Percentage must be positive for ${material.name}`,
      });
    }
  });
  
  // Check for duplicate material names
  const materialNames = materials.map(m => m.name.toLowerCase());
  const duplicates = materialNames.filter((name, index) => materialNames.indexOf(name) !== index);
  
  if (duplicates.length > 0) {
    errors.push({
      field: 'chargemix_duplicates',
      message: 'Material names must be unique',
    });
  }
  
  return errors;
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Format percentage for display
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// CSS class utilities for design system
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};


