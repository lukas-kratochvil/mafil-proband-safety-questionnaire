import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  SwipeableDrawer,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../hooks/auth/Auth";
import { LogOutButton } from "./LogOutButton";
import { INavigationItem } from "./Navigation";

interface INavigationMobileProps {
  items: INavigationItem[];
}

export const NavigationMobile = ({ items }: INavigationMobileProps) => {
  const theme = useTheme();
  const { username } = useAuth();

  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown"
      && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setIsDrawerOpened(open);
  };

  return (
    <>
      <Tooltip title="Menu">
        <IconButton
          size="small"
          onClick={toggleDrawer(true)}
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
      {/* <Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={isDrawerOpened}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="menu"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box
            sx={{
              paddingX: "1rem",
              paddingY: "1.5rem",
              backgroundColor: theme.palette.primary.light,
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
              <LogOutButton />
            </Container>
          </Box>
          <List>
            {items.map((item, index) => (
              <ListItem
                key={index}
                disablePadding
              >
                <ListItemButton onClick={item.onClick}>{item.label}</ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>
      {/* </Drawer> */}
    </>
  );
};
