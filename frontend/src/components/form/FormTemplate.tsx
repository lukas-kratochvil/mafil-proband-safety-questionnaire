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

interface IButtonProps {
  title: string;
  link: string;
}

export const FormTemplate = ({ auth }: IFormTemplateProps) => {
  let buttons: IButtonProps[];

  if (auth === undefined) {
    buttons = [
      { title: "Souhlasím", link: "TODO" },
    ];
  } else {
    if (auth.isEditing) {
      buttons = [
        { title: "Uložit změny", link: "/auth/form-recap" },
        { title: "Zrušit", link: "/auth/form-recap" },
      ];
    } else {
      buttons = [
        { title: "Vytisknout PDF", link: "TODO" },
        { title: "Zrušit", link: "/auth/waiting-room" },
        { title: "Editovat", link: "/auth/form-edit" },
      ];
    }
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
          {buttons.map((button, index) =>
            <Button
              variant="contained"
              href={button.link}
              key={index}
            >
              {button.title}
            </Button>
          )}
        </Grid>
      </Stack>
    </>
  );
}
