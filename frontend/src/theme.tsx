import { createTheme } from "@mui/material";

export const theme = createTheme({
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
