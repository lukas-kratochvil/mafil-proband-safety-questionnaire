import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import i18n from "@app/i18n";

export const MockedProviders = ({ children }: PropsWithChildren) => {
  const theme = createTheme({});
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};
