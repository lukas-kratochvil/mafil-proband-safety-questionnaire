import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface ILinkTabProps {
  label: string;
  onClick: () => void;
}

const LinkTab = ({ label, onClick }: ILinkTabProps) => (
  <Tab
    component="a"
    label={label}
    onClick={onClick}
    sx={{
      height: "3rem",
      borderRight: 1,
      borderColor: "black",
      "&:hover": {
        backgroundColor: "#ffc04d",
      },
    }}
  />
);

export const Navigation = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<number>(0);

  const tabs: ILinkTabProps[] = [
    {
      // TODO: number must be updated
      label: "Čekárna (2)",
      onClick: () => navigate("/auth/waiting-room"),
    },
    {
      label: "Poslední visity",
      onClick: () => navigate("/auth/recent-visits"),
    },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#ffab40",
        borderTop: 1,
        borderBottom: 1,
      }}
    >
      <Tabs
        value={value}
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
