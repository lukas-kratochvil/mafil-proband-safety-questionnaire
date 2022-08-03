import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { IAuth } from "../App";
import { questions1, questions2 } from "../data/form_data";
import { FormBeforeExamination } from "../components/form/FormBeforeExamination";
import { FormEntryInfo } from "../components/form/FormEntryInfo";
import { FormExaminationConsent } from "../components/form/FormExaminationConsent";
import { FormProjectInfo } from "../components/form/FormProjectInfo";
import { FormProbandInfo } from "../components/form/FormProbandInfo";
import { FormQuestions } from "../components/form/FormQuestions";
import { FormProbandContact } from "../components/form/FormProbandContact";
import { FormSafetyInfo } from "../components/form/FormSafetyInfo";
import { PageTemplate } from "./PageTemplate";

interface IFormPageProps {
  auth?: IAuth;
}

interface IButtonProps {
  title: string;
  link?: string;
  callback?: () => void;
}

export const FormPage = ({ auth }: IFormPageProps) => {
  const [isAuthEditing, setIsAuthEditing] = useState<boolean>(false);

  let buttons: IButtonProps[];

  if (auth === undefined) {
    buttons = [{ title: "Souhlasím", link: "/form-after-submission" }];
  } else if (isAuthEditing) {
    buttons = [
      // TODO: edit callback
      { title: "Uložit změny", callback: () => setIsAuthEditing(false) },
      // TODO: edit callback
      { title: "Zrušit", callback: () => setIsAuthEditing(false) },
    ];
  } else {
    buttons = [
      // TODO: disable when comments to Yes/No questions are not filled in
      { title: "Finalizovat", callback: () => console.log("TODO") },
      { title: "Zrušit", link: "/auth/waiting-room" },
      { title: "Editovat", callback: () => setIsAuthEditing(true) },
    ];
  }

  return (
    <PageTemplate auth={auth}>
      {auth === undefined && <FormEntryInfo />}
      {auth !== undefined && <FormProjectInfo />}
      <FormProbandInfo
        auth={auth}
        isAuthEditing={auth === undefined || isAuthEditing}
      />
      <FormProbandContact isAuthEditing={auth === undefined || isAuthEditing} />
      {auth === undefined && <FormSafetyInfo />}
      <FormQuestions
        title="Část 1"
        questions={questions1}
        auth={auth}
        isAuthEditing={auth === undefined || isAuthEditing}
      />
      <FormQuestions
        title="Část 2"
        questions={questions2}
        auth={auth}
        isAuthEditing={auth === undefined || isAuthEditing}
      />
      {auth === undefined && <FormBeforeExamination />}
      {auth === undefined && <FormExaminationConsent />}
      <Grid
        container
        direction="row"
        justifyContent="center"
        gap={3}
      >
        {buttons.map((button, index) => (
          <Button
            variant="contained"
            href={button.link}
            onClick={button.callback}
            key={index}
          >
            {button.title}
          </Button>
        ))}
      </Grid>
    </PageTemplate>
  );
};
