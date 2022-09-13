import LanguageIcon from "@mui/icons-material/Language";
import { Avatar, Button, IconButton, Menu, Tooltip } from "@mui/material";
import { FlagComponent } from "country-flag-icons/react/3x2";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { languages } from "../../data/header_data";

const paperBgColor = "#fac8c8";
const langHoverBgColor = "#e8b5b5";

export interface ILanguageItemProps {
  name: string;
  label: string;
  Flag: FlagComponent;
}

const LanguageItem = ({ name, label, Flag }: ILanguageItemProps) => (
  <Tooltip title={name}>
    <Button
      size="small"
      onClick={() => alert("Funkcionalita bude brzy naimplementována.")}
      sx={{
        "&:hover": {
          backgroundColor: langHoverBgColor,
        },
      }}
    >
      <Avatar
        alt={label}
        variant="rounded"
        sx={{
          width: "2rem",
          height: "1.5rem",
          backgroundColor: "inherit",
        }}
      >
        <Flag />
      </Avatar>
    </Button>
  </Tooltip>
);

export const LanguageMenu = () => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: "language-menu",
    disableAutoFocus: true,
  });

  return (
    <>
      <Tooltip title="Choose language">
        <IconButton
          size="small"
          {...bindTrigger(popupState)}
        >
          <LanguageIcon
            style={{
              color: "white",
              width: "2rem",
              height: "2rem",
            }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        disableScrollLock
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0 0.25rem 0.5rem rgba(0, 0, 0, 0.32))",
            mt: 1.5,
            backgroundColor: paperBgColor,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: "1rem",
              width: "0.65rem",
              height: "0.65rem",
              bgcolor: paperBgColor,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        sx={{
          position: "absolute",
        }}
        {...bindMenu(popupState)}
      >
        {languages.map((language, index) => (
          <LanguageItem
            key={index}
            {...language}
          />
        ))}
      </Menu>
    </>
  );
};
