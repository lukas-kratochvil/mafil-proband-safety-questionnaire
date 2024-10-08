import { AxiosError } from "axios";
import type { TFunction } from "i18next";
import isBase64 from "is-base64";
import toast from "react-hot-toast";
import type { NavigateFunction } from "react-router-dom";
import { convertStringToLocalizationKey, type defaultNS } from "@app/i18n/i18n";
import type { Either } from "@app/types";
import { LocalizedError } from "./error-handling/LocalizedError";
import { ServerApiValidationError } from "./error-handling/ServerApiValidationError";

/**
 * `Location` (from the react-router-dom) state type for a visit duplication from the recent-visits table.
 */
export type DuplicationFormPageLocationState = {
  isPhantom: boolean;
};

/**
 * Basic button properties to be used in this app.
 */
export type ButtonProps = {
  titleLocalizationKey: string;
  showErrorColor?: boolean;
} & Either<{ urlPath: string }, { onClick: () => Promise<void> }>;

/**
 * Factory for back button properties.
 */
export const getBackButtonProps = (navigate: NavigateFunction, customTitleLocalizationKey?: string): ButtonProps => ({
  titleLocalizationKey: customTitleLocalizationKey ?? "common.backButton",
  onClick: async () => navigate(-1),
});

/**
 * Handles all possible errors and displays them in a toast notification.
 */
export const handleErrorsWithToast = (e: unknown, t: TFunction<typeof defaultNS>): void => {
  let errorMessage: string;

  if (e instanceof ServerApiValidationError) {
    errorMessage = `${t("common.errors.serverValidationError")}:\n${e.message}`;
  } else if (e instanceof LocalizedError) {
    errorMessage = t(convertStringToLocalizationKey(e.localizationKey));
  } else if (e instanceof AxiosError) {
    errorMessage = t("common.errors.serverCommunicationError");
  } else {
    errorMessage = t("common.errors.contactAdmin");
  }

  toast.error(errorMessage, { duration: 6000 });
};

/**
 * Checks if the given string is encoded in base64.
 */
export const isBase64PDFContent = (content: string): boolean =>
  isBase64(content, { allowEmpty: false, paddingRequired: true });
