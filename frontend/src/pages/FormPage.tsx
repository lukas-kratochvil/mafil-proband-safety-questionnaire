import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FormBeforeExamination } from "../components/form/FormBeforeExamination";
import { FormButtons, IFormButtonsProps } from "../components/form/FormButtons";
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
import { FormEditState, FormPropType } from "../components/form/types/types";
import { IVisit, VisitState } from "../data/visit_data";
import { useAuth } from "../hooks/auth/Auth";
import { fetchCurrentQuestions, fetchVisit } from "../util/fetch";
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
  initialEditState: FormEditState;
}

export const FormPage = ({ initialEditState }: IFormPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { operator } = useAuth();

  const theme = useTheme();
  const matchesDownSmBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));

  const [visit, setVisit] = useState<IVisit | undefined>();
  const [qacs, setQacs] = useState<IFormQac[]>([]);
  const [formEditState, setFormEditState] = useState<FormEditState>(initialEditState);

  const [buttonsAreLoading, setButtonsAreLoading] = useState<boolean>(true);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps>({} as IFormButtonsProps);

  const [isLoading, setIsLoading] = useState<boolean>(true); // TODO: use MUI Skeleton while data is fetching
  const [isError, setIsError] = useState<boolean>(false); // TODO: create ErrorPage

  const schema = operator === undefined ? defaultFormSchema : operatorFormSchema;
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
          if (operator !== undefined) {
            console.log("AUTH DOES NOT FETCHED THE VISIT!");
            setIsError(true);
            return;
          }

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
          if (operator === undefined) {
            console.log("UNAUTHORIZED ACCESS!");
            setIsError(true);
            return;
          }

          // Form from 'ApprovalTablePage' must be initially called with 'OPERATOR_APPROVE_DISABLED'
          if (
            initialEditState === FormEditState.OPERATOR_APPROVE_DISABLED
            && fetchedVisit.state !== VisitState.IN_APPROVAL
          ) {
            setFormEditState(FormEditState.OPERATOR_APPROVE);
          }

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
  }, [id, operator]);

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

  useEffect(() => {
    switch (formEditState) {
      case FormEditState.PROBAND_EDIT:
        setFormButtons({
          submitButtonProps: {
            title: "Souhlasím",
            onClick: (data: FormPropType) => {
              // TODO: create visit in DB
              navigate("/form-after-submission");
            },
          },
          buttonsProps: [],
        });
        break;
      case FormEditState.FANTOM:
        setFormButtons({
          submitButtonProps: {
            title: "Finalizovat",
            onClick: (data: FormPropType) => {
              // TODO: store changes in DB if made
              updateDummyVisitState(id, VisitState.FANTOM_DONE);
              navigate(`/auth/visit-detail/${id}`);
            },
          },
          buttonsProps: [
            {
              title: "Zrušit",
              // Navigate back to the previous page
              onClick: () => navigate(-1),
            },
          ],
        });
        break;
      case FormEditState.OPERATOR_CHECK:
        setFormButtons({
          submitButtonProps: {
            title: "Finalizovat",
            onClick: (data: FormPropType) => {
              // TODO: store changes in DB if made
              if (
                operator?.hasHigherPermission
                || data.answers.find((answer) => answer.partNumber === 2 && answer.answer === "yes") === undefined
              ) {
                updateDummyVisitState(id, VisitState.APPROVED);
                navigate(`/auth/visit-detail/${id}`);
              } else {
                updateDummyVisitState(id, VisitState.IN_APPROVAL);
                navigate("/auth/waiting-room");
              }
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
            },
            {
              title: "Editovat",
              onClick: () => {
                setFormEditState(FormEditState.OPERATOR_EDIT);
              },
            },
            {
              title: "Zrušit",
              onClick: () => navigate("/auth/waiting-room"),
            },
          ],
        });
        break;
      case FormEditState.OPERATOR_EDIT:
        setFormButtons({
          submitButtonProps: {
            title: "Uložit změny",
            onClick: (data: FormPropType) => {
              // TODO: save the changes in DB
              setFormEditState(
                operator?.hasHigherPermission ? FormEditState.OPERATOR_APPROVE : FormEditState.OPERATOR_CHECK
              );
            },
          },
          buttonsProps: [
            {
              title: "Zrušit",
              onClick: () => {
                reset();
                setFormEditState(
                  operator?.hasHigherPermission ? FormEditState.OPERATOR_APPROVE : FormEditState.OPERATOR_CHECK
                );
              },
            },
          ],
        });
        break;
      case FormEditState.OPERATOR_APPROVE:
        setFormButtons({
          submitButtonProps: {
            title: "Schvaluji",
            onClick: () => {
              // TODO: store changes in DB if made
              updateDummyVisitState(id, VisitState.APPROVED);
              navigate(`/auth/visit-detail/${id}`);
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
            },
            {
              title: "Editovat",
              onClick: () => {
                setFormEditState(FormEditState.OPERATOR_EDIT);
              },
            },
            {
              title: "Zpět",
              onClick: () => navigate("/auth/waiting-room"),
            },
          ],
        });
        break;
      default:
        // FormEditState.OPERATOR_APPROVE_DISABLED
        setFormButtons({
          submitButtonProps: undefined,
          buttonsProps: [
            {
              title: "Zpět",
              onClick: () => navigate(-1),
            },
          ],
        });
        break;
    }
    setButtonsAreLoading(false);
  }, [formEditState, id, navigate, operator?.hasHigherPermission, reset]);

  const onSubmit = (data: FormPropType) => {
    // if (formEditState !== FormEditState.OPERATOR_APPROVE_DISABLED) {
    // TODO: submit data
    console.log("Submitted data:");
    console.log(data);
    formButtons.submitButtonProps?.onClick(data);
    // }
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
            {formEditState === FormEditState.PROBAND_EDIT ? (
              <>
                <FormEntryInfo />
                <FormProbandInfo disableInputs={false} />
                <FormProbandContact disableInputs={false} />
                <FormSafetyInfo />
                <FormQuestions
                  title="Bezpečnostní otázky"
                  qacs={qacs}
                  disableInputs={false}
                />
                <FormBeforeExamination />
                <FormExaminationConsent />
              </>
            ) : (
              <>
                <FormProjectInfo
                  isFantom={formEditState === FormEditState.FANTOM}
                  disableInputs={[FormEditState.OPERATOR_APPROVE, FormEditState.OPERATOR_APPROVE_DISABLED].includes(
                    formEditState
                  )}
                />
                <FormProbandInfo
                  disableInputs={[
                    FormEditState.OPERATOR_CHECK,
                    FormEditState.OPERATOR_APPROVE,
                    FormEditState.OPERATOR_APPROVE_DISABLED,
                  ].includes(formEditState)}
                />
                {formEditState !== FormEditState.FANTOM && (
                  <>
                    <FormProbandContact
                      disableInputs={[
                        FormEditState.OPERATOR_CHECK,
                        FormEditState.OPERATOR_APPROVE,
                        FormEditState.OPERATOR_APPROVE_DISABLED,
                      ].includes(formEditState)}
                    />
                    <FormQuestions
                      title="Část 1"
                      qacs={qacs.filter((qac) => qac.partNumber === 1)}
                      disableInputs={[
                        FormEditState.OPERATOR_CHECK,
                        FormEditState.OPERATOR_APPROVE,
                        FormEditState.OPERATOR_APPROVE_DISABLED,
                      ].includes(formEditState)}
                    />
                    <FormQuestions
                      title="Část 2"
                      qacs={qacs.filter((qac) => qac.partNumber === 2)}
                      disableInputs={[
                        FormEditState.OPERATOR_CHECK,
                        FormEditState.OPERATOR_APPROVE,
                        FormEditState.OPERATOR_APPROVE_DISABLED,
                      ].includes(formEditState)}
                    />
                  </>
                )}
              </>
            )}
            {!buttonsAreLoading && <FormButtons {...formButtons} />}
          </Stack>
        </form>
      </FormProvider>
    </PageTemplate>
  );
};
