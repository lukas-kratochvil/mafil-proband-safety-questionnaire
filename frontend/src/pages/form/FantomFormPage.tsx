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
import { createVisit, VisitState } from "../../data/visit_data";
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

// Autocomplete component default value must be one of the options provided or null
const loadFantomFormDefaultValues = (): FormPropType => ({
  ...loadFormDefaultValues(),
  measurementDate: new Date(),
  gender: "Jiné",
});

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
        const newFantomVisit = createVisit(
          {
            ...data,
            id: "123",
            createdAt: new Date(),
            visitId: "123",
            pdf: "/dummy.pdf",
            state: VisitState.SIGNED,
            projectInfo: {
              ...data,
              projectId: "1",
              magnetDeviceId: "1",
              isFantom: true,
              measurementDate: data.measurementDate ?? new Date(),
            },
            probandInfo: {
              ...data,
              birthdate: data.birthdate ?? new Date(),
              height: typeof data.height === "string" ? +data.height : data.height,
              weight: typeof data.weight === "string" ? +data.weight : data.weight,
              gender: "Jiné",
              nativeLanguage: data.nativeLanguage ?? "Angličtina",
              visualCorrection: data.visualCorrection ?? "Ne",
              visualCorrectionValue: typeof data.visualCorrectionValue === "string" ? +data.visualCorrectionValue : 0,
              sideDominance: "Neurčeno",
            },
          },
          VisitState.SIGNED
        );
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
