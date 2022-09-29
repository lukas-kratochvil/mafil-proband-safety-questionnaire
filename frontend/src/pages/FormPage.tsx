import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import { isEqual } from "date-fns";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { rodnecislo } from "rodnecislo";
import { array, date, number, object, string } from "yup";
import { FormBeforeExamination } from "../components/form/FormBeforeExamination";
import { FormEntryInfo } from "../components/form/FormEntryInfo";
import { FormExaminationConsent } from "../components/form/FormExaminationConsent";
import { FormProbandContact } from "../components/form/FormProbandContact";
import { FormProbandInfo } from "../components/form/FormProbandInfo";
import { FormProjectInfo } from "../components/form/FormProjectInfo";
import { FormQuestions, IFormQac } from "../components/form/FormQuestions";
import { FormSafetyInfo } from "../components/form/FormSafetyInfo";
import { IQac, IVisit, VisitState } from "../data/visit_data";
import { useAuth } from "../hooks/auth/Auth";
import "../styles/style.css";
import { fetchCurrentQuestions, fetchVisit } from "../util/utils";
import { updateDummyVisitState } from "../util/utils.dev";
import { PageTemplate } from "./PageTemplate";

type TextFieldNumberInput = string | number;

interface FormPropType {
  project: string | null;
  device: string | null;
  measurementDate: Date | null;
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
  answers: IQac[];
}

// Autocomplete component default value must be one of the options provided or null
const loadFormDefaultValues = (): FormPropType => ({
  project: null,
  device: null,
  measurementDate: null,
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
  answers: [],
});

// Autocomplete component default value must be one of the options provided or null
const loadFormDefaultValuesFromVisit = (visit: IVisit): FormPropType => ({
  project: visit.projectInfo.project ?? null,
  device: visit.projectInfo.device ?? null,
  measurementDate: visit.projectInfo.measurementDate ?? new Date(),
  ...visit.probandInfo,
  answers: visit.answers.map((answer) => ({ ...answer })),
});

const answersSchema = object({
  questionId: string().trim().required(),
  partNumber: number().oneOf([1, 2]).required(),
  answer: string().nullable().required("Odpoveď na bezpečnostní otázku je povinná."),
  comment: string().nullable(),
});

const defaultFormSchema = object({
  project: string().nullable(),
  device: string().nullable(),
  measurementDate: date().typeError("Datum není validní.").nullable(),
  name: string().trim().required("Jméno musí být vyplněno."),
  surname: string().trim().required("Jméno musí být vyplněno."),
  personalId: string().trim().required("Rodné číslo musí být vyplněno."),
  birthdate: date()
    .nullable()
    .typeError("Datum není validní.")
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
    .typeError("Hodnota zrakové korekce není validní.")
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
  answers: array().of(answersSchema).required(),
});

const operatorAnswersSchema = answersSchema.shape({
  comment: string()
    .default("")
    .when("answer", {
      is: "yes",
      then: string().trim().required("Komentář musí být vyplněn."),
    }),
});

const operatorFormSchema = defaultFormSchema.shape({
  project: string().nullable().required("Projekt musí být vyplněn."),
  device: string().nullable().required("Přístroj magnetické rezonance musí být vyplněný."),
  measurementDate: date().nullable().required("Datum měření musí být vyplněno."),
  answers: array().of(operatorAnswersSchema).required("Všechny bezpečnostní otázky musí být zodpovězeny."),
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
  const theme = useTheme();
  const matchesDownSmBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { username } = useAuth();
  const { id } = useParams();
  const [visit, setVisit] = useState<IVisit | undefined>();
  const [qacs, setQacs] = useState<IFormQac[]>([]);
  const [isFantom, setIsFantom] = useState<boolean>(false);
  const [isAuthEditing, setIsAuthEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // TODO: use MUI Skeleton while data is fetching
  const [isError, setIsError] = useState<boolean>(false); // TODO: create ErrorPage

  const schema = username === undefined ? defaultFormSchema : operatorFormSchema;
  const formMethods = useForm<FormPropType>({
    defaultValues: loadFormDefaultValues(),
    resolver: yupResolver(schema),
    // TODO: add this if the validation on onChange event is too slow:
    // reValidateMode: "onSubmit",
  });
  const { formState, handleSubmit, reset, setValue } = formMethods;
  const { isDirty, isValid } = formState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedVisit = id === undefined ? undefined : await fetchVisit(id);

        if (fetchedVisit === undefined) {
          console.log("FETCHING DEFAULT QUESTIONS");
          const questions = await fetchCurrentQuestions();
          setQacs(
            questions.map((qac, index) => ({
              index,
              questionId: qac.id,
              partNumber: qac.partNumber,
              answer: undefined,
              comment: "",
            }))
          );
        } else {
          setIsFantom(fetchedVisit.projectInfo.isFantom);
          setIsAuthEditing(fetchedVisit.projectInfo.isFantom);
          console.log("FETCHING QUESTIONS FROM THE VISIT");
          setQacs(fetchedVisit.answers.map((answer, index) => ({ index, ...answer })));
          setVisit(fetchedVisit);
        }

        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (visit === undefined) {
      setValue("answers", qacs);
    } else {
      console.log("SETTING DEFAULT VALUES");
      const defaultValues = loadFormDefaultValuesFromVisit(visit);
      type DefaultValuesPropertyType = keyof typeof defaultValues;
      Object.keys(defaultValues).forEach((propertyName) => {
        setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
        console.log(
          "-->",
          propertyName as DefaultValuesPropertyType,
          ":",
          defaultValues[propertyName as DefaultValuesPropertyType]
        );
      });
    }
  }, [qacs, setValue, visit]);

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
    submitButton = {
      title: "Finalizovat",
      onClick: (data: FormPropType) => {
        // TODO: store changes in DB if made
        updateDummyVisitState(id, VisitState.FANTOM_DONE);
        navigate(`/auth/visit-detail/${id}`);
      },
    };
    buttons = [
      {
        title: "Zrušit",
        // Navigate back to the previous page
        onClick: () => navigate(-1),
      },
    ];
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
          reset();
          setIsAuthEditing(false);
        },
      },
    ];
  } else {
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
        title: "Editovat",
        onClick: () => {
          setIsAuthEditing(true);
        },
      },
      {
        title: "Zrušit",
        onClick: () => navigate("/auth/waiting-room"),
      },
    ];
  }

  const onSubmit = (data: FormPropType) => {
    // TODO: submit data
    console.log("Submitted data:");
    console.log(data);
    submitButton.onClick(data);
  };

  // TODO: DELETE - only for development purposes
  const onError = (errors: unknown) => {
    console.log("Error:");
    console.log(errors);
  };

  return (
    <PageTemplate>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Stack
            spacing="1.5rem"
            alignItems="stretch"
          >
            {username === undefined && <FormEntryInfo />}
            {username !== undefined && <FormProjectInfo isFantom={isFantom} />}
            <FormProbandInfo isAuthEditing={username === undefined || isAuthEditing} />
            {!isFantom && <FormProbandContact isAuthEditing={username === undefined || isAuthEditing} />}
            {username === undefined && <FormSafetyInfo />}
            {username !== undefined && !isFantom && (
              <>
                <FormQuestions
                  title="Část 1"
                  qacs={qacs.filter((qac) => qac.partNumber === 1)}
                  isAuthEditing={isAuthEditing}
                />
                <FormQuestions
                  title="Část 2"
                  qacs={qacs.filter((qac) => qac.partNumber === 2)}
                  isAuthEditing={isAuthEditing}
                />
              </>
            )}
            {username === undefined && (
              <FormQuestions
                title="Bezpečnostní otázky"
                qacs={qacs}
                isAuthEditing
              />
            )}
            {username === undefined && <FormBeforeExamination />}
            {username === undefined && <FormExaminationConsent />}
            <Grid
              container
              direction={matchesDownSmBreakpoint ? "column" : "row"}
              justifyContent="center"
              gap={matchesDownSmBreakpoint ? "0.5rem" : "1.5rem"}
              sx={{ width: matchesDownSmBreakpoint ? "12rem" : "100%" }}
            >
              <Button
                type="submit"
                variant="contained"
                color="success"
                // TODO: doesn't work, why?? Should disable submit button when form isn't correctly filled
                // disabled={!isDirty || !isValid}
              >
                {submitButton.title}
              </Button>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant="contained"
                  onClick={button.onClick}
                >
                  {button.title}
                </Button>
              ))}
            </Grid>
          </Stack>
        </form>
      </FormProvider>
    </PageTemplate>
  );
};
