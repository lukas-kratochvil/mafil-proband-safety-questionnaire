import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { FormQac } from "@app/interfaces/form";
import { convertStringToLocalizationKey } from "@app/util/utils";
import { IFormCardProps } from "../interfaces/form-card";
import { FormCardContainer } from "./FormCardContainer";
import { FormQuestion } from "./FormQuestion";

interface IFormQuestionsProps extends IFormCardProps {
  titleLocalizationKey: string;
  qacs: FormQac[];
  disableComment?: boolean;
}

export const FormQuestions = ({ titleLocalizationKey, qacs, disableInputs, disableComment }: IFormQuestionsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.safetyQuestions" });

  return (
    <FormCardContainer title={t(convertStringToLocalizationKey(titleLocalizationKey))}>
      <Stack
        spacing="0.5rem"
        width="100%"
      >
        {qacs.map((qac) => (
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
