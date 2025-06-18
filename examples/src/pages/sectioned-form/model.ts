import { FormModel, FieldSection } from '@dynamic_forms/react';

/**
 * Section definitions for the sectioned form example
 */
export const sections: FieldSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic information about yourself',
    collapsible: true,
    layout: { columns: 2, gap: '1rem' }
  },
  {
    id: 'address',
    title: 'Address Information',
    description: 'Your current address details',
    collapsible: true,
    layout: { columns: 1 }
  },
  {
    id: 'preferences',
    title: 'Preferences',
    collapsible: true,
    collapsed: true, // Start collapsed
    layout: { columns: 2 }
  },
  {
    id: 'hidden-section',
    // No title = headerless section
    layout: { columns: 1 }
  }
];

/**
 * Form model with section assignments
 */
export const formModel: FormModel = [
  // Personal Information Section
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    validators: { required: true },
    section: { sectionId: 'personal', order: 1 }
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    validators: { required: true },
    section: { sectionId: 'personal', order: 2 }
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email',
    validators: { required: true },
    section: { sectionId: 'personal', order: 3 }
  },
  {
    key: 'phone',
    type: 'text',
    label: 'Phone Number',
    section: { sectionId: 'personal', order: 4 }
  },

  // Address Information Section
  {
    key: 'street',
    type: 'text',
    label: 'Street Address',
    validators: { required: true },
    section: { sectionId: 'address', order: 1 }
  },
  {
    key: 'city',
    type: 'text',
    label: 'City',
    validators: { required: true },
    section: { sectionId: 'address', order: 2 }
  },
  {
    key: 'zipCode',
    type: 'text',
    label: 'ZIP Code',
    validators: { required: true },
    section: { sectionId: 'address', order: 3 }
  },

  // Preferences Section
  {
    key: 'newsletter',
    type: 'checkbox',
    label: 'Subscribe to newsletter',
    section: { sectionId: 'preferences', order: 1 }
  },
  {
    key: 'notifications',
    type: 'select',
    label: 'Notification Preferences',
    options: async () => [
      { value: 'all', label: 'All notifications' },
      { value: 'important', label: 'Important only' },
      { value: 'none', label: 'None' }
    ],
    section: { sectionId: 'preferences', order: 2 }
  },

  // Hidden Section (no title)
  {
    key: 'internalId',
    type: 'text',
    label: 'Internal ID',
    section: { sectionId: 'hidden-section', order: 1 }
  }
];

/**
 * Combined sectioned model
 */
export const sectionedModel = {
  sections,
  fields: formModel,
  layout: {
    orientation: 'vertical' as const,
    renderMode: 'grouped' as const
  }
}; 