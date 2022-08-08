import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../../hooks/auth/Auth";
import { FormCard } from "./FormCard";

interface IQuestionProps {
  question: string;
  isAuthEditing: boolean;
}

const Question = ({ question, isAuthEditing }: IQuestionProps) => {
  const { username } = useAuth();

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
        <Typography width="80%">{question}</Typography>
        <FormControl>
          <RadioGroup
            row
            name="question-radio-buttons-group"
          >
            <FormControlLabel
              value="yes"
              control={
                <Radio
                  required
                  disabled={!isAuthEditing}
                />
              }
              label="Ano"
            />
            <FormControlLabel
              value="no"
              control={
                <Radio
                  required
                  disabled={!isAuthEditing}
                />
              }
              label="Ne"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      {username !== undefined && (
        <TextField
          label="Komentář"
          variant="standard"
          size="small"
          multiline
        />
      )}
    </Stack>
  );
};

interface IFormQuestionsProps {
  title: string;
  questions: string[];
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
        {questions.map((question, index) => (
          <Question
            key={index}
            question={question}
            isAuthEditing={isAuthEditing}
          />
        ))}
      </Stack>
    </FormCard>
  );
};
