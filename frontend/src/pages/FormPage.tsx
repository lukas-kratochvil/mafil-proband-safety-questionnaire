import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "../hooks/auth/Auth";

interface IButtonProps {
  title: string;
  callback?: () => void;
}

export const FormPage = () => {
  const [isAuthEditing, setIsAuthEditing] = useState<boolean>(false);
  const { username } = useAuth();
  const navigate = useNavigate();

  let buttons: IButtonProps[];

  if (username === undefined) {
    buttons = [{ title: "Souhlasím", callback: () => navigate("/form-after-submission") }];
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
      { title: "Zrušit", callback: () => navigate("/auth/waiting-room") },
      { title: "Editovat", callback: () => setIsAuthEditing(true) },
    ];
  }

  return (
    <PageTemplate>
      {username === undefined && <FormEntryInfo />}
      {username !== undefined && <FormProjectInfo />}
      <FormProbandInfo isAuthEditing={username === undefined || isAuthEditing} />
      <FormProbandContact isAuthEditing={username === undefined || isAuthEditing} />
      {username === undefined && <FormSafetyInfo />}
      <FormQuestions
        title="Část 1"
        questions={questions1}
        isAuthEditing={username === undefined || isAuthEditing}
      />
      <FormQuestions
        title="Část 2"
        questions={questions2}
        isAuthEditing={username === undefined || isAuthEditing}
      />
      {username === undefined && <FormBeforeExamination />}
      {username === undefined && <FormExaminationConsent />}
      <Grid
        container
        direction="row"
        justifyContent="center"
        gap={3}
      >
        {buttons.map((button, index) => (
          <Button
            variant="contained"
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
