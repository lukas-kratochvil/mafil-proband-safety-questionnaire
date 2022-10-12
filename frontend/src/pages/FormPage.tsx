import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FormButtons, IFormButtonsProps } from "../components/form/FormButtons";
import { FormProbandContact } from "../components/form/FormProbandContact";
import { FormProbandInfo } from "../components/form/FormProbandInfo";
import { FormProjectInfo } from "../components/form/FormProjectInfo";
import { IFormQac } from "../components/form/FormQuestion";
import { FormQuestions } from "../components/form/FormQuestions";
import { operatorFormSchema } from "../components/form/schemas/form-schema_operator";
import { FormPropType, UserFormContext } from "../components/form/types/types";
import { IVisit, VisitState } from "../data/visit_data";
import { useAuth } from "../hooks/auth/Auth";
import { fetchVisit } from "../util/fetch";
import { updateDummyVisitState } from "../util/fetch.dev";
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

interface IFormPageProps {
  initialUserFormContext: UserFormContext;
}

export const FormPage = ({ initialUserFormContext }: IFormPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { operator } = useAuth();

  const theme = useTheme();
  const matchesDownSmBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));

  const [visit, setVisit] = useState<IVisit | undefined>();
  const [qacs, setQacs] = useState<IFormQac[]>([]);
  const [userFormContext, setUserFormContext] = useState<UserFormContext>(initialUserFormContext);

  const [buttonsAreLoading, setButtonsAreLoading] = useState<boolean>(true);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps>({} as IFormButtonsProps);

  const [isLoading, setIsLoading] = useState<boolean>(true); // TODO: use MUI Skeleton while data is fetching
  const [isError, setIsError] = useState<boolean>(false); // TODO: create ErrorPage

  const formMethods = useForm<FormPropType>({
    mode: "onChange",
    defaultValues: loadFormDefaultValues(),
    resolver: yupResolver(operatorFormSchema),
    // TODO: add this if the validation on onChange event is too slow:
    // reValidateMode: "onSubmit",
  });
  const { handleSubmit, reset, setValue } = formMethods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedVisit = id === undefined ? undefined : await fetchVisit(id);

        if (fetchedVisit === undefined) {
          console.log("VISIT NOT FOUND!");
          setIsError(true);
          return;
        }

        if (operator === undefined) {
          // TODO
          console.log("UNAUTHORIZED ACCESS!");
          setIsError(true);
          return;
        }

        if (initialUserFormContext === UserFormContext.OPERATOR_APPROVE_DISABLED && operator.hasHigherPermission) {
          // form from 'ApprovalTablePage' must be initially called with 'OPERATOR_APPROVE_DISABLED'
          setUserFormContext(UserFormContext.OPERATOR_APPROVE);
        }

        console.log("FETCHING QUESTIONS FROM THE VISIT");
        setQacs(fetchedVisit.answers.map((answer, index) => ({ index, ...answer })));
        setVisit(fetchedVisit);

        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchData();
  }, [id, initialUserFormContext, operator]);

  useEffect(() => {
    if (visit === undefined) {
      console.log("VISIT NOT FOUND!");
      setIsError(true);
      return;
    }

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
  }, [setValue, visit]);

  useEffect(() => {
    switch (userFormContext) {
      case UserFormContext.OPERATOR_EDIT:
        setFormButtons({
          submitButtonProps: {
            title: "Uložit změny",
            onClick: (data: FormPropType) => {
              // TODO: save the changes in DB
              setUserFormContext(UserFormContext.OPERATOR_APPROVE);
            },
          },
          buttonsProps: [
            {
              title: "Zrušit",
              onClick: () => {
                // TODO: reset to previously saved data
                reset();
                setUserFormContext(UserFormContext.OPERATOR_APPROVE);
              },
            },
          ],
        });
        break;
      case UserFormContext.OPERATOR_APPROVE:
        setFormButtons({
          submitButtonProps: {
            title: "Schvaluji",
            onClick: () => {
              // TODO: store changes in DB if made
              updateDummyVisitState(id, VisitState.APPROVED);
              navigate(`/auth/visit/${id}`);
            },
          },
          buttonsProps: [
            {
              title: "Neschvaluji",
              onClick: () => {
                // TODO: store changes in DB if made
                updateDummyVisitState(id, VisitState.DISAPPROVED);
                navigate("/auth/approval");
              },
              showErrorColor: true,
            },
            {
              title: "Editovat",
              onClick: () => setUserFormContext(UserFormContext.OPERATOR_EDIT),
            },
            {
              title: "Zpět",
              onClick: () => navigate(-1),
            },
          ],
        });
        break;
      default:
        // UserFormContext.OPERATOR_APPROVE_DISABLED
        setFormButtons({
          submitButtonProps: undefined,
          buttonsProps: [
            // Even though it's the only button for this UserFormContext, doesn't have 'submit' type because MUI uses <span> for buttons
            {
              title: "Zpět",
              onClick: () => navigate(-1),
            },
          ],
        });
        break;
    }
    setButtonsAreLoading(false);
  }, [userFormContext, id, navigate, operator?.hasHigherPermission, reset]);

  const onSubmit = (data: FormPropType) => {
    // TODO: submit data
    console.log("Submitted data:");
    console.log(data);
    formButtons.submitButtonProps?.onClick(data);
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
            <FormProjectInfo disableInputs={userFormContext !== UserFormContext.OPERATOR_EDIT} />
            <FormProbandInfo disableInputs={userFormContext !== UserFormContext.OPERATOR_EDIT} />
            <FormProbandContact disableInputs={userFormContext !== UserFormContext.OPERATOR_EDIT} />
            <FormQuestions
              title="Část 1"
              qacs={qacs.filter((qac) => qac.partNumber === 1)}
              disableInputs={userFormContext !== UserFormContext.OPERATOR_EDIT}
            />
            <FormQuestions
              title="Část 2"
              qacs={qacs.filter((qac) => qac.partNumber === 2)}
              disableInputs={userFormContext !== UserFormContext.OPERATOR_EDIT}
            />
            {!buttonsAreLoading && <FormButtons {...formButtons} />}
          </Stack>
        </form>
      </FormProvider>
    </PageTemplate>
  );
};
