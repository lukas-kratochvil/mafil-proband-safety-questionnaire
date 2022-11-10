import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "../../i18n";
import { convertStringToLocalizationKey } from "../../util/utils";
import { FormCardContainer } from "./FormCardContainer";
import { FormQac, FormQuestion } from "./FormQuestion";
import { IFormCardProps } from "./interfaces/form-card";

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
)};
