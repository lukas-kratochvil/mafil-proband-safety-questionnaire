import { Stack } from "@mui/material";
import { FormCardContainer } from "./FormCardContainer";
import { FormQac, FormQuestion } from "./FormQuestion";
import { IFormInputsProps } from "./types/types";

interface IFormQuestionsProps extends IFormInputsProps {
  title: string;
  qacs: FormQac[];
  disableComment?: boolean;
}

export const FormQuestions = ({ title, qacs, disableInputs, disableComment }: IFormQuestionsProps) => (
  <FormCardContainer title={title}>
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
