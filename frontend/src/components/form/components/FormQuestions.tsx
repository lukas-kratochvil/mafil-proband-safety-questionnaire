import { Stack, useMediaQuery, type Theme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n/i18n";
import type { FormQac } from "@app/model/form";
import { FormCardContainer } from "./FormCardContainer";
import { FormQuestion } from "./FormQuestion";
import type { FormCardProps } from "./form-card";

type FormQuestionsProps = FormCardProps & {
  titleLocalizationKey: string;
  qacs: FormQac[];
  disableComment?: boolean;
};

export const FormQuestions = ({ titleLocalizationKey, qacs, disableInputs, disableComment }: FormQuestionsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.safetyQuestions" });
  const matchesUpSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  return (
    <FormCardContainer title={t(convertStringToLocalizationKey(titleLocalizationKey))}>
      <Stack
        spacing={matchesUpSmBreakpoint ? "0.5rem" : "1rem"}
        width="100%"
      >
        {qacs
          .sort((a, b) => a.order - b.order)
          .map((qac) => (
            <FormQuestion
              key={qac.questionId}
              qac={qac}
              disableInputs={disableInputs}
              disableComment={disableComment}
            />
          ))}
      </Stack>
    </FormCardContainer>
  );
};
