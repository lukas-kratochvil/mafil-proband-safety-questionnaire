import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormBeforeExamination } from "../../components/form/FormBeforeExamination";
import { FormButtons, IFormButtonsProps } from "../../components/form/FormButtons";
import { FormEntryInfo } from "../../components/form/FormEntryInfo";
import { FormExaminationConsent } from "../../components/form/FormExaminationConsent";
import { FormProbandContact } from "../../components/form/FormProbandContact";
import { FormProbandInfo } from "../../components/form/FormProbandInfo";
import { IFormQac } from "../../components/form/FormQuestion";
import { FormQuestions } from "../../components/form/FormQuestions";
import { FormSafetyInfo } from "../../components/form/FormSafetyInfo";
import { defaultFormSchema } from "../../components/form/schemas/form-schema_default";
import { FormPropType } from "../../components/form/types/types";
import { fetchCurrentQuestions } from "../../util/fetch";
import { PageTemplate } from "../PageTemplate";

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

export const ProbandFormPage = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const matchesDownSmBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));

  const [qacs, setQacs] = useState<IFormQac[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true); // TODO: use MUI Skeleton while data is fetching
  const [isError, setIsError] = useState<boolean>(false); // TODO: create ErrorPage

  const formMethods = useForm<FormPropType>({
    mode: "onChange",
    defaultValues: loadFormDefaultValues(),
    resolver: yupResolver(defaultFormSchema),
    // TODO: add this if the validation on onChange event is too slow:
    // reValidateMode: "onSubmit",
  });
  const { handleSubmit, setValue } = formMethods;

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      title: "Souhlasím",
      onClick: (data: FormPropType) => {
        // TODO: create visit in DB
        navigate("/home");
      },
    },
    buttonsProps: [],
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
            answer: undefined,
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
            <FormEntryInfo />
            <FormProbandInfo />
            <FormProbandContact />
            <FormSafetyInfo />
            <FormQuestions
              title="Bezpečnostní otázky"
              qacs={qacs}
              disableInputs={false}
            />
            <FormBeforeExamination />
            <FormExaminationConsent />
            <FormButtons {...formButtons} />
          </Stack>
        </form>
      </FormProvider>
    </PageTemplate>
  );
};
