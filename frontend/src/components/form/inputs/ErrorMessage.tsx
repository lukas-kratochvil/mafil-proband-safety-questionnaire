import { ErrorMessage as HookFormErrorMessage } from "@hookform/error-message";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey } from "@app/i18n/i18n";

interface IErrorFeedbackProps {
  name: string;
}

export const ErrorMessage = ({ name }: IErrorFeedbackProps) => {
  const { t } = useTranslation();

  return (
    <HookFormErrorMessage
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
