import { Grid, Typography, useMediaQuery, type Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "@app/hooks/auth/auth";
import { answerOptions, type FormPropType, type FormQac } from "@app/model/form";
import { FormRadioGroup } from "../inputs/FormRadioGroup";
import { FormTextField } from "../inputs/FormTextField";
import type { FormCardProps } from "./form-card";

type FormQuestionProps = FormCardProps & {
  qac: FormQac;
  disableComment?: boolean;
};

export const FormQuestion = ({ qac, disableInputs, disableComment }: FormQuestionProps) => {
  const { i18n, t } = useTranslation("translation", { keyPrefix: "form.safetyQuestions" });
  const matchesUpSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const { operator } = useAuth();
  const { setValue } = useFormContext<FormPropType>();

  const [hideQuestion, setHideQuestion] = useState<boolean>(false);
  const selectedGender = useWatch<FormPropType, "gender">({ name: "gender" });
  const questionAnswer = useWatch<FormPropType, `answers.${number}.answer`>({
    name: `answers.${qac.index}.answer`,
    defaultValue: qac.answer,
  });

  // Setting all the question default data
  useEffect(() => {
    setValue(`answers.${qac.index}.questionId`, qac.questionId);
    setValue(`answers.${qac.index}.mustBeApproved`, qac.mustBeApproved);
    setValue(`answers.${qac.index}.answer`, qac.answer);
    setValue(`answers.${qac.index}.comment`, qac.comment);
  }, [qac, setValue]);

  // Hide question when specified genders are selected
  useEffect(() => {
    if (selectedGender && qac.hiddenByGenders.map((hbg) => hbg.genderCode).includes(selectedGender.code)) {
      setHideQuestion(true);
      setValue(`answers.${qac.index}.answer`, "NO");
    } else {
      setValue(`answers.${qac.index}.answer`, qac.answer);
      setHideQuestion(false);
    }
  }, [qac, selectedGender, setValue]);

  // Reset comment if the current answer is 'NO'
  useEffect(() => {
    if (questionAnswer !== "YES") {
      setValue(`answers.${qac.index}.comment`, "");
    }
  }, [qac.index, questionAnswer, setValue]);

  if (hideQuestion) {
    return null;
  }

  type AnswerOptionRadioLabel = keyof typeof answerOptions;

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
        paddingY={matchesUpSmBreakpoint ? "0.6rem" : undefined}
      >
        <Typography>{qac.translations.find((trans) => trans.language.code === i18n.language)?.text ?? ""}</Typography>
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
          radios={Object.values(answerOptions).map((answer) => ({
            id: `${answer}-radio[${qac.questionId}]`,
            label: t(answer.toLowerCase() as AnswerOptionRadioLabel),
            value: answer,
          }))}
          disabled={disableInputs}
          sx={{ justifyContent: matchesUpSmBreakpoint ? "flex-end" : "flex-start" }}
        />
      </Grid>
      {operator && questionAnswer === "YES" && (
        <Grid
          item
          xs={1}
          marginBottom="0.5rem"
        >
          <FormTextField
            label={t("comment")}
            name={`answers.${qac.index}.comment`}
            isSmall
            isMultiline
            hasAutocomplete
            disabled={disableComment || (questionAnswer !== "YES" && disableInputs)}
          />
        </Grid>
      )}
    </Grid>
  );
};
