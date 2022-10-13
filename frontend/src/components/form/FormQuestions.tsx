import { Stack } from "@mui/material";
import { FormCard } from "./FormCard";
import { FormQuestion, IFormQac } from "./FormQuestion";
import { IFormInputsProps } from "./types/types";

interface IFormQuestionsProps extends IFormInputsProps {
  title: string;
  qacs: IFormQac[];
  disableComment?: boolean;
}

export const FormQuestions = ({ title, qacs, disableInputs, disableComment }: IFormQuestionsProps) => (
  <FormCard title={title}>
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
  </FormCard>
);
