import { NavigateFunction } from "react-router-dom";
import { FormPropType } from "../components/form/types/types";

export type Override<T, U> = Omit<T, keyof U> & U;

export interface IButton {
  titleLocalizationKey: string;
  onClick: () => void;
}

export interface ISubmitButtonProps extends Omit<IButton, "onClick"> {
  onClick: (data: FormPropType) => void;
}

export const getBackButtonProps = (navigate: NavigateFunction, customTitleLocalizationKey?: string): IButton => ({
  titleLocalizationKey: customTitleLocalizationKey ?? "common.backButton",
  onClick: () => navigate(-1),
});

export const convertStringToLocalizationKey = (str: string): TemplateStringsArray =>
  str as unknown as TemplateStringsArray;
