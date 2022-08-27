import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { date, number, object, string } from "yup";
import { FormBeforeExamination } from "../components/form/FormBeforeExamination";
import { FormEntryInfo } from "../components/form/FormEntryInfo";
import { FormExaminationConsent } from "../components/form/FormExaminationConsent";
import { FormProbandContact } from "../components/form/FormProbandContact";
import { FormProbandInfo } from "../components/form/FormProbandInfo";
import { FormProjectInfo } from "../components/form/FormProjectInfo";
import { FormQuestions } from "../components/form/FormQuestions";
import { FormSafetyInfo } from "../components/form/FormSafetyInfo";
import { genders, magnetDevices, nativeLanguages, projects, sideDominance, visualCorrection } from "../data/form_data";
import { IProbandVisit } from "../data/visit_data";
import { useAuth } from "../hooks/auth/Auth";
import "../styles/style.css";
import { fetchCurrentQuestionsPart1, fetchCurrentQuestionsPart2, fetchVisit } from "../util/utils";
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

type TextFieldNumberInput = string | number;

interface IProbandFormDefaultValuesProps {
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  gender: string | null;
  nativeLanguage: string | null;
  height: TextFieldNumberInput;
  weight: TextFieldNumberInput;
  sideDominance: string | null;
  visualCorrection: string | null;
  visualCorrectionValue: TextFieldNumberInput;
  email: string;
  phoneNumber: string;
}

interface IOperatorFormDefaultValuesProps extends IProbandFormDefaultValuesProps {
  project: string | null;
  magnetDevice: string | null;
  measurementDate: Date | null;
}

// Autocomplete component default value must be one of the options or null
const loadProbandFormDefaultValues = (): IProbandFormDefaultValuesProps => ({
  name: "",
  surname: "",
  personalId: "",
  birthdate: null,
  gender: null,
  nativeLanguage: null,
  height: "",
  weight: "",
  sideDominance: null,
  visualCorrection: null,
  visualCorrectionValue: 0,
  email: "",
  phoneNumber: "",
});

// Autocomplete component default value must be one of the options or null
const loadOperatorFormDefaultValues = (visit: IProbandVisit | undefined): IOperatorFormDefaultValuesProps => {
  if (visit === undefined) {
    return {
      project: null,
      magnetDevice: null,
      measurementDate: new Date(),
      ...loadProbandFormDefaultValues(),
    };
  }

  return {
    project: visit.projectInfo.projectName ?? null,
    magnetDevice: visit.projectInfo.magnetDeviceName ?? null,
    measurementDate: visit.projectInfo.measurementDate ?? new Date(),
    name: visit.probandInfo.name,
    surname: visit.probandInfo.surname,
    personalId: visit.probandInfo.personalId,
    birthdate: visit.probandInfo.birthdate,
    gender: visit.probandInfo.gender,
    nativeLanguage: visit.probandInfo.nativeLanguage,
    height: visit.probandInfo.height,
    weight: visit.probandInfo.weight,
    sideDominance: visit.probandInfo.sideDominance,
    visualCorrection: visit.probandInfo.visualCorrection,
    visualCorrectionValue: visit.probandInfo.visualCorrectionValue,
    email: visit.probandInfo.email,
    phoneNumber: visit.probandInfo.phoneNumber,
  };
};

const probandFormSchema = object({
  name: string()
    .trim()
    .required("Jméno musí být vyplněno."),
  surname: string()
    .trim()
    .required("Jméno musí být vyplněno."),
  personalId: string()
    .trim()
    .required("Rodné číslo musí být vyplněno."),
  birthdate: date()
    .nullable()
    .max(new Date(), "Maximální povolená hodnota pro datum narození je dnes.")
    .required("Datum narození musí být vyplněno."),
  gender: string()
    .nullable()
    .oneOf(genders, `Hodnota musí být jedno z: ${genders.map((val) => `'${val}'`).join(", ")}.`) // TODO: is it necessary? - Autocomplete will let us submit only values from provided options
    .required("Pohlaví musí být vyplněno."), // TODO: change values in oneOf()
  nativeLanguage: string()
    .nullable()
    .oneOf(nativeLanguages, `Hodnota musí být jedno z: ${nativeLanguages.map((val) => `'${val}'`).join(", ")}.`) // TODO: is it necessary? - Autocomplete will let us submit only values from provided options
    .required("Mateřský jazyk musí být vyplněn."), // TODO: change values in oneOf()
  height: number()
    .typeError("Výška musí být kladné číslo.")
    .positive("Výška musí být kladné číslo.")
    .required("Výška musí být vyplněna."),
  weight: number()
    .typeError("Váha musí být kladné číslo.")
    .positive("Váha musí být kladné číslo.")
    .required("Váha musí být vyplněna."),
  sideDominance: string()
    .nullable()
    .oneOf(sideDominance, `Hodnota musí být jedno z: ${sideDominance.join(", ")}.`) // TODO: is it necessary? - Autocomplete will let us submit only values from provided options
    .required("Stranová dominance musí být vyplněná."), // TODO: change values in oneOf()
  visualCorrection: string()
    .nullable()
    .oneOf(visualCorrection, `Hodnota musí být jedno z: ${visualCorrection.join(", ")}.`) // TODO: is it necessary? - Autocomplete will let us submit only values from provided options
    .required("Zraková korekce musí být vyplněna."), // TODO: change values in oneOf()
  visualCorrectionValue: number()
    .default(0)
    .when("visualCorrection", {
      is: "Ano", // TODO: make enum
      then: number()
        .notOneOf([0], "Hodnota zrakové korekce se nesmí rovnat nule.")
        .min(-200, "Hodnota zrakové korekce není validní - je příliš nízká.")
        .max(200, "Hodnota zrakové korekce není validní - je příliš vysoká.")
        .required("Hodnota zrakové korekce musí být vyplněna."),
    }),
  email: string()
    .trim()
    .email("Email není validní."),
  phoneNumber: string()
    .trim()
    .matches(/^$|^(\+|00)?[1-9]{1}[0-9,\s]{3,}$/, "Telefonní číslo není validní."),
});

const operatorFormSchema = probandFormSchema.shape({
  project: string()
    .nullable()
    .oneOf(projects, `Hodnota musí být jedno z: ${projects.map((val) => `'${val}'`).join(", ")}.`) // TODO: is it necessary? - Autocomplete will let us submit only values from provided options
    .required("Projekt musí být vyplněn."), // TODO: change values in oneOf()
  magnetDevice: string()
    .nullable()
    .oneOf(magnetDevices, `Hodnota musí být jedno z: ${magnetDevices.map((val) => `'${val}'`).join(", ")}.`) // TODO: is it necessary? - Autocomplete will let us submit only values from provided options
    .required("Přístroj magnetické rezonance musí být vyplněný."), // TODO: change values in oneOf()
  measurementDate: date()
    .nullable()
    .required("Datum měření musí být vyplněno."),
});

export const FormPage = () => {
  const { id } = useParams();

  const visit = id === undefined ? undefined : fetchVisit(id);
  const questions1 = fetchCurrentQuestionsPart1();
  const questions2 = fetchCurrentQuestionsPart2();

  const isFantom = visit?.projectInfo.isFantom || false;
  const { username } = useAuth();
  const formMethods = useForm({
    defaultValues: username === undefined ? loadProbandFormDefaultValues() : loadOperatorFormDefaultValues(visit),
    resolver: yupResolver(username === undefined ? probandFormSchema : operatorFormSchema),
  });
  const navigate = useNavigate();
  const [isAuthEditing, setIsAuthEditing] = useState<boolean>(false);

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
    console.log("Submitted data:");
    console.log(data);
    submitButton.onClick(data);
  };

  // TODO: edit 'data' data type
  const onError = (errors: unknown) => {
    console.log("Error:");
    console.log(errors);
  };

  return (
    <PageTemplate>
      <FormProvider {...formMethods}>
        <form
          className="visit-form"
          onSubmit={formMethods.handleSubmit(onSubmit, onError)}
        >
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
        </form>
      </FormProvider>
    </PageTemplate>
  );
};
