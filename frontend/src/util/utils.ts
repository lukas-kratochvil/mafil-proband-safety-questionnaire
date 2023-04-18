import { NavigateFunction } from "react-router-dom";
import { FormPropType } from "@app/model/form";

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
