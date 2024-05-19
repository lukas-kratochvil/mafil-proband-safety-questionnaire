import { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { TFunction } from "react-i18next";
import type { NavigateFunction } from "react-router-dom";
import { convertStringToLocalizationKey } from "@app/i18n/i18n";
import { LocalizedError } from "./error-handling/LocalizedError";
import { ServerApiValidationError } from "./error-handling/ServerApiValidationError";

export type ObjectValues<T> = T[keyof T];

export type ButtonProps = {
  titleLocalizationKey: string;
  onClick: () => Promise<void>;
  showErrorColor?: boolean;
};

export const getBackButtonProps = (navigate: NavigateFunction, customTitleLocalizationKey?: string): ButtonProps => ({
  titleLocalizationKey: customTitleLocalizationKey ?? "common.backButton",
  onClick: async () => navigate(-1),
});

const logError = (errorMessage: string) => {
  fetch("/client-error-log", {
    method: "post",
    headers: {
      Accept: "text/plain",
      "Content-Type": "text/plain",
    },
    body: errorMessage,
  });
}

export const handleErrorsWithToast = (e: unknown, t: TFunction<"translation">): void => {
  let errorMessage: string;

  if (e instanceof Error) {
    if (e instanceof ServerApiValidationError) {
      errorMessage = `${t("common.errors.serverValidationError")}:\n${e.message}`;
    } else if (e instanceof LocalizedError) {
      errorMessage = t(convertStringToLocalizationKey(e.localizationKey));
    } else if (e instanceof AxiosError) {
      errorMessage = t("common.errors.serverCommunicationError");
    } else {
      errorMessage = t("common.errors.contactAdmin");
    }

    logError(`[Error]: ${e.message}`);
  } else {
    errorMessage = t("common.errors.contactAdmin");
    logError(`[Unpredicted error]: ${e}`);
  }

  toast.error(errorMessage, { duration: 6000 });
};
