import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "@app/App";
import { AuthProviderDev } from "@app/hooks/auth/AuthProviderDev";

const queryClient = new QueryClient();

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            backgroundColor: "#eeeeee",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
    MuiToolbar: {
      // set up default Toolbar height so it doesn't change and we can make calculations with this value
      styleOverrides: {
        dense: {
          height: "4rem",
          minHeight: "4rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.85rem",
        },
      },
    },
  },
  palette: {
    background: {
      default: "rgb(248, 248, 248)",
    },
    text: {
      primary: "rgba(0, 0, 0, 1)",
      secondary: "rgba(0, 0, 0, 0.73)",
      disabled: "rgba(0, 0, 0, 0.51)",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProviderDev>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProviderDev>
    </BrowserRouter>
  </React.StrictMode>
);
