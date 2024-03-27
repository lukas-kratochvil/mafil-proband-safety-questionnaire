import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n/i18n";
import type { FormQac } from "@app/model/form";
import { FormCardContainer } from "./FormCardContainer";
import { FormQuestion } from "./FormQuestion";
import type { IFormCardProps } from "./form-card";

type IFormQuestionsProps = IFormCardProps & {
  titleLocalizationKey: string;
  qacs: FormQac[];
  disableComment?: boolean;
};

export const FormQuestions = ({ titleLocalizationKey, qacs, disableInputs, disableComment }: IFormQuestionsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.safetyQuestions" });

  return (
    <FormCardContainer title={t(convertStringToLocalizationKey(titleLocalizationKey))}>
      <Stack
        spacing="0.5rem"
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
