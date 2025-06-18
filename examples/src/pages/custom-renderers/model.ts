import type { FormModel } from '../../../model';

/**
 * Extended field interface to support custom renderers
 */
export interface CustomFieldConfig {
  customRenderer?: 'characterCount' | 'starRating' | 'tagInput' | 'colorPicker';
  maxLength?: number;
  placeholder?: string;
  helpText?: string;
}

/**
 * Custom renderer validation functions
 */
const validateRating = (value: unknown): string[] => {
  const rating = Number(value);
  
  if (!value) {
    return ['Please provide a rating'];
  }
  
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return ['Rating must be between 1 and 5 stars'];
  }
  
  return [];
};

const validateTags = (value: unknown): string[] => {
  const tags = Array.isArray(value) ? value : [];
  
  if (tags.length === 0) {
    return ['Please add at least one skill/tag'];
  }
  
  if (tags.length > 10) {
    return ['Maximum 10 tags allowed'];
  }
  
  return [];
};

const validateColor = (value: unknown): string[] => {
  const color = String(value || '');
  
  if (!color) {
    return ['Please select a color'];
  }
  
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return ['Please enter a valid hex color (e.g., #FF0000)'];
  }
  
  return [];
};

/**
 * Custom renderers form model
 */
export const customRenderersFormModel: FormModel = [
  {
    key: 'username',
    type: 'text',
    label: 'Username',
    validators: {
      required: true
    },
    // Extended properties for custom renderer
    customRenderer: 'characterCount',
    maxLength: 20,
    placeholder: 'Enter your username',
    helpText: 'Username with character count'
  } as any,
  {
    key: 'rating',
    type: 'text', // We'll handle this as text but render as stars
    label: 'Rating',
    validators: {
      custom: validateRating
    },
    customRenderer: 'starRating',
    helpText: 'Rate from 1 to 5 stars'
  } as any,
  {
    key: 'tags',
    type: 'array',
    label: 'Skills/Tags',
    validators: {
      custom: validateTags
    },
    customRenderer: 'tagInput',
    placeholder: 'Add your skills',
    helpText: 'Type skills and press Enter'
  } as any,
  {
    key: 'favoriteColor',
    type: 'text',
    label: 'Favorite Color',
    validators: {
      custom: validateColor
    },
    customRenderer: 'colorPicker',
    helpText: 'Pick your favorite color'
  } as any,
  {
    key: 'theme',
    type: 'select',
    label: 'Preferred Theme',
    validators: {
      required: true
    },
    options: async () => [
      { value: 'light', label: 'Light Theme' },
      { value: 'dark', label: 'Dark Theme' },
      { value: 'auto', label: 'System Default' }
    ],
    helpText: 'Choose your preferred UI theme'
  }
];

/**
 * Initial form values for custom renderers
 */
export const initialCustomRenderersValues = {
  username: '',
  rating: '0',
  tags: [],
  favoriteColor: '#3366cc',
  theme: ''
};

/**
 * Color presets for color picker
 */
export const COLOR_PRESETS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000000'
];

/**
 * Form submission handler with custom value processing
 */
export const handleCustomRenderersSubmit = async (values: any) => {
  console.log('🎨 Custom renderers form submitted:', values);
  
  // Process the custom field values
  const processedValues = {
    ...values,
    rating: parseInt(values.rating as string) || 0,
    tags: Array.isArray(values.tags) ? values.tags : [],
    favoriteColor: values.favoriteColor || '#000000'
  };
  
  console.log('✨ Processed values:', processedValues);
  return { success: true, data: processedValues };
};

/**
 * Utility functions for custom renderers
 */
export const getCharacterCountStatus = (value: string, maxLength: number) => {
  const length = value?.length || 0;
  const remaining = maxLength - length;
  const isNearLimit = remaining < 10;
  const isAtLimit = length >= maxLength;
  
  let statusText = `${remaining} characters remaining.`;
  if (isAtLimit) statusText = 'You have reached the limit.';
  else if (isNearLimit) statusText = `Warning: Only ${remaining} characters left.`;

  return {
    count: length,
    limit: maxLength,
    remaining,
    isNearLimit,
    isAtLimit,
    isWarning: isNearLimit || isAtLimit,
    statusText,
  };
};

export const getRatingDisplay = (rating: number) => ({
  stars: '★'.repeat(rating) + '☆'.repeat(5 - rating),
  text: rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'No rating',
  percentage: (rating / 5) * 100
});

export const getTagsStatus = (tags: string[]) => {
  const count = tags.length;
  const isAtLimit = count >= 10;
  
  let statusText = `${count} tags added.`;
  if (isAtLimit) statusText = 'You have reached the tag limit.';
  
  return {
    count,
    isEmpty: count === 0,
    isNearLimit: count >= 8,
    isAtLimit,
    totalCharacters: tags.join('').length,
    statusText,
  };
};

export const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

export const getColorBrightness = (hexColor: string): number => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

export const getContrastColor = (hexColor: string): string => {
  return getColorBrightness(hexColor) > 128 ? '#000000' : '#FFFFFF';
}; 