import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { fetchVisit } from "../util/utils";

interface ISubmitButtonProps {
  title: string;
  // TODO: edit 'data' data type
  onClick: (data: unknown) => void;
}

interface IButtonProps {
  title: string;
  onClick: () => void;
}

export const FormPage = () => {
  const { id } = useParams();
  const visit = id === undefined ? undefined : fetchVisit(id);
  const isFantom = visit?.projectInfo.isFantom || false;

  // TODO: set defaultValues for the form - fill data from an existing visit
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  const [isAuthEditing, setIsAuthEditing] = useState<boolean>(false);
  const { username } = useAuth();
  const navigate = useNavigate();

  useEffect(() => setIsAuthEditing(isFantom), [id, isFantom]);

  let submitButton: ISubmitButtonProps;
  let buttons: IButtonProps[] = [];

  if (username === undefined) {
    submitButton = {
      title: "Souhlasím",
      onClick: (data) => {
        // TODO: create visit in DB
        navigate("/form-after-submission");
      },
    };
  } else if (isFantom) {
    // TODO: disable when personal info and comments to Yes/No questions are not filled in
    submitButton = {
      title: "Finalizovat",
      onClick: (data) => {
        // TODO: store changes in DB if made
        navigate(`/auth/visit-detail/${id}`);
      },
    };
  } else if (isAuthEditing) {
    submitButton = {
      title: "Uložit změny",
      onClick: (data) => {
        // TODO: save the changes in DB
        setIsAuthEditing(false);
      },
    };
    buttons = [
      {
        title: "Zrušit",
        onClick: () => {
          // TODO: discard changes and show the original data
          setIsAuthEditing(false);
        },
      },
    ];
  } else {
    // TODO: disable when personal info and comments to Yes/No questions are not filled in
    submitButton = {
      title: "Finalizovat",
      onClick: (data) => {
        // TODO: store changes in DB if made
        navigate(`/auth/visit-detail/${id}`);
      },
    };
    buttons = [
      {
        title: "Zrušit",
        onClick: () => {
          navigate("/auth/waiting-room");
        },
      },
      {
        title: "Editovat",
        onClick: () => {
          setIsAuthEditing(true);
        },
      },
    ];
  }

  // TODO: edit 'data' data type
  const onSubmit = (data: unknown) => {
    // TODO: submit data
    console.log(data);
    submitButton.onClick(data);
  };

  // TODO: edit 'data' data type
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
          {username !== undefined && <FormProjectInfo isFantom={isFantom} />}
          <FormProbandInfo isAuthEditing={username === undefined || isAuthEditing} />
          {!isFantom && <FormProbandContact isAuthEditing={username === undefined || isAuthEditing} />}
          {username === undefined && <FormSafetyInfo />}
          {!isFantom && (
            <>
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
            </>
          )}
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
                onClick={button.onClick}
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
