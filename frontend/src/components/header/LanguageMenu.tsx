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
import { FlagComponent } from "country-flag-icons/react/3x2";
import { bindPopper, bindToggle, usePopupState } from "material-ui-popup-state/hooks";
import { languages } from "../../data/header_data";

export interface ILanguageItemProps {
  name: string;
  label: string;
  Flag: FlagComponent;
}

const languageItemHoverFocus: SxProps<Theme> = {
  color: blue[800],
  backgroundColor: blue[50],
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
          backgroundColor: blue[600],
          "&:hover": {
            backgroundColor: blue[800],
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
          // Needed to make popper clickable over the the navigation bar
          zIndex: 1,
          minWidth: "8.75rem",
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
