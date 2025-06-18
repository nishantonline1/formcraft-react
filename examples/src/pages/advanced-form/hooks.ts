import { useForm } from 'react-form-builder-ts';
import { advancedFormModel } from './model';

export const useAdvancedForm = () => {
  return useForm(advancedFormModel, {
    initialValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      experiences: [
        {
          company: 'FormBuilder Inc.',
          role: 'Lead Developer',
          projects: [
            {
              projectName: 'Wizard Form',
              tasks: [{ taskName: 'Initial setup' }, { taskName: 'Styling' }],
            },
          ],
        },
      ],
    },
  });
};
