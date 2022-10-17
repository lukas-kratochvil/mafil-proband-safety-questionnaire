import { Grid, TextField, Theme, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IQuestionData } from "../../data/question_data";
import { AnswerOption } from "../../data/visit_data";
import { useAuth } from "../../hooks/auth/Auth";
import { defaultNS } from "../../i18n";
import { fetchQuestion } from "../../util/fetch";
import { FormInputFieldContainer } from "./inputs/FormInputFieldContainer";
import { FormRadioGroup } from "./inputs/FormRadioGroup";
import { FormAnswer, FormPropType, IFormInputsProps } from "./types/types";

export type FormQac = FormAnswer & { index: number };

interface IFormQuestionProps extends IFormInputsProps {
  qac: FormQac;
  disableComment?: boolean;
}

export const FormQuestion = ({ qac, disableInputs, disableComment }: IFormQuestionProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.safetyQuestions" });
  const matchesUpSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const { operator } = useAuth();
  const [question, setQuestion] = useState<IQuestionData>();
  const { setValue } = useFormContext();
  const questionAnswer = useWatch<FormPropType, `answers.${number}.answer`>({
    name: `answers.${qac.index}.answer`,
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
    if (questionAnswer !== AnswerOption.YES) {
      setValue(`answers.${qac.index}.comment`, "");
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
          bgcolor: ({ palette }) => palette.grey[100],
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
          name={`answers.${qac.index}.answer`}
          label={`Question: ${qac.questionId}`}
          defaultValue={qac.answer}
          radios={Object.values(AnswerOption).map((answer) => ({
            id: `${answer}-radio[${qac.questionId}]`,
            label: answer === AnswerOption.YES ? t("yes") : t("no"),
            value: answer,
          }))}
          disabled={disableInputs}
          sx={{ justifyContent: matchesUpSmBreakpoint ? "flex-end" : "flex-start" }}
        />
      </Grid>
      {operator !== undefined && questionAnswer === AnswerOption.YES && (
        <Grid
          item
          xs={1}
        >
          <FormInputFieldContainer
            label={t("comment")}
            name={`answers.${qac.index}.comment`}
          >
            <Controller
              name={`answers.${qac.index}.comment`}
              render={({ field: { ref, ...rest } }) => (
                <TextField
                  {...rest}
                  inputRef={ref}
                  size="small"
                  multiline
                  disabled={disableComment || (questionAnswer !== AnswerOption.YES && disableInputs)}
                />
              )}
            />
          </FormInputFieldContainer>
        </Grid>
      )}
    </Grid>
  );
};
