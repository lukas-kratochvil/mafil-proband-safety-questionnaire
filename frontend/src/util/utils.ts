import { AxiosError } from "axios";
import type { TFunction } from "i18next";
import isBase64 from "is-base64";
import toast from "react-hot-toast";
import { convertStringToLocalizationKey, type defaultNS } from "@app/i18n/i18n";
import type { Either } from "@app/types";
import { LocalizedError } from "./error-handling/LocalizedError";
import { ServerApiValidationError } from "./error-handling/ServerApiValidationError";

export type ButtonProps = {
  titleLocalizationKey: string;
  showErrorColor?: boolean;
} & Either<{ href: string }, { onClick: () => Promise<void> }>;

export const getBackButtonProps = (customTitleLocalizationKey?: string): ButtonProps => ({
  titleLocalizationKey: customTitleLocalizationKey ?? "common.backButton",
  onClick: async () => window.history.back(),
});

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

export const isBase64PDFContent = (content: string): boolean =>
  isBase64(content, { allowEmpty: false, paddingRequired: true });
