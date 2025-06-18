import { useMemo } from 'react';
import { useEnhancedForm } from '../../enhanced-hooks';
import { allFieldsModel, initialDependenciesValues, handleDependenciesSubmit } from './model';

/**
 * Main dependencies form hook, refactored for efficiency and clarity.
 */
export const useDependenciesForm = () => {
  const form = useEnhancedForm(allFieldsModel, {
    initialValues: initialDependenciesValues,
    formId: 'dependencies-form',
    enableAnalytics: true,
  });

  const { config, values, isFieldVisible } = form;
  const accountType = values.accountType as string;

  const handleSubmit = async (formValues: any) => {
    return await handleDependenciesSubmit(formValues, accountType);
  };

  const dependencyStats = useMemo(() => {
    const visibleFields = config.fields.filter(field => isFieldVisible(field.path));
    const requiredFields = visibleFields.filter(field => field.validators?.required);

    return {
      visibleFieldsCount: visibleFields.length,
      requiredFieldsCount: requiredFields.length,
      totalFieldsCount: config.fields.length,
      accountType,
    };
  }, [config.fields, isFieldVisible, accountType]);

  return {
    form,
    handleSubmit,
    dependencyStats,
  };
}; 