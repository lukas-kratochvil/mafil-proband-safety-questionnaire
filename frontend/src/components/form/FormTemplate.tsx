import { Button, Grid, Stack } from "@mui/material";
import { useState } from "react";
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
  link?: string;
  callback?: () => void;
}

export const FormTemplate = ({ auth }: IFormTemplateProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  let buttons: IButtonProps[];

  if (auth === undefined) {
    buttons = [
      // TODO: edit callback
      { title: "Souhlasím", callback: () => console.log("TODO") },
    ];
  } else {
    if (isEditing) {
      buttons = [
        // TODO: edit callback
        { title: "Uložit změny", callback: () => setIsEditing(false) },
        // TODO: edit callback
        { title: "Zrušit", callback: () => setIsEditing(false) },
      ];
    } else {
      buttons = [
        // TODO: disable when comments to Yes questions are not filled in
        { title: "Vytisknout PDF", callback: () => console.log("TODO") },
        { title: "Zrušit", link: "/auth/waiting-room" },
        { title: "Editovat", callback: () => setIsEditing(true) },
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
              onClick={button.callback}
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
