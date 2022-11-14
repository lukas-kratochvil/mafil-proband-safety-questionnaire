import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import i18n from "../../i18n";

export const MockedProviders = ({ children }: PropsWithChildren) => {
  const theme = createTheme({});

  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};
