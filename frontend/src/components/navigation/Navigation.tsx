import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tabs } from "../../data/navigation_data";

export interface ILinkTabProps {
  label: string;
  link: string;
}

const LinkTab = ({ label, link }: ILinkTabProps) => {
  const navigate = useNavigate();

  const handleOnClickTab = () => navigate(link);

  return (
    <Tab
      component="a"
      label={label}
      onClick={handleOnClickTab}
      sx={{
        borderRight: 1,
        borderColor: "black",
        "&:hover": {
          backgroundColor: "#ffc04d",
        },
      }}
    />
  );
};

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
