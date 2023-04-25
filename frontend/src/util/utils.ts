import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { TFunction } from "react-i18next";
import { NavigateFunction } from "react-router-dom";
import { ServerApiValidationError } from "./error-handling/ServerApiValidationError";

export interface IButtonProps {
  titleLocalizationKey: string;
  onClick: () => Promise<void>;
  showErrorColor?: boolean;
}

export const getBackButtonProps = (navigate: NavigateFunction, customTitleLocalizationKey?: string): IButtonProps => ({
  titleLocalizationKey: customTitleLocalizationKey ?? "common.backButton",
  onClick: async () => navigate(-1),
});

export const handleErrorsWithToast = (e: unknown, t: TFunction<"translation">): void => {
  let errorMessage: string;

  if (e instanceof ServerApiValidationError) {
    errorMessage = `${t("common.errors.serverValidationError")}:\n${e.message}`;
  } else if (e instanceof AxiosError) {
    errorMessage = t("common.errors.serverCommunicationError");
  } else {
    errorMessage = t("common.errors.contactAdmin");
  }

  toast.error(errorMessage);
};
