import { Button, Stack } from "@mui/material";
import { Header } from "../../header/Header";
import { questions1, questions2 } from "./data";
import { FormBeforeExamination } from "./FormBeforeExamination";
import { FormEntryInfo } from "./FormEntryInfo";
import { FormExaminationConsent } from "./FormExaminationConsent";
import { FormHeader } from "./FormHeader"
import { FormProbandInfo } from "./FormProbandInfo";
import { FormQuestions } from "./FormQuestions";

interface IFormTemplateProps {
  auth?: {
    isEditing: boolean;
  };
}

export const FormTemplate = ({ auth }: IFormTemplateProps) => {
  return (
    <>
      <Header />
      <Stack
        spacing={3}
        sx={{
          marginY: 3,
          marginX: '20%',
        }}
      >
        <FormHeader />
        <FormProbandInfo />
        {auth === undefined && <FormEntryInfo />}
        <FormQuestions
          title="Část 1"
          questions={questions1}
        />
        <FormQuestions
          title="Část 2"
          questions={questions2}
        />
        {auth === undefined && (
          <>
            <FormBeforeExamination />
            <FormExaminationConsent />
            <Stack
              sx={{
                paddingX: '40%',
              }}
            >
              <Button variant="contained">
                Souhlasím
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
}
