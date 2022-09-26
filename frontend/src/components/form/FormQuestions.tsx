import { Grid, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
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
  const matchesUpSmBreakpoint = useMediaQuery(theme.breakpoints.up("sm"));
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
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      columns={1}
      columnGap={6}
      sx={{
        "&:hover": {
          borderRadius: "0.25rem",
          backgroundColor: theme.palette.grey[100],
        },
      }}
    >
      <Grid
        item
        xs={1}
        sm
      >
        <Typography>{question?.text}</Typography>
      </Grid>
      <Grid
        item
        xs={1}
        sm="auto"
      >
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
          sx={{ justifyContent: matchesUpSmBreakpoint ? "flex-end" : "flex-start" }}
        />
        <ErrorFeedback name={`answers[${qac.index}].answer`} />
      </Grid>
      {username !== undefined && questionAnswer === "yes" && (
        <Grid
          item
          xs={1}
        >
          <Controller
            name={`answers[${qac.index}].comment`}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                {...rest}
                inputRef={ref}
                label="Komentář"
                size="small"
                multiline
                disabled={disabled}
              />
            )}
          />
          <ErrorFeedback name={`answers[${qac.index}].comment`} />
        </Grid>
      )}
    </Grid>
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
      width="100%"
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
