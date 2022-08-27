import { ErrorMessage } from "@hookform/error-message";
import { Typography } from "@mui/material";

interface IErrorFeedbackProps {
  name: string;
}

export const ErrorFeedback = ({ name }: IErrorFeedbackProps) => (
  <ErrorMessage
    name={name}
    as={
      <Typography
        color="red"
        fontSize="1rem"
        paddingX="0.5rem"
      />
    }
  />
);
