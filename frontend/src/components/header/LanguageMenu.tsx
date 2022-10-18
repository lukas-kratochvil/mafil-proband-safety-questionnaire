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
  SxProps,
  Theme,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { bindPopper, bindToggle, usePopupState } from "material-ui-popup-state/hooks";
import { useTranslation } from "react-i18next";
import { LocalizationKeys } from "../../i18n";

type SupportedLanguageType = {
  [key in LocalizationKeys]: {
    nativeName: string;
  };
};

const supportedLanguages: SupportedLanguageType = {
  cz: { nativeName: "Čeština" },
  en: { nativeName: "English" },
};

type SupportedLanguageKeys = keyof typeof supportedLanguages;

const languageItemHoverFocus: SxProps<Theme> = {
  color: blue[800],
  bgcolor: blue[50],
};

export const LanguageMenu = () => {
  const { i18n } = useTranslation();
  const popupState = usePopupState({
    variant: "popper",
    popupId: "language-menu",
    disableAutoFocus: true,
  });

  const selectedLanguageNativeName = supportedLanguages[i18n.resolvedLanguage as SupportedLanguageKeys].nativeName;

  const selectedLanguageOnClick = (language: string) => {
    i18n.changeLanguage(language);
    popupState.close();
  };

  return (
    <Grid
      container
      justifyContent="flex-end"
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
        {selectedLanguageNativeName}
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
                  {Object.keys(supportedLanguages).map((language) => (
                    <MenuItem
                      key={language}
                      onClick={() => selectedLanguageOnClick(language)}
                      sx={{
                        fontSize: "0.9rem",
                        "&:hover": { ...languageItemHoverFocus },
                        "&:focus-visible": { ...languageItemHoverFocus },
                      }}
                    >
                      {supportedLanguages[language as SupportedLanguageKeys].nativeName}
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
