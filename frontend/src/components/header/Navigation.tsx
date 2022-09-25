import { Box, Tab, Tabs, useTheme } from "@mui/material";
import React, { useState } from "react";

export interface INavigationItem {
  label: string;
  onClick: () => void;
}

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
          height: "3rem",
        }}
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
