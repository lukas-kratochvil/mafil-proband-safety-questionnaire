import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { FormCard } from "./FormCard";

interface IFormQuestionsProps {
  title: string;
  questions: string[];
}

export const FormQuestions = ({ title, questions }: IFormQuestionsProps) => {
  return (
    <FormCard title={title}>
      <Stack
        spacing={1}
        minWidth="100%"
      >
        {questions.map((question, index) =>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            key={index}
          >
            <Typography>{question}</Typography>
            <FormControl >
              <RadioGroup
                row
                name="question-radio-buttons-group"
              >
                <FormControlLabel value="yes" control={<Radio required={true} />} label="Ano" />
                <FormControlLabel value="no" control={<Radio required={true} />} label="Ne" />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
      </Stack>
    </FormCard>
  );
}
