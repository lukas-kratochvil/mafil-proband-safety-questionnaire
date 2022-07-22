import { Button, Stack } from "@mui/material";
import { Header } from "../../header/Header";
import { FormBeforeExamination } from "./FormBeforeExamination";
import { FormEntryInfo } from "./FormEntryInfo";
import { FormExaminationConsent } from "./FormExaminationConsent";
import { FormHeader } from "./FormHeader"
import { FormProbandInfo } from "./FormProbandInfo";

export const FormTemplate = () => {
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
        <FormEntryInfo />
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
      </Stack>
    </>
  );
}
