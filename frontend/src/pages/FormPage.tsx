import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@mui/material";
import { isEqual } from "date-fns";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { rodnecislo } from "rodnecislo";
import { date, number, object, string } from "yup";
import { FormBeforeExamination } from "../components/form/FormBeforeExamination";
import { FormEntryInfo } from "../components/form/FormEntryInfo";
import { FormExaminationConsent } from "../components/form/FormExaminationConsent";
import { FormProbandContact } from "../components/form/FormProbandContact";
import { FormProbandInfo } from "../components/form/FormProbandInfo";
import { FormProjectInfo } from "../components/form/FormProjectInfo";
import { FormQuestions } from "../components/form/FormQuestions";
import { FormSafetyInfo } from "../components/form/FormSafetyInfo";
import { IQuestionData } from "../data/question_data";
import { IProbandVisit, VisitState } from "../data/visit_data";
import { useAuth } from "../hooks/auth/Auth";
import "../styles/style.css";
import { fetchCurrentQuestions, fetchVisit, updateDummyVisitState } from "../util/utils";
import { PageTemplate } from "./PageTemplate";

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

type FormPropType = IProbandFormDefaultValuesProps | IOperatorFormDefaultValuesProps;

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
  name: string().trim().required("Jméno musí být vyplněno."),
  surname: string().trim().required("Jméno musí být vyplněno."),
  personalId: string().trim().required("Rodné číslo musí být vyplněno."),
  birthdate: date()
    .nullable()
    .max(new Date(), "Maximální povolená hodnota pro datum narození je dnes.")
    .test({
      name: "birthdate-corresponds-to-personalId",
      message: "Datum narození není shodné s hodnotou získanou z poskytnutého českého nebo slovenského rodného čísla.",
      test: (birthdate, testContext) => {
        const czechPersonalId = rodnecislo(testContext.parent.personalId);
        return (
          birthdate === undefined
          || birthdate === null
          || !czechPersonalId.isValid()
          || isEqual(czechPersonalId.birthDate(), birthdate)
        );
      },
    })
    .required("Datum narození musí být vyplněno."),
  gender: string()
    .nullable()
    .test({
      name: "gender-corresponds-to-personalId",
      message: "Pohlaví není shodné s hodnotou získanou z poskytnutého českého nebo slovenského rodného čísla.",
      test: (gender, testContext) => {
        const czechPersonalId = rodnecislo(testContext.parent.personalId);
        return (
          !czechPersonalId.isValid()
          || (czechPersonalId.isMale() && ["Muž", "Jiné"].includes(gender ?? ""))
          || (czechPersonalId.isFemale() && ["Žena", "Jiné"].includes(gender ?? ""))
        );
      },
    })
    .required("Pohlaví musí být vyplněno."),
  nativeLanguage: string().nullable().required("Mateřský jazyk musí být vyplněn."),
  height: number()
    .typeError("Výška musí být kladné číslo.")
    .positive("Výška musí být kladné číslo.")
    .required("Výška musí být vyplněna."),
  weight: number()
    .typeError("Váha musí být kladné číslo.")
    .positive("Váha musí být kladné číslo.")
    .required("Váha musí být vyplněna."),
  sideDominance: string().nullable().required("Stranová dominance musí být vyplněná."),
  visualCorrection: string().nullable().required("Zraková korekce musí být vyplněna."),
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
  email: string().trim().email("Email není validní."),
  phoneNumber: string()
    .trim()
    .matches(/^$|^(\+|00)?[1-9]{1}[0-9,\s]{3,}$/, "Telefonní číslo není validní."),
});

const operatorFormSchema = probandFormSchema.shape({
  project: string().nullable().required("Projekt musí být vyplněn."),
  magnetDevice: string().nullable().required("Přístroj magnetické rezonance musí být vyplněný."),
  measurementDate: date().nullable().required("Datum měření musí být vyplněno."),
});

interface ISubmitButtonProps {
  title: string;
  onClick: (data: FormPropType) => void;
}

interface IButtonProps {
  title: string;
  onClick: () => void;
}

export const FormPage = () => {
  const navigate = useNavigate();
  const { username } = useAuth();
  const { id } = useParams();
  const [visit, setVisit] = useState<IProbandVisit | undefined>(undefined);
  const [questions1, setQuestions1] = useState<IQuestionData[]>([]);
  const [questions2, setQuestions2] = useState<IQuestionData[]>([]);
  const [isFantom, setIsFantom] = useState<boolean>(false);
  const [isAuthEditing, setIsAuthEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // TODO: use MUI Skeleton while data is fetching
  const [isError, setIsError] = useState<boolean>(false); // TODO: create ErrorPage

  const formMethods = useForm<FormPropType>({
    defaultValues: username === undefined ? loadProbandFormDefaultValues() : loadOperatorFormDefaultValues(visit),
    resolver: yupResolver(username === undefined ? probandFormSchema : operatorFormSchema),
    // TODO: add this if the validation on onChange event is too slow:
    // reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const visitResponse = id === undefined ? undefined : fetchVisit(id);
        const questions1Response = fetchCurrentQuestions(1);
        const questions2Response = fetchCurrentQuestions(2);

        const fetchedVisit = await visitResponse;
        setVisit(fetchedVisit);

        if (fetchedVisit !== undefined) {
          setIsFantom(fetchedVisit.projectInfo.isFantom);
          setIsAuthEditing(fetchedVisit.projectInfo.isFantom);
        }

        setQuestions1(await questions1Response);
        setQuestions2(await questions2Response);
        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (visit !== undefined) {
      const defaultValues = loadOperatorFormDefaultValues(visit);
      type DefaultValuesPropertyType = keyof typeof defaultValues;
      Object.keys(defaultValues).forEach((propertyName) => {
        formMethods.setValue(
          propertyName as DefaultValuesPropertyType,
          defaultValues[propertyName as DefaultValuesPropertyType]
        );
      });
    }
  }, [formMethods, visit]);

  let submitButton: ISubmitButtonProps;
  let buttons: IButtonProps[] = [];

  if (username === undefined) {
    submitButton = {
      title: "Souhlasím",
      onClick: (data: FormPropType) => {
        // TODO: create visit in DB
        navigate("/form-after-submission");
      },
    };
  } else if (isFantom) {
    // TODO: disable when personal info and comments to Yes/No questions are not filled in
    submitButton = {
      title: "Finalizovat",
      onClick: (data: FormPropType) => {
        // TODO: store changes in DB if made
        updateDummyVisitState(id, VisitState.FANTOM_DONE);
        navigate(`/auth/visit-detail/${id}`);
      },
    };
  } else if (isAuthEditing) {
    submitButton = {
      title: "Uložit změny",
      onClick: (data: FormPropType) => {
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
      onClick: (data: FormPropType) => {
        // TODO: store changes in DB if made
        updateDummyVisitState(id, VisitState.CHECKED);
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

  const onSubmit = (data: FormPropType) => {
    // TODO: submit data
    console.log("Submitted data:");
    console.log(data);
    submitButton.onClick(data);
  };

  // TODO: edit 'errors' data type
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
              // TODO: doesn't work, why??
              // disabled={!formMethods.formState.isValid}
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
