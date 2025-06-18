import type { FormModel } from '../../../../src/model';

// 1. Basic Grid Layout
export const basicGridModel: FormModel = [
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    validators: { required: true },
    layout: { row: 1, col: 1, colSpan: 1 },
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    validators: { required: true },
    layout: { row: 1, col: 2, colSpan: 1 },
  },
  {
    key: 'email',
    type: 'text',
    label: 'Email Address',
    validators: {
      custom: (value: unknown) => {
        const email = String(value || '').trim();
        if (!email) return ['Email is required'];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return ['Please enter a valid email address'];
        return [];
      },
    },
    layout: { row: 2, col: 1, colSpan: 2 },
  },
  {
    key: 'phone',
    type: 'text',
    label: 'Phone Number',
    validators: { required: true },
    layout: { row: 3, col: 1, colSpan: 1 },
  },
  {
    key: 'birthDate',
    type: 'text',
    label: 'Birth Date',
    validators: { required: true },
    layout: { row: 3, col: 2, colSpan: 1 },
  },
];

// 2. Advanced Grid Layout with Spans
export const advancedGridModel: FormModel = [
  {
    key: 'title',
    type: 'text',
    label: 'Form Title',
    validators: { required: true },
    layout: { row: 1, col: 1, colSpan: 3, className: 'title-field' },
  },
  {
    key: 'description',
    type: 'text',
    label: 'Description',
    validators: { required: true },
    layout: { row: 2, col: 1, colSpan: 3, rowSpan: 2, className: 'description-field' },
  },
  {
    key: 'category',
    type: 'select',
    label: 'Category',
    validators: { required: true },
    options: async () => [
      { value: 'personal', label: 'Personal' },
      { value: 'business', label: 'Business' },
      { value: 'education', label: 'Education' },
      { value: 'other', label: 'Other' },
    ],
    layout: { row: 4, col: 1, colSpan: 1 },
  },
  {
    key: 'priority',
    type: 'select',
    label: 'Priority',
    validators: { required: true },
    options: async () => [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'urgent', label: 'Urgent' },
    ],
    layout: { row: 4, col: 2, colSpan: 1 },
  },
  {
    key: 'tags',
    type: 'text',
    label: 'Tags (comma-separated)',
    layout: { row: 4, col: 3, colSpan: 1 },
  },
];

// 3. Responsive Layout
export const responsiveModel: FormModel = [
  {
    key: 'companyName',
    type: 'text',
    label: 'Company Name',
    validators: { required: true },
    layout: { row: 1, col: 1, colSpan: 4, className: 'company-field' },
  },
  {
    key: 'address1',
    type: 'text',
    label: 'Address Line 1',
    validators: { required: true },
    layout: { row: 2, col: 1, colSpan: 3 },
  },
  {
    key: 'addressType',
    type: 'select',
    label: 'Type',
    validators: { required: true },
    options: async () => [
      { value: 'home', label: 'Home' },
      { value: 'office', label: 'Office' },
      { value: 'other', label: 'Other' },
    ],
    layout: { row: 2, col: 4, colSpan: 1 },
  },
  {
    key: 'address2',
    type: 'text',
    label: 'Address Line 2',
    layout: { row: 3, col: 1, colSpan: 4 },
  },
  {
    key: 'city',
    type: 'text',
    label: 'City',
    validators: { required: true },
    layout: { row: 4, col: 1, colSpan: 2 },
  },
  {
    key: 'state',
    type: 'text',
    label: 'State',
    validators: { required: true },
    layout: { row: 4, col: 3, colSpan: 1 },
  },
  {
    key: 'zip',
    type: 'text',
    label: 'ZIP',
    validators: { required: true },
    layout: { row: 4, col: 4, colSpan: 1 },
  },
];

// 4. Complex Multi-Section Layout
export const complexLayoutModel: FormModel = [
  // Header Section
  {
    key: 'applicationTitle',
    type: 'text',
    label: 'Application Title',
    validators: { required: true },
    layout: { row: 1, col: 1, colSpan: 6, className: 'section-header' },
  },

  // Personal Info Section
  {
    key: 'personalFirstName',
    type: 'text',
    label: 'First Name',
    validators: { required: true },
    layout: { row: 2, col: 1, colSpan: 2, className: 'personal-section' },
  },
  {
    key: 'personalMiddleName',
    type: 'text',
    label: 'Middle Name',
    layout: { row: 2, col: 3, colSpan: 2, className: 'personal-section' },
  },
  {
    key: 'personalLastName',
    type: 'text',
    label: 'Last Name',
    validators: { required: true },
    layout: { row: 2, col: 5, colSpan: 2, className: 'personal-section' },
  },
  {
    key: 'personalEmail',
    type: 'text',
    label: 'Email',
    validators: {
      custom: (value: unknown) => {
        const email = String(value || '').trim();
        if (!email) return ['Email is required'];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return ['Please enter a valid email address'];
        return [];
      },
    },
    layout: { row: 3, col: 1, colSpan: 3, className: 'personal-section' },
  },
  {
    key: 'personalPhone',
    type: 'text',
    label: 'Phone',
    validators: { required: true },
    layout: { row: 3, col: 4, colSpan: 3, className: 'personal-section' },
  },

  // Professional Info Section
  {
    key: 'jobTitle',
    type: 'text',
    label: 'Job Title',
    validators: { required: true },
    layout: { row: 4, col: 1, colSpan: 3, className: 'professional-section' },
  },
  {
    key: 'department',
    type: 'select',
    label: 'Department',
    validators: { required: true },
    options: async () => [
      { value: 'engineering', label: 'Engineering' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'hr', label: 'Human Resources' },
      { value: 'finance', label: 'Finance' },
    ],
    layout: { row: 4, col: 4, colSpan: 3, className: 'professional-section' },
  },
  {
    key: 'experience',
    type: 'select',
    label: 'Years of Experience',
    validators: { required: true },
    options: async () => [
      { value: '0-1', label: '0-1 years' },
      { value: '2-5', label: '2-5 years' },
      { value: '6-10', label: '6-10 years' },
      { value: '10+', label: '10+ years' },
    ],
    layout: { row: 5, col: 1, colSpan: 2, className: 'professional-section' },
  },
  {
    key: 'startDate',
    type: 'text',
    label: 'Start Date',
    validators: { required: true },
    layout: { row: 5, col: 3, colSpan: 2, className: 'professional-section' },
  },

  // Footer Section
  {
    key: 'agreeTerms',
    type: 'checkbox',
    label: 'I agree to the terms and conditions',
    validators: { required: true },
    layout: { row: 6, col: 1, colSpan: 6, className: 'footer-section' },
  },
]; 