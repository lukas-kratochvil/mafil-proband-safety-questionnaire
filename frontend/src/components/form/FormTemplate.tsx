import { Button, Grid, Stack } from "@mui/material";
import { IAuth } from "../../App";
import { Header } from "../header/Header";
import { Navigation } from "../operator/navigation/Navigation";
import { questions1, questions2 } from "./data";
import { FormBeforeExamination } from "./FormBeforeExamination";
import { FormEntryInfo } from "./FormEntryInfo";
import { FormExaminationConsent } from "./FormExaminationConsent";
import { FormHeader } from "./FormHeader"
import { FormProbandInfo } from "./FormProbandInfo";
import { FormQuestions } from "./FormQuestions";

interface IFormTemplateProps {
  auth?: IAuth;
}

export const FormTemplate = ({ auth }: IFormTemplateProps) => {
  let buttonTitles: string[];

  if (auth === undefined) {
    buttonTitles = ["Souhlasím"];
  } else {
    buttonTitles = auth.isEditing ? ["Potvrdit změny", "Zrušit"] : ["Vytisknout PDF", "Zrušit", "Editovat"];
  }

  return (
    <>
      <Header auth={auth} />
      {auth !== undefined && <Navigation />}
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
        {auth === undefined && <FormBeforeExamination />}
        {auth === undefined && <FormExaminationConsent />}
        <Grid
          container
          direction="row"
          justifyContent="center"
          gap={3}
        >
          {buttonTitles.map((buttonTitle, index) =>
            <Button variant="contained" key={index} >
              {buttonTitle}
            </Button>
          )}
        </Grid>
      </Stack>
    </>
  );
}
