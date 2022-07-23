import LanguageIcon from "@mui/icons-material/Language";
import { Avatar, Button, IconButton, Menu, Tooltip } from "@mui/material";
import { FlagComponent } from "country-flag-icons/react/3x2";
import { useState } from "react";
import { languages } from "./data"

interface ILanguageItemProps {
  name: string;
  label: string;
  Flag: FlagComponent;
}

const LanguageItem = ({
  name,
  label,
  Flag,
}: ILanguageItemProps) => {
  return (
    <Tooltip title={name}>
      <Button size="small">
        <Avatar
          alt={label}
          variant="rounded"
          sx={{
            width: 30,
            height: 25,
            backgroundColor: "inherit"
          }}
        >
          <Flag />
        </Avatar>
      </Button>
    </Tooltip>
  );
};

export const LanguageMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Choose language">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={isOpen ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={isOpen ? 'true' : undefined}
        >
          <LanguageIcon
            style={{
              color: 'white',
              width: 30,
              height: 30
            }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="language-menu"
        aria-labelledby="language-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            backgroundColor: 'pink',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 15,
              width: 10,
              height: 10,
              bgcolor: 'pink',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom'
        }}
      >
        {languages.map((language, index) => <LanguageItem key={index} {...language} />)}
      </Menu>
    </>
  );
}
