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

interface ILanguageItemProps {
  name: string;
  label: string;
}

const languages: ILanguageItemProps[] = [
  {
    name: "Čeština",
    label: "CZ",
  },
  {
    name: "Slovenčina",
    label: "SK",
  },
  {
    name: "English",
    label: "EN",
  },
];

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

  // TODO: use localization hook instead
  const selectedLanguageName = languages[0].name;

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
        {selectedLanguageName}
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
                  {languages.map((language) => (
                    <MenuItem
                      key={language.name}
                      onClick={popupState.close}
                      sx={{
                        fontSize: "0.9rem",
                        "&:hover": { ...languageItemHoverFocus },
                        "&:focus-visible": { ...languageItemHoverFocus },
                      }}
                    >
                      {language.name}
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
