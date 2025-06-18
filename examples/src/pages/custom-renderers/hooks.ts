import { useMemo, useCallback } from 'react';
import { useEnhancedForm } from '../../enhanced-hooks';
import { 
  customRenderersFormModel, 
  initialCustomRenderersValues, 
  handleCustomRenderersSubmit,
  getCharacterCountStatus,
  getRatingDisplay,
  getTagsStatus,
  getContrastColor
} from './model';

/**
 * Main hook for the custom renderers form, now using useEnhancedForm.
 */
export const useCustomRenderersForm = () => {
  const form = useEnhancedForm(customRenderersFormModel, {
    initialValues: initialCustomRenderersValues,
    formId: 'custom-renderers-form',
    enableAnalytics: true,
  });

  const { values } = form;

  const handleSubmit = useCallback(async (formValues: any) => {
    return await handleCustomRenderersSubmit(formValues);
  }, []);

  const customStats = useMemo(() => {
    const { username = '', rating = 0, tags = [], favoriteColor = '#ffffff', theme = '' } = values;
    
    const usernameStatus = getCharacterCountStatus(username as string, 20);
    const ratingDisplay = getRatingDisplay(rating as number);
    const tagsStatus = getTagsStatus(tags as string[]);
    const colorContrast = getContrastColor(favoriteColor as string);

    return {
      username: { value: username, ...usernameStatus },
      rating: { value: rating, ...ratingDisplay },
      tags: { value: tags, ...tagsStatus },
      favoriteColor: { value: favoriteColor, contrastColor: colorContrast },
      theme: { value: theme, isSelected: !!theme },
    };
  }, [values]);

  return {
    form,
    handleSubmit,
    customStats,
  };
}; 