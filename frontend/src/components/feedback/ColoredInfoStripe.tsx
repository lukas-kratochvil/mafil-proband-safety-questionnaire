import { Alert, AlertColor } from "@mui/material";

export interface IColoredInfoStripeProps {
  text: string;
  color: AlertColor;
}

export const ColoredInfoStripe = ({ text, color }: IColoredInfoStripeProps) => (
  <Alert
    severity="info"
    variant="filled"
    color={color}
    icon={false}
    sx={{
      width: "100%",
      padding: 0,
      "& .MuiAlert-message": {
        width: "100%",
        fontSize: "1rem",
        textAlign: "center",
      },
    }}
  >
    {text.toUpperCase()}
  </Alert>
);
