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
          role="menu"
          onKeyDown={toggleDrawer(false)}
          sx={{
            minWidth: "15rem",
            height: "100%",
            backgroundColor: "#ffab40",
          }}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
            rowGap="1rem"
            sx={{
              paddingX: "1rem",
              paddingTop: "2.5rem",
              paddingBottom: "1rem",
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <OperatorCard />
            <LogOutButton />
          </Grid>
          <List
            onClick={toggleDrawer(false)}
            sx={{
              paddingTop: "1rem",
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            {items.map((item, index) => (
              <ListItem
                key={index}
                disablePadding
              >
                <ListItemButton
                  onClick={item.onClick}
                  sx={{
                    paddingY: "1rem",
                    color: "rgba(0, 0, 0, 1)",
                    opacity: 0.85,
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    letterSpacing: "0.02857rem",
                    textTransform: "uppercase",
                    "&:hover": {
                      backgroundColor: "#ffb74d",
                      opacity: 1,
                    },
                  }}
                >
                  {item.label}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>
    </>
  );
};
