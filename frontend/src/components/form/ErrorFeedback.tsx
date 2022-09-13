import { ErrorMessage } from "@hookform/error-message";
import { Typography, useTheme } from "@mui/material";

interface IErrorFeedbackProps {
  name: string;
}

export const ErrorFeedback = ({ name }: IErrorFeedbackProps) => {
  const theme = useTheme();

  return (
    <ErrorMessage
      name={name}
      as={
        <Typography
          color={theme.palette.error.main}
          fontSize="1rem"
          paddingX="0.5rem"
        />
      }
    />
  )
};
