import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../../hooks/auth/Auth";
import { FormCard } from "./FormCard";

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
        spacing={username === undefined ? 1 : 2}
        minWidth="100%"
      >
        {questions.map((question, index) => (
          <Stack
            key={index}
            sx={{
              "&:hover": {
                borderRadius: 1,
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
        ))}
      </Stack>
    </FormCard>
  );
};
