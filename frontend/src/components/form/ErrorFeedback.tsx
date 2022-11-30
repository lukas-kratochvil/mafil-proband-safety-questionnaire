import { ErrorMessage } from "@hookform/error-message";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey } from "@util/utils";

interface IErrorFeedbackProps {
  name: string;
}

export const ErrorFeedback = ({ name }: IErrorFeedbackProps) => {
  const { t } = useTranslation();

  return (
    <ErrorMessage
      name={name}
      render={({ message }) => (
        <Typography
          color={({ palette }) => palette.error.main}
          fontSize="1rem"
          paddingX="0.5rem"
        >
          {t(convertStringToLocalizationKey(message))}
        </Typography>
      )}
    />
  );
};
