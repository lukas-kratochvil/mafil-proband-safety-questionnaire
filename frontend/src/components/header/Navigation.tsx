import { Box, Tabs } from "@mui/material";
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
        backgroundColor: "#ffab40",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Tabs
        value={currentTabIndex}
        onChange={handleChange}
        aria-label="top-menu navigation"
        sx={{
          minHeight: "3rem",
          "& .MuiTabs-flexContainer": {
            // This will create multiple rows depending on the items count and lenght
            flexWrap: "wrap",
            height: "100%",
          },
        }}
        // This will be 1 row with arrows to scroll
        // variant="scrollable"
        // scrollButtons="auto"
        TabIndicatorProps={{
          style: {
            display: "none",
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
