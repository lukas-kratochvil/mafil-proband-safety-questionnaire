import { NavigateFunction } from "react-router-dom";

export interface IButtonProps {
  titleLocalizationKey: string;
  onClick: () => void;
  showErrorColor?: boolean;
}

export const getBackButtonProps = (navigate: NavigateFunction, customTitleLocalizationKey?: string): IButtonProps => ({
  titleLocalizationKey: customTitleLocalizationKey ?? "common.backButton",
  onClick: () => navigate(-1),
});
