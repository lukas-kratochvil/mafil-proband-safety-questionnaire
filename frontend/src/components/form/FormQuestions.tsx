import { Stack } from "@mui/material";
import { FormCard } from "./FormCard";
import { FormQuestion, IFormQac } from "./FormQuestion";

interface IFormQuestionsProps {
  title: string;
  qacs: IFormQac[];
  disableInputs: boolean;
}

export const FormQuestions = ({ title, qacs, disableInputs }: IFormQuestionsProps) => (
  <FormCard title={title}>
    <Stack
      spacing="0.5rem"
      width="100%"
    >
      {qacs.map((qac) => (
        <FormQuestion
          key={qac.questionId}
          qac={qac}
          disabled={disableInputs}
        />
      ))}
    </Stack>
  </FormCard>
);
