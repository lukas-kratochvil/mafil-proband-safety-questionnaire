import { Grid, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { IQuestionData } from "../../data/question_data";
import { IQac } from "../../data/visit_data";
import { useAuth } from "../../hooks/auth/Auth";
import { fetchQuestion } from "../../util/utils";
import { ErrorFeedback } from "./ErrorFeedback";
import { FormCard } from "./FormCard";
import { FormRadioGroup } from "./inputs/FormRadioGroup";

interface IQuestionProps {
  index: number;
  qac: IQac;
  disabled: boolean;
}

export type AnswerOptionsType = "yes" | "no" | undefined;

const Question = ({ index, qac, disabled }: IQuestionProps) => {
  const { username } = useAuth();
  const [question, setQuestion] = useState<IQuestionData>();
  const questionAnswer = useWatch({
    name: `answers[${index}].answer`,
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
          backgroundColor: "#f4f4f4",
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
          name={`answers[${index}].answer`}
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
        <ErrorFeedback name={`answers[${index}].answer`} />
      </Grid>
      {username !== undefined && questionAnswer === "yes" && (
        <>
          <Controller
            name={`answers[${index}].comment`}
            render={({ field: { value, onChange, ref } }) => (
              <TextField
                label="Komentář"
                value={value}
                onChange={onChange}
                inputRef={ref}
                variant="standard"
                size="small"
                multiline
                disabled={disabled}
              />
            )}
          />
          <ErrorFeedback name={`answers[${index}].comment`} />
        </>
      )}
    </Stack>
  );
};

interface IFormQuestionsProps {
  title: string;
  qacs: IQac[];
  isAuthEditing: boolean;
}

export const FormQuestions = ({ title, qacs, isAuthEditing }: IFormQuestionsProps) => (
  <FormCard title={title}>
    <Stack
      spacing="0.5rem"
      minWidth="100%"
    >
      {qacs.map((qac, index) => (
        <Question
          key={qac.questionId}
          index={index}
          qac={qac}
          disabled={!isAuthEditing}
        />
      ))}
    </Stack>
  </FormCard>
);
