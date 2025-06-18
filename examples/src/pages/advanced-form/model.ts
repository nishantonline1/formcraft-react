import type { FormModel } from 'react-form-builder-ts';

export const advancedFormModel: FormModel = [
  // Step 1: Personal Info (Layout) & Profile (Section)
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    validators: { required: true },
    layout: { row: 1, col: 1, colSpan: 1 },
    meta: { step: 1 },
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    validators: { required: true },
    layout: { row: 1, col: 2, colSpan: 1 },
    meta: { step: 1 },
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email Address',
    validators: {
      required: true,
      custom: (value: unknown) => {
        const email = String(value || '').trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return ['Invalid email format'];
        }
        return [];
      },
    },
    layout: { row: 2, col: 1, colSpan: 2 },
    meta: { step: 1 },
  },
  {
    key: 'profileBio',
    type: 'text',
    label: 'Biography',
    section: { sectionId: 'profile', order: 1 },
    meta: { step: 1 },
  },
  {
    key: 'profileWebsite',
    type: 'text',
    label: 'Website',
    section: { sectionId: 'profile', order: 2 },
    meta: { step: 1, sectionConfig: { id: 'profile', title: 'User Profile' } },
  },

  // Step 2: Nested Arrays
  {
    key: 'experiences',
    type: 'array',
    label: 'Work Experiences',
    meta: { step: 2 },
    itemModel: [
      { key: 'company', type: 'text', label: 'Company', validators: { required: true } },
      { key: 'role', type: 'text', label: 'Role', validators: { required: true } },
      {
        key: 'projects',
        type: 'array',
        label: 'Projects',
        itemModel: [
          { key: 'projectName', type: 'text', label: 'Project Name', validators: { required: true } },
          { key: 'projectDescription', type: 'text', label: 'Project Description' },
          {
            key: 'tasks',
            type: 'array',
            label: 'Tasks',
            itemModel: [
              { key: 'taskName', type: 'text', label: 'Task Name', validators: { required: true } },
              { key: 'taskCompleted', type: 'checkbox', label: 'Completed' },
            ],
          },
        ],
      },
    ],
  },
];
