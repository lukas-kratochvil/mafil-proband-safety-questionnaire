import { Grid, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { IQuestionData } from "../../data/question_data";
import { IQac } from "../../data/visit_data";
import { useAuth } from "../../hooks/auth/Auth";
import { fetchQuestion } from "../../util/fetch";
import { ErrorFeedback } from "./ErrorFeedback";
import { FormLabelField } from "./inputs/FormLabelField";
import { FormRadioGroup } from "./inputs/FormRadioGroup";
import { IFormInputsProps } from "./types/types";

export interface IFormQac extends IQac {
  index: number;
}

export type AnswerOptionsType = "yes" | "no" | undefined;

interface IFormQuestionProps extends IFormInputsProps {
  qac: IFormQac;
}

export const FormQuestion = ({ qac, disableInputs }: IFormQuestionProps) => {
  const theme = useTheme();
  const matchesUpSmBreakpoint = useMediaQuery(theme.breakpoints.up("sm"));
  const { username } = useAuth();
  const [question, setQuestion] = useState<IQuestionData>();
  const { setValue } = useFormContext();
  const questionAnswer = useWatch({
    name: `answers[${qac.index}].answer`,
    defaultValue: qac.answer,
  });

  useEffect(() => {
    // TODO: fetch question from DB
    const fetchData = async () => {
      setQuestion(await fetchQuestion(qac.questionId));
    };

    fetchData();
  }, [qac.questionId]);

  useEffect(() => {
    if (questionAnswer !== "yes") {
      setValue(`answers[${qac.index}].comment`, "");
    }
  }, [qac.index, questionAnswer, setValue]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      columns={1}
      columnGap="3rem"
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
          disabled={disableInputs}
          sx={{ justifyContent: matchesUpSmBreakpoint ? "flex-end" : "flex-start" }}
        />
        <ErrorFeedback name={`answers[${qac.index}].answer`} />
      </Grid>
      {username !== undefined && questionAnswer === "yes" && (
        <Grid
          item
          xs={1}
        >
          <FormLabelField label="Komentář">
            <Controller
              name={`answers[${qac.index}].comment`}
              render={({ field: { ref, ...rest } }) => (
                <TextField
                  {...rest}
                  inputRef={ref}
                  size="small"
                  multiline
                  disabled={questionAnswer !== "yes" && disableInputs}
                />
              )}
            />
            <ErrorFeedback name={`answers[${qac.index}].comment`} />
          </FormLabelField>
        </Grid>
      )}
    </Grid>
  );
};
