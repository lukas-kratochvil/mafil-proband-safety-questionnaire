import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PropsWithChildren } from "react";

export const MockedProviders = ({ children }: PropsWithChildren) => {
  const theme = createTheme({});
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
