import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { IAuth } from "../../App";
import { FormCard } from "./FormCard";

interface IFormQuestionsProps {
  title: string;
  questions: string[];
  auth?: IAuth;
  isEditing: boolean;
}

export const FormQuestions = ({ title, questions, auth, isEditing }: IFormQuestionsProps) => {
  return (
    <FormCard title={title}>
      <Stack
        spacing={auth === undefined ? 1 : 2}
        minWidth="100%"
      >
        {questions.map((question, index) =>
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
              <Typography>{question}</Typography>
              <FormControl>
                <RadioGroup
                  row
                  name="question-radio-buttons-group"
                >
                  <FormControlLabel value="yes" control={<Radio required={true} />} label="Ano" />
                  <FormControlLabel value="no" control={<Radio required={true} />} label="Ne" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {auth !== undefined &&
              <TextField
                label="Komentář"
                variant="standard"
                size="small"
                multiline
                disabled={!isEditing}
                key={index}
              />
            }
          </Stack>
        )}
      </Stack>
    </FormCard>
  );
}
