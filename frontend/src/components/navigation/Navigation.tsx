import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { tabs } from "../../data/navigation_data";

export interface ILinkTabProps {
  label: string;
  href: string;
}

const LinkTab = (props: ILinkTabProps) => (
  <Tab
    component="a"
    {...props}
    sx={{
      borderRight: 1,
      borderColor: "black",
      "&:hover": {
        backgroundColor: "#ffc04d",
      },
    }}
  />
);

export const Navigation = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "orange",
        borderTop: 1,
        borderBottom: 1,
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="top-menu navigation"
        TabIndicatorProps={{
          style: {
            display: "none",
          },
        }}
      >
        {tabs.map((tab, index) => (
          <LinkTab
            key={index}
            {...tab}
          />
        ))}
      </Tabs>
    </Box>
  );
};
