import { ErrorMessage } from "@hookform/error-message";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

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
          {t(message as unknown as TemplateStringsArray)}
        </Typography>
      )}
    />
  );
};
