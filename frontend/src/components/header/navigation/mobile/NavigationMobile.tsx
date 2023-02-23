import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Drawer, Grid, IconButton, List, Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOutButton } from "@app/components/header/LogOutButton";
import { OperatorCard } from "@app/components/header/OperatorCard";
import { getTabs, TAB_DEFAULT_COLOR } from "../common";
import { NavigationMobileTab } from "./NavigationMobileTab";

export const NavigationMobile = () => {
  const navigate = useNavigate();
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
              color: ({ palette }) => palette.primary.contrastText,
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
            bgcolor: TAB_DEFAULT_COLOR,
          },
        }}
      >
        <Box
          role="menu"
          onKeyDown={toggleDrawer(false)}
          sx={{ maxWidth: "20rem" }}
        >
          <Box sx={{ bgcolor: ({ palette }) => palette.primary.main }}>
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
            {getTabs(navigate).map((tab) => (
              <NavigationMobileTab
                key={tab.urlPrefix}
                {...tab}
              />
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
