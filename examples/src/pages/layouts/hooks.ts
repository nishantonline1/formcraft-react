import { useEnhancedForm } from '../../enhanced-hooks';
import {
  basicGridModel,
  advancedGridModel,
  responsiveModel,
  complexLayoutModel,
} from './model';

export const useBasicGridForm = () => {
  return useEnhancedForm(basicGridModel);
};

export const useAdvancedGridForm = () => {
  return useEnhancedForm(advancedGridModel);
};

export const useResponsiveForm = () => {
  return useEnhancedForm(responsiveModel);
};

export const useComplexLayoutForm = () => {
  return useEnhancedForm(complexLayoutModel);
}; 