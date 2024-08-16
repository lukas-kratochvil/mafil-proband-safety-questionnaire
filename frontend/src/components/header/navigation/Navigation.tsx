import { Box, Tabs } from "@mui/material";
import React, { useState } from "react";
import { NavigationTab } from "./NavigationTab";
import { getTabs, TAB_DEFAULT_COLOR } from "./tabs";

const Navigation = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const handleChange = (_event: React.SyntheticEvent, value: number) => setCurrentTabIndex(value);

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: TAB_DEFAULT_COLOR,
      }}
    >
      <Tabs
        value={currentTabIndex}
        onChange={handleChange}
        aria-label="top-menu navigation"
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{
          style: {
            // Hide tab underline
            display: "none",
          },
        }}
        sx={{
          minHeight: "3rem",
          "& .MuiTabs-flexContainer": {
            height: "100%",
          },
        }}
      >
        {getTabs().map((tab) => (
          <NavigationTab
            key={tab.urlPath}
            {...tab}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default Navigation;
