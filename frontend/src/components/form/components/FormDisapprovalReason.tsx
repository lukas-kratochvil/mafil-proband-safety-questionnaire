import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { FormTextField } from "../inputs/FormTextField";
import { FormCardContainer } from "./FormCardContainer";

export const FormDisapprovalReason = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.disapprovalReason" });

  return (
    <FormCardContainer title={t("title")}>
      <FormTextField
        name="disapprovalReason"
        label={t("reason")}
        isMultiline
        hasAutoFocus
      />
    </FormCardContainer>
  );
};
