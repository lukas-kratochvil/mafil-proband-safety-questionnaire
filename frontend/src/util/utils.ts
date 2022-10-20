import { NavigateFunction } from "react-router-dom";

export type Override<T, U> = Omit<T, keyof U> & U;

export interface IButton {
  titleLocalizationKey: string;
  onClick: () => void;
}

export const getBackButtonProps = (navigate: NavigateFunction, titleLocalizationKey?: string): IButton => ({
  titleLocalizationKey: titleLocalizationKey ?? "common.backButton",
  onClick: () => navigate(-1),
});
