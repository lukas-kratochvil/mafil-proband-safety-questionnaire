import { Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { FormCardContainer } from "./FormCardContainer";

export const FormBeforeExamination = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.beforeExamination" });

  return (
    <FormCardContainer title={t("title")}>
      <Typography width="100%">
        <Trans
          t={t}
          i18nKey="text"
        >
          Before the examination, please&nbsp;
          <strong>put away all electrically conductive/metallic objects</strong>
          &nbsp;(jewellery, watches, rubber bands, clips, piercings) and clothing components that contain&nbsp;
          <strong>electrically conductive materials</strong>, e.g. underwired bras, metal patches, functional underwear
          with silver content. The investigation is conducted for the purpose of scientific research. The purpose of the
          examination is not to provide health services or to determine your health status. The collected data will not
          be evaluated by a doctor, but by a scientist. In the event that a researcher suspects possible health
          complications, you have the right to be informed about this suspicion and subsequently to consult a doctor
          about the suspicion, which would be ensured by the researcher of the relevant study based on your informed
          consent decision.
        </Trans>
      </Typography>
    </FormCardContainer>
  );
};
