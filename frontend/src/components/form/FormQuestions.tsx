import { Grid, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { IQuestionData } from "../../data/question_data";
import { IQac } from "../../data/visit_data";
import { useAuth } from "../../hooks/auth/Auth";
import { fetchQuestion } from "../../util/utils";
import { ErrorFeedback } from "./ErrorFeedback";
import { FormCard } from "./FormCard";
import { FormRadioGroup } from "./inputs/FormRadioGroup";

export interface IFormQac extends IQac {
  index: number;
}

interface IQuestionProps {
  qac: IFormQac;
  disabled: boolean;
}

export type AnswerOptionsType = "yes" | "no" | undefined;

const Question = ({ qac, disabled }: IQuestionProps) => {
  const theme = useTheme();
  const { username } = useAuth();
  const [question, setQuestion] = useState<IQuestionData>();
  const questionAnswer = useWatch({
    name: `answers[${qac.index}].answer`,
    defaultValue: qac.answer,
  });

  useEffect(() => {
    const fetchData = async () => {
      setQuestion(await fetchQuestion(qac.questionId));
    };

    fetchData();
  }, [qac.questionId]);

  return (
    <Stack
      sx={{
        "&:hover": {
          borderRadius: "0.25rem",
          backgroundColor: theme.palette.grey[100],
        },
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography width="80%">{question?.text}</Typography>
        <FormRadioGroup
          name={`answers[${qac.index}].answer`}
          label={`Question: ${qac.questionId}`}
          defaultValue={qac.answer}
          radios={[
            {
              id: `yes-radio[${qac.questionId}]`,
              label: "Ano",
              value: "yes",
            },
            {
              id: `no-radio[${qac.questionId}]`,
              label: "Ne",
              value: "no",
            },
          ]}
          disabled={disabled}
        />
        <ErrorFeedback name={`answers[${qac.index}].answer`} />
      </Grid>
      {username !== undefined && questionAnswer === "yes" && (
        <>
          <Controller
            name={`answers[${qac.index}].comment`}
            render={({ field: { value, onChange, ref } }) => (
              <TextField
                label="Komentář"
                value={value}
                onChange={onChange}
                inputRef={ref}
                size="small"
                multiline
                disabled={disabled}
              />
            )}
          />
          <ErrorFeedback name={`answers[${qac.index}].comment`} />
        </>
      )}
    </Stack>
  );
};

interface IFormQuestionsProps {
  title: string;
  qacs: IFormQac[];
  isAuthEditing: boolean;
}

export const FormQuestions = ({ title, qacs, isAuthEditing }: IFormQuestionsProps) => (
  <FormCard title={title}>
    <Stack
      spacing="0.5rem"
      minWidth="100%"
    >
      {qacs.map((qac) => (
        <Question
          key={qac.questionId}
          qac={qac}
          disabled={!isAuthEditing}
        />
      ))}
    </Stack>
  </FormCard>
);
