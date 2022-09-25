import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Container, Grid, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme } from "@mui/material";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/Auth";
import { INavigationItem } from "./Navigation";

interface INavigationMobileProps {
  items: INavigationItem[];
}

export const NavigationMobile = ({ items }: INavigationMobileProps) => {
  const theme = useTheme();
  const { username, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  const popupState = usePopupState({
    variant: "popover",
    popupId: "menu",
    disableAutoFocus: true,
  });

  return (
    <>
      <Tooltip title="Menu">
        <IconButton
          {...bindTrigger(popupState)}
          size="small"
        >
          <MenuIcon
            style={{
              color: theme.palette.primary.contrastText,
              width: "2rem",
              height: "2rem",
            }}
          />
        </IconButton>
      </Tooltip>
      <Menu {...bindMenu(popupState)}>
        <Box
          sx={{
            paddingX: "1rem",
            paddingY: "0.5rem",
            marginBottom: "0.5rem",
            backgroundColor: theme.palette.grey[300],
            borderTop: 1,
            borderBottom: 1,
          }}
        >
          <Grid
            container
            direction="row"
            columnGap="0.5rem"
            sx={{ marginBottom: "1rem" }}
          >
            <AccountCircleIcon />
            <Typography noWrap>{username}</Typography>
          </Grid>
          <Container sx={{ width: "fit-content" }}>
            <Button
              onClick={handleSignOut}
              sx={{
                bgcolor: theme.palette.common.black,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  bgcolor: theme.palette.common.black,
                  color: "pink",
                },
              }}
            >
              Odhlásit se
            </Button>
          </Container>
        </Box>
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={item.onClick}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
