import { NavigateFunction } from "react-router-dom";
import { FormPropType } from "@interfaces/form";

export type Override<T, U> = Omit<T, keyof U> & U;

export interface IButtonProps {
  titleLocalizationKey: string;
  onClick: () => void;
  showErrorColor?: boolean;
}

export interface ISubmitButtonProps extends Omit<IButtonProps, "onClick"> {
  onClick: (data: FormPropType) => void;
}

export const getBackButtonProps = (navigate: NavigateFunction, customTitleLocalizationKey?: string): IButtonProps => ({
  titleLocalizationKey: customTitleLocalizationKey ?? "common.backButton",
  onClick: () => navigate(-1),
});

export const convertStringToLocalizationKey = (str: string): TemplateStringsArray =>
  str as unknown as TemplateStringsArray;
