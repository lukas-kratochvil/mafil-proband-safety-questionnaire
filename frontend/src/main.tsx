import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./theme";

const AuthProvider = lazy(() =>
  import.meta.env.PROD ? import("./hooks/auth/AuthProvider") : import("./hooks/auth/dev/AuthProvider.dev")
);
const App = lazy(() => import("./App"));

const queryClient = new QueryClient();

const renderApp = async () => {
  // load the configuration before rendering any React component or importing any of the application's modules
  if (import.meta.env.PROD) {
    await (await import("./config/config")).loadConfig();
  } else {
    await (await import("./config/config.dev")).loadConfigDev();
  }

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <ThemeProvider theme={theme}>
              <CssBaseline enableColorScheme />
              <App />
            </ThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

void renderApp();
