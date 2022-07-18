import LanguageIcon from "@mui/icons-material/Language";
import { AppBar, IconButton, Link, Menu, MenuItem, Stack, Toolbar, Tooltip } from "@mui/material";
import { useState } from "react";

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width={"100%"}
        >
          <Link
            href="https://mafil.ceitec.cz/"
            rel="noopener noreferrer"
            sx={{ lineHeight: "0px" }}
          >
            <img
              src="/logo_mafil.png"
              alt="CEITEC-MAFIL logo"
              height={40}
            />
          </Link>
          <Tooltip title="Choose language">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={isOpen ? 'language-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isOpen ? 'true' : undefined}
            >
              <LanguageIcon style={{ color: 'white' }} />
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
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 12,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* TODO: <MenuItem onClick={handleTranslation}> CZ national flag… </MenuItem> */}
            <MenuItem>CZ</MenuItem>
            <MenuItem>SK</MenuItem>
            <MenuItem>EN</MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
