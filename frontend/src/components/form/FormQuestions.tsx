import { Grid, Stack, TextField, Typography } from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import { IQuestionData } from "../../data/form_data";
import { useAuth } from "../../hooks/auth/Auth";
import { FormCard } from "./FormCard";
import { FormRadioGroup } from "./inputs/FormRadioGroup";

interface IQuestionProps {
  question: IQuestionData;
  disabled: boolean;
}

enum RadioGroupOptions {
  YES = "YES",
  NO = "NO",
}

const Question = ({ question, disabled }: IQuestionProps) => {
  const { username } = useAuth();
  const questionAnswer = useWatch({ name: question.id });

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
        <Typography width="80%">{question.text}</Typography>
        <FormRadioGroup
          name={question.id}
          label={`Question: ${question.id}`}
          radios={[
            {
              id: `yes-radio[${question.id}]`,
              label: "Ano",
              value: RadioGroupOptions.YES,
            },
            {
              id: `no-radio[${question.id}]`,
              label: "Ne",
              value: RadioGroupOptions.NO,
            },
          ]}
          disabled={disabled}
        />
      </Grid>
      {username !== undefined && questionAnswer === RadioGroupOptions.YES && (
        <Controller
          name={`${question.id}-comment`}
          render={({ field }) => (
            <TextField
              {...field}
              label="Komentář"
              variant="standard"
              size="small"
              multiline
              required
            />
          )}
        />
      )}
    </Stack>
  );
};

interface IFormQuestionsProps {
  title: string;
  questions: IQuestionData[];
  isAuthEditing: boolean;
}

export const FormQuestions = ({ title, questions, isAuthEditing }: IFormQuestionsProps) => {
  const { username } = useAuth();

  return (
    <FormCard title={title}>
      <Stack
        spacing={username === undefined ? "0.5rem" : "1rem"}
        minWidth="100%"
      >
        {questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            disabled={!isAuthEditing}
          />
        ))}
      </Stack>
    </FormCard>
  );
};
