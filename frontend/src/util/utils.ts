import { NavigateFunction } from "react-router-dom";
import { LocalizationKeys } from "@app/i18n";
import { FormPropType } from "@app/model/form";
import { ITranslation } from "./server_API/dto";

export type Override<T, U> = Omit<T, keyof U> & U;

export interface IButtonProps {
  titleLocalizationKey: string;
  onClick: () => void;
  showErrorColor?: boolean;
}

export interface ISubmitButtonProps extends Omit<IButtonProps, "onClick"> {
  onClick: (data: FormPropType) => Promise<void>;
}

export const getBackButtonProps = (navigate: NavigateFunction, customTitleLocalizationKey?: string): IButtonProps => ({
  titleLocalizationKey: customTitleLocalizationKey ?? "common.backButton",
  onClick: () => navigate(-1),
});

export const getTranslation = (translations: ITranslation[], languageCode: LocalizationKeys): string => {
  if (translations.length === 0) {
    return "";
  }

  return translations.find((trans) => trans.language.code === languageCode)?.text || translations[0].text;
};
