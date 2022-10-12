import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormButtons, IFormButtonsProps } from "../../components/form/FormButtons";
import { FormProbandInfo } from "../../components/form/FormProbandInfo";
import { FormProjectInfo } from "../../components/form/FormProjectInfo";
import { IFormQac } from "../../components/form/FormQuestion";
import { operatorFormSchema } from "../../components/form/schemas/form-schema_operator";
import { FormPropType } from "../../components/form/types/types";
import { createNewVisitFromFormData, loadFantomFormDefaultValues } from "../../components/form/util/utils";
import { dummyVisits, VisitState } from "../../data/visit_data";
import { fetchCurrentQuestions } from "../../util/fetch";
import { PageTemplate } from "../PageTemplate";

export const FantomFormPage = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const matchesDownSmBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));

  const [qacs, setQacs] = useState<IFormQac[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true); // TODO: use MUI Skeleton while data is fetching
  const [isError, setIsError] = useState<boolean>(false); // TODO: create ErrorPage

  const formMethods = useForm<FormPropType>({
    mode: "onChange",
    defaultValues: loadFantomFormDefaultValues(),
    resolver: yupResolver(operatorFormSchema),
    // TODO: add this if the validation on onChange event is too slow:
    // reValidateMode: "onSubmit",
  });
  const { handleSubmit, setValue } = formMethods;

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      title: "Finalizovat",
      onClick: (data: FormPropType) => {
        // TODO: create fantom visit in DB
        const newFantomVisit = createNewVisitFromFormData(data, VisitState.SIGNED);
        dummyVisits.push(newFantomVisit);
        navigate(`/auth/visit/${newFantomVisit.id}`);
      },
    },
    buttonsProps: [
      {
        title: "Zrušit",
        onClick: () => navigate(-1),
      },
    ],
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("FETCHING DEFAULT QUESTIONS");
        const questions = await fetchCurrentQuestions();

        setQacs(
          questions.map((qac, index) => ({
            index,
            questionId: qac.id,
            partNumber: qac.partNumber,
            answer: "no",
            comment: "",
          }))
        );

        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    setValue("answers", qacs);
  }, [qacs, setValue]);

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
            <FormProjectInfo isFantom />
            <FormProbandInfo isFantom />
            <FormButtons {...formButtons} />
          </Stack>
        </form>
      </FormProvider>
    </PageTemplate>
  );
};
