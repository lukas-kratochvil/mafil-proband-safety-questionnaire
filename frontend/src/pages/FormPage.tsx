import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
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
import "../styles/style.css";

interface IButtonProps {
  title: string;
  callback: () => void;
}

export const FormPage = () => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  const [isAuthEditing, setIsAuthEditing] = useState<boolean>(false);
  const { username } = useAuth();
  const navigate = useNavigate();

  let submitButton: IButtonProps;
  let buttons: IButtonProps[] = [];

  if (username === undefined) {
    submitButton = { title: "Souhlasím", callback: () => navigate("/form-after-submission") };
  } else if (isAuthEditing) {
    // TODO: edit callback
    submitButton = { title: "Uložit změny", callback: () => setIsAuthEditing(false) };
    buttons = [
      // TODO: edit callback
      { title: "Zrušit", callback: () => setIsAuthEditing(false) },
    ];
  } else {
    /*
      TODO:
        - disable when comments to Yes/No questions are not filled in
        - actual path should be "/auth/visit-pdf/{id}"
    */
    submitButton = { title: "Finalizovat", callback: () => navigate("/auth/visit-pdf") };
    buttons = [
      { title: "Zrušit", callback: () => navigate("/auth/waiting-room") },
      { title: "Editovat", callback: () => setIsAuthEditing(true) },
    ];
  }

  const onSubmit = (data: unknown) => {
    console.log(data);
    submitButton.callback();
  };

  const onError = (errors: unknown) => {
    console.log(errors);
  };

  return (
    <PageTemplate>
      <form
        className="visit-form"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <FormProvider {...formMethods}>
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
            gap="1.5rem"
          >
            <Button
              type="submit"
              variant="contained"
              color="success"
            >
              {submitButton.title}
            </Button>
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
        </FormProvider>
      </form>
    </PageTemplate>
  );
};
