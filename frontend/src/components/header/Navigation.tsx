import { Box, Tab, Tabs, useTheme } from "@mui/material";
import React, { useState } from "react";
import { INavigationItem } from "./Header";

interface ILinkTabProps {
  tab: INavigationItem;
}

const LinkTab = ({ tab }: ILinkTabProps) => {
  const theme = useTheme();

  return (
    <Tab
      label={tab.label}
      onClick={tab.onClick}
      sx={{
        color: theme.palette.text.primary,
        opacity: 0.85,
        "&:hover": {
          backgroundColor: "#ffb74d",
          opacity: 1,
        },
      }}
    />
  );
};

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
          <LinkTab
            key={index}
            tab={item}
          />
        ))}
      </Tabs>
    </Box>
  );
};
