import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FormButtons, IFormButtonsProps } from "../../components/form/FormButtons";
import { FormProbandContact } from "../../components/form/FormProbandContact";
import { FormProbandInfo } from "../../components/form/FormProbandInfo";
import { FormProjectInfo } from "../../components/form/FormProjectInfo";
import { IFormQac } from "../../components/form/FormQuestion";
import { FormQuestions } from "../../components/form/FormQuestions";
import { operatorFormSchema } from "../../components/form/schemas/form-schema_operator";
import { FormPropType } from "../../components/form/types/types";
import { loadFormDefaultValues, loadFormDefaultValuesFromVisit } from "../../components/form/util/utils";
import { VisitState } from "../../data/visit_data";
import { useAuth } from "../../hooks/auth/Auth";
import { fetchVisit } from "../../util/fetch";
import { updateDummyVisitState } from "../../util/fetch.dev";
import { PageTemplate } from "../PageTemplate";

export const WaitingRoomFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { operator } = useAuth();

  const theme = useTheme();
  const matchesDownSmBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));

  const [qacs, setQacs] = useState<IFormQac[]>([]);

  const [isEditing, setIsEditing] = useState<boolean>(false);

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

        console.log("FETCHING QUESTIONS FROM THE VISIT");
        setQacs(fetchedVisit.answers.map((answer, index) => ({ index, ...answer })));

        console.log("SETTING DEFAULT VALUES");
        const defaultValues = loadFormDefaultValuesFromVisit(fetchedVisit);
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

        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchData();
  }, [id, operator, setValue]);

  useEffect(() => {
    if (isEditing) {
      setFormButtons({
        submitButtonProps: {
          title: "Uložit změny",
          onClick: (data: FormPropType) => {
            // TODO: save the changes in DB
            setIsEditing(false);
          },
        },
        buttonsProps: [
          {
            title: "Zrušit",
            onClick: () => {
              // TODO: reset to previously saved data
              reset();
              setIsEditing(false);
            },
          },
        ],
      });
    } else {
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
              navigate(`/auth/visit/${id}`);
            } else {
              updateDummyVisitState(id, VisitState.IN_APPROVAL);
              navigate("/auth/waiting-room");
            }
          },
        },
        buttonsProps: [
          {
            title: "Neschválit",
            onClick: () => {
              // TODO: store changes in DB if made
              updateDummyVisitState(id, VisitState.DISAPPROVED);
              navigate("/auth/approval");
            },
            showErrorColor: true,
          },
          {
            title: "Editovat",
            onClick: () => setIsEditing(true),
          },
          {
            title: "Zrušit",
            onClick: () => navigate(-1),
          },
        ],
      });
    }
    setButtonsAreLoading(false);
  }, [id, isEditing, navigate, operator?.hasHigherPermission, reset]);

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
            <FormProjectInfo />
            <FormProbandInfo disableInputs={!isEditing} />
            <FormProbandContact disableInputs={!isEditing} />
            <FormQuestions
              title="Část 1"
              qacs={qacs.filter((qac) => qac.partNumber === 1)}
              disableInputs={!isEditing}
            />
            <FormQuestions
              title="Část 2"
              qacs={qacs.filter((qac) => qac.partNumber === 2)}
              disableInputs={!isEditing}
            />
            {!buttonsAreLoading && <FormButtons {...formButtons} />}
          </Stack>
        </form>
      </FormProvider>
    </PageTemplate>
  );
};
