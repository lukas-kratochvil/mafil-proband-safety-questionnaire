import { FormControlLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import { IQuestionData } from "../../data/form_data";
import { useAuth } from "../../hooks/auth/Auth";
import { FormCard } from "./FormCard";

interface IQuestionProps {
  question: IQuestionData;
  isAuthEditing: boolean;
  isFantom: boolean;
}

enum RadioGroupOptions {
  YES = "YES",
  NO = "NO",
}

const Question = ({ question, isAuthEditing, isFantom }: IQuestionProps) => {
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
        <Controller
          name={question.id}
          defaultValue={isFantom ? RadioGroupOptions.NO : null}
          render={({ field: { value, ...rest } }) => (
            <RadioGroup
              row
              value={value === undefined ? null : value}
              {...rest}
            >
              <FormControlLabel
                label="Ano"
                value={RadioGroupOptions.YES}
                control={
                  <Radio
                    required
                    disabled={!isAuthEditing}
                  />
                }
              />
              <FormControlLabel
                label="Ne"
                value={RadioGroupOptions.NO}
                control={
                  <Radio
                    required
                    disabled={!isAuthEditing}
                  />
                }
              />
            </RadioGroup>
          )}
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
  isFantom: boolean;
}

export const FormQuestions = ({ title, questions, isAuthEditing, isFantom }: IFormQuestionsProps) => {
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
            isAuthEditing={isAuthEditing}
            isFantom={isFantom}
          />
        ))}
      </Stack>
    </FormCard>
  );
};
