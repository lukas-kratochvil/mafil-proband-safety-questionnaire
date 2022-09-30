import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  SwipeableDrawer,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { LogOutButton } from "./LogOutButton";
import { INavigationItem } from "./Navigation";
import { OperatorCard } from "./OperatorCard";

interface INavigationMobileProps {
  items: INavigationItem[];
}

export const NavigationMobile = ({ items }: INavigationMobileProps) => {
  const theme = useTheme();
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
            alignItems="center"
            rowGap={2}
            sx={{
              paddingX: "1rem",
              paddingTop: "2.5rem",
              paddingBottom: "1rem",
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <OperatorCard />
            <LogOutButton />
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
