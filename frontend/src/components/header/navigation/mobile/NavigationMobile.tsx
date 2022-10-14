import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Drawer, Grid, IconButton, List, Tooltip, useTheme } from "@mui/material";
import { amber } from "@mui/material/colors";
import { useState } from "react";
import { INavigationItem } from "../../Header";
import { LogOutButton } from "../../LogOutButton";
import { OperatorCard } from "../../OperatorCard";
import { NavigationMobileTab } from "./NavigationMobileTab";

interface INavigationMobileProps {
  items: INavigationItem[];
}

export const NavigationMobile = ({ items }: INavigationMobileProps) => {
  const theme = useTheme();
  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && ["Tab", "Shift"].includes((event as React.KeyboardEvent).key)) {
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
            sx={{
              color: theme.palette.primary.contrastText,
              width: "2rem",
              height: "2rem",
            }}
          />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="left"
        open={isDrawerOpened}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: amber[700],
          },
        }}
      >
        <Box
          role="menu"
          onKeyDown={toggleDrawer(false)}
          sx={{ maxWidth: "20rem" }}
        >
          <Box sx={{ backgroundColor: theme.palette.primary.main }}>
            <Box
              display="flex"
              justifyContent="flex-end"
            >
              <IconButton
                onClick={toggleDrawer(false)}
                sx={{ alignSelf: "flex-end" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Grid
              container
              direction="column"
              alignItems="center"
              rowGap="1rem"
              sx={{ padding: "1rem" }}
            >
              <OperatorCard />
              <LogOutButton />
            </Grid>
          </Box>
          <List
            onClick={toggleDrawer(false)}
            sx={{
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            {items.map((item, index) => (
              <NavigationMobileTab
                key={index}
                tab={item}
              />
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
