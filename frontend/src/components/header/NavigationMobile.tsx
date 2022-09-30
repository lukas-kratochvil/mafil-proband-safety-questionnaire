import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Card,
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
    if (event && event.type === "keydown" && ["Tab", "Shift"].includes((event as React.KeyboardEvent).key)) {
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
      <SwipeableDrawer
        anchor="left"
        // TODO: some low-end mobile devices won't be able to follow the fingers at 60 FPS - 'disableBackdropTransition' parameter may be used
        // disableBackdropTransition
        open={isDrawerOpened}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ minWidth: "15rem" }}
          role="menu"
          onKeyDown={toggleDrawer(false)}
        >
          <Grid
            container
            direction="column"
            rowGap={2}
            sx={{
              paddingX: "1rem",
              paddingTop: "2.5rem",
              paddingBottom: "1rem",
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <Card
              sx={{
                bgcolor: theme.palette.primary.contrastText,
                maxWidth: "15rem",
                marginLeft: "0.5rem",
                marginRight: "1rem",
                paddingX: "0.75rem",
                paddingY: "0.5rem",
                display: "inline-flex",
                columnGap: "0.5rem",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <AccountCircleIcon />
              <Typography noWrap>{username}</Typography>
            </Card>
            <Container sx={{ width: "fit-content" }}>
              <LogOutButton />
            </Container>
          </Grid>
          <List onClick={toggleDrawer(false)}>
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
    </>
  );
};
