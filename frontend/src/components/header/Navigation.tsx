import { Box, Tabs } from "@mui/material";
import { amber } from "@mui/material/colors";
import React, { useState } from "react";
import { INavigationItem } from "./Header";
import { NavigationTab } from "./NavigationTab";

interface INavigationProps {
  items: INavigationItem[];
}

export const Navigation = ({ items }: INavigationProps) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const handleChange = (_event: React.SyntheticEvent, value: number) => setCurrentTabIndex(value);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: amber[700],
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
        {items.map((item, index) => (
          <NavigationTab
            key={index}
            tab={item}
          />
        ))}
      </Tabs>
    </Box>
  );
};
