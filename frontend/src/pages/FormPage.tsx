import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FormBeforeExamination } from "../components/form/FormBeforeExamination";
import { FormEntryInfo } from "../components/form/FormEntryInfo";
import { FormExaminationConsent } from "../components/form/FormExaminationConsent";
import { FormProbandContact } from "../components/form/FormProbandContact";
import { FormProbandInfo } from "../components/form/FormProbandInfo";
import { FormProjectInfo } from "../components/form/FormProjectInfo";
import { IFormQac } from "../components/form/FormQuestion";
import { FormQuestions } from "../components/form/FormQuestions";
import { FormSafetyInfo } from "../components/form/FormSafetyInfo";
import { defaultFormSchema } from "../components/form/schemas/form-schema_default";
import { operatorFormSchema } from "../components/form/schemas/form-schema_operator";
import { FormPropType } from "../components/form/types/types";
import { IVisit, VisitState } from "../data/visit_data";
import { useAuth } from "../hooks/auth/Auth";
import { fetchCurrentQuestions, fetchVisit } from "../util/utils";
import { updateDummyVisitState } from "../util/utils.dev";
import { PageTemplate } from "./PageTemplate";

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
            spacing={matchesDownSmBreakpoint ? "1rem" : "1.5rem"}
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
              alignSelf="center"
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
