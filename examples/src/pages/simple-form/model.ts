import type { FormModel } from 'react-form-builder-ts';

// Type definitions for API responses
export interface CategoryOption {
  value: string;
  label: string;
}

export interface SubCategoryData {
  [key: string]: CategoryOption[];
}

export interface ItemData {
  [key: string]: CategoryOption[];
}

export interface RelatedPartsData {
  [key: string]: CategoryOption[];
}

// Mock API data
export const categoryData: CategoryOption[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
];

export const subCategoryData: SubCategoryData = {
  electronics: [
    { value: 'phones', label: 'Mobile Phones' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'accessories', label: 'Accessories' },
  ],
  clothing: [
    { value: 'mens', label: 'Men\'s Clothing' },
    { value: 'womens', label: 'Women\'s Clothing' },
    { value: 'kids', label: 'Kids Clothing' },
  ],
  home: [
    { value: 'furniture', label: 'Furniture' },
    { value: 'garden', label: 'Garden Tools' },
    { value: 'decor', label: 'Home Decor' },
  ],
};

export const itemData: ItemData = {
  phones: [
    { value: 'iphone', label: 'iPhone' },
    { value: 'samsung', label: 'Samsung Galaxy' },
    { value: 'pixel', label: 'Google Pixel' },
  ],
  laptops: [
    { value: 'macbook', label: 'MacBook' },
    { value: 'thinkpad', label: 'ThinkPad' },
    { value: 'surface', label: 'Surface Laptop' },
  ],
  accessories: [
    { value: 'case', label: 'Phone Cases' },
    { value: 'charger', label: 'Chargers' },
    { value: 'headphones', label: 'Headphones' },
  ],
  mens: [
    { value: 'shirts', label: 'Shirts' },
    { value: 'pants', label: 'Pants' },
    { value: 'shoes', label: 'Shoes' },
  ],
  womens: [
    { value: 'dresses', label: 'Dresses' },
    { value: 'tops', label: 'Tops' },
    { value: 'bags', label: 'Handbags' },
  ],
  kids: [
    { value: 'toys', label: 'Toys' },
    { value: 'clothes', label: 'Clothes' },
    { value: 'books', label: 'Books' },
  ],
  furniture: [
    { value: 'sofa', label: 'Sofas' },
    { value: 'table', label: 'Tables' },
    { value: 'chair', label: 'Chairs' },
  ],
  garden: [
    { value: 'tools', label: 'Hand Tools' },
    { value: 'plants', label: 'Plants' },
    { value: 'pots', label: 'Planters' },
  ],
  decor: [
    { value: 'art', label: 'Wall Art' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'rugs', label: 'Rugs' },
  ],
};

export const relatedPartsData: RelatedPartsData = {
  phones: [
    { value: 'case', label: 'Protective Case' },
    { value: 'screen', label: 'Screen Protector' },
    { value: 'charger', label: 'Wireless Charger' },
  ],
  laptops: [
    { value: 'mouse', label: 'Wireless Mouse' },
    { value: 'keyboard', label: 'External Keyboard' },
    { value: 'stand', label: 'Laptop Stand' },
  ],
  accessories: [
    { value: 'cable', label: 'USB Cable' },
    { value: 'adapter', label: 'Power Adapter' },
    { value: 'storage', label: 'Memory Card' },
  ],
  mens: [
    { value: 'belt', label: 'Leather Belt' },
    { value: 'tie', label: 'Neck Tie' },
    { value: 'wallet', label: 'Wallet' },
  ],
  womens: [
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'scarf', label: 'Scarf' },
    { value: 'sunglasses', label: 'Sunglasses' },
  ],
  kids: [
    { value: 'backpack', label: 'School Backpack' },
    { value: 'lunchbox', label: 'Lunch Box' },
    { value: 'water', label: 'Water Bottle' },
  ],
  furniture: [
    { value: 'cushion', label: 'Cushions' },
    { value: 'cover', label: 'Furniture Cover' },
    { value: 'legs', label: 'Replacement Legs' },
  ],
  garden: [
    { value: 'gloves', label: 'Garden Gloves' },
    { value: 'fertilizer', label: 'Plant Fertilizer' },
    { value: 'soil', label: 'Potting Soil' },
  ],
  decor: [
    { value: 'frame', label: 'Picture Frame' },
    { value: 'hooks', label: 'Wall Hooks' },
    { value: 'candles', label: 'Scented Candles' },
  ],
};

// API simulation functions
export const loadSubCategories = async (values: Record<string, unknown>): Promise<CategoryOption[]> => {
  const category = values.category as string;
  return subCategoryData[category] || [];
};

export const loadItems = async (values: Record<string, unknown>): Promise<CategoryOption[]> => {
  const subCategory = values.subCategory as string;
  return itemData[subCategory] || [];
};

export const loadRelatedParts = async (values: Record<string, unknown>): Promise<CategoryOption[]> => {
  const subCategory = values.subCategory as string;
  return relatedPartsData[subCategory] || [];
};

// Form model definition
export const simpleFormModel: FormModel = [
  {
    key: 'category',
    type: 'select',
    label: 'Category',
    layout: { row: 0, col: 0 },
    validators: { required: true },
    options: async () => categoryData,
  },
  {
    key: 'subCategory',
    type: 'select',
    label: 'Sub Category',
    layout: { row: 0, col: 1 },
    validators: { required: true },
    disabled: true,
    dynamicOptions: {
      trigger: ['category'],
      loader: loadSubCategories,
    },
    dependencies: [
      {
        field: 'category',
        condition: (value) => !!value && value !== '',
        overrides: { disabled: false },
      },
    ],
  },
  {
    key: 'item',
    type: 'select',
    label: 'Item',
    layout: { row: 1, col: 0 },
    validators: { required: true },
    disabled: true,
    dynamicOptions: {
      trigger: ['subCategory'],
      loader: loadItems,
    },
    dependencies: [
      {
        field: 'subCategory',
        condition: (value) => !!value && value !== '',
        overrides: { disabled: false },
      },
    ],
  },
  {
    key: 'name',
    type: 'text',
    label: 'Name',
    layout: { row: 1, col: 1 },
    validators: { required: true },
  },
  {
    key: 'quantity',
    type: 'number',
    label: 'Quantity',
    layout: { row: 2, col: 0 },
    validators: { required: true, min: 1 },
  },
  {
    key: 'relatedParts',
    type: 'select',
    label: 'Related Parts',
    layout: { row: 2, col: 1 },
    disabled: true,
    dynamicOptions: {
      trigger: ['subCategory'],
      loader: loadRelatedParts,
    },
    dependencies: [
      {
        field: 'subCategory',
        condition: (value) => !!value && value !== '',
        overrides: { disabled: false },
      },
    ],
  },
];

// Initial form values
export const initialFormValues = {
  category: '',
  subCategory: '',
  item: '',
  name: '',
  quantity: 1,
  relatedParts: '',
}; 