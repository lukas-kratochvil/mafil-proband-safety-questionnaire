import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FormBeforeExamination } from "../components/form/FormBeforeExamination";
import { FormEntryInfo } from "../components/form/FormEntryInfo";
import { FormExaminationConsent } from "../components/form/FormExaminationConsent";
import { FormProbandContact } from "../components/form/FormProbandContact";
import { FormProbandInfo } from "../components/form/FormProbandInfo";
import { FormProjectInfo } from "../components/form/FormProjectInfo";
import { FormQuestions } from "../components/form/FormQuestions";
import { FormSafetyInfo } from "../components/form/FormSafetyInfo";
import { questions1, questions2 } from "../data/form_data";
import { IProbandVisit } from "../data/visit_data";
import { useAuth } from "../hooks/auth/Auth";
import "../styles/style.css";
import { fetchVisit } from "../util/utils";
import { PageTemplate } from "./PageTemplate";

interface ISubmitButtonProps {
  title: string;
  // TODO: edit 'data' data type
  onClick: (data: unknown) => void;
}

interface IButtonProps {
  title: string;
  onClick: () => void;
}

interface IFormDefaultValuesProps {
  project: string | null;
  magnetDevice: string | null;
  measurementDate: Date | null;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  sex: string | null;
  nativeLanguage: string | null;
  height: string; // TODO: should be number
  weight: string; // TODO: should be number
  sideDominance: string | null;
  visualCorrection: string | null;
  visualCorrectionValue: string; // TODO: should be number
  email: string;
  phoneNumber: string;
}

// Autocomplete component default value must be one of the options or null
const loadDefaultValues = (visit: IProbandVisit | undefined): IFormDefaultValuesProps => ({
  project: visit?.projectInfo.projectName ?? null,
  magnetDevice: visit?.projectInfo.magnetDeviceName ?? null,
  measurementDate: visit?.projectInfo.measurementDate ?? new Date(),
  name: visit?.probandInfo.name ?? "",
  surname: visit?.probandInfo.surname ?? "",
  personalId: visit?.probandInfo.personalId ?? "",
  birthdate: visit?.probandInfo.birthdate ?? null,
  sex: visit?.probandInfo.sex ?? null,
  nativeLanguage: visit?.probandInfo.nativeLanguage ?? null,
  height: visit?.probandInfo.height.toString() ?? "", // TODO
  weight: visit?.probandInfo.weight.toString() ?? "", // TODO
  sideDominance: visit?.probandInfo.sideDominance ?? null,
  visualCorrection: visit?.probandInfo.visualCorrection ?? null,
  visualCorrectionValue: visit?.probandInfo.visualCorrectionValue.toString() ?? "", // TODO
  email: visit?.probandInfo.email ?? "",
  phoneNumber: visit?.probandInfo.phoneNumber ?? "",
});

export const FormPage = () => {
  const { id } = useParams();
  const visit = id === undefined ? undefined : fetchVisit(id);
  const isFantom = visit?.projectInfo.isFantom || false;

  const formMethods = useForm({ defaultValues: loadDefaultValues(visit) });
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
