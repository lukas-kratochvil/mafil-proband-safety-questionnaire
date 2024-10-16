import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LanguageIcon from "@mui/icons-material/Language";
import {
  Button,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  type SxProps,
  type Theme,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { bindPopper, bindToggle, usePopupState } from "material-ui-popup-state/hooks";
import i18n, { type LanguageCode } from "@app/i18n/i18n";

const languageNativeNames: Record<LanguageCode, string> = {
  cs: "Čeština",
  en: "English",
};

const languageItemHoverFocus: SxProps<Theme> = {
  color: blue[800],
  bgcolor: blue[50],
};

export const LanguageMenu = () => {
  const popupState = usePopupState({
    variant: "popper",
    popupId: "language-menu",
    disableAutoFocus: true,
  });

  const selectedLanguageOnClick = (language: string) => {
    void i18n.changeLanguage(language);
    popupState.close();
  };

  return (
    <Grid
      container
      justifyContent="flex-end"
      data-testid="language-menu"
    >
      <Button
        {...bindToggle(popupState)}
        variant="contained"
        startIcon={<LanguageIcon />}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: "unset",
          bgcolor: blue[600],
          "&:hover": {
            bgcolor: blue[800],
          },
        }}
      >
        {languageNativeNames[i18n.resolvedLanguage as LanguageCode]}
      </Button>
      <Popper
        {...bindPopper(popupState)}
        placement="bottom-end"
        transition
        disablePortal
        sx={{
          zIndex: 1000,
          minWidth: "8rem",
        }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={2}>
              <ClickAwayListener onClickAway={popupState.close}>
                <MenuList
                  autoFocus
                  sx={{
                    padding: 0,
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  {Object.keys(languageNativeNames).map((language) => (
                    <MenuItem
                      key={language}
                      onClick={() => selectedLanguageOnClick(language)}
                      sx={{
                        fontSize: "0.9rem",
                        "&:hover": { ...languageItemHoverFocus },
                        "&:focus-visible": { ...languageItemHoverFocus },
                      }}
                    >
                      {languageNativeNames[language as LanguageCode]}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Grid>
  );
};
