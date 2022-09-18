import { Box, Tab, Tabs, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyFantomVisitNew } from "../../data/visit_data";

interface ILinkTabProps {
  label: string;
  onClick: () => void;
}

const LinkTab = ({ label, onClick }: ILinkTabProps) => {
  const theme = useTheme();

  return (
    <Tab
      label={label}
      onClick={onClick}
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

export const Navigation = () => {
  const navigate = useNavigate();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, value: number) => setCurrentTabIndex(value);

  const tabs: ILinkTabProps[] = [
    {
      // TODO: number must be updated
      label: "Čekárna (2)",
      onClick: () => navigate("/auth/waiting-room"),
    },
    {
      label: "Založit měření na Fantomu",
      onClick: () => {
        // TODO: create new FANTOM visit and use its ID
        const newFantomVisitId = dummyFantomVisitNew.id;
        navigate(`/auth/form/${newFantomVisitId}`);
      },
    },
    {
      label: "Otevřít formulář probanda",
      onClick: () => window.open("/", "_blank", "noopener,noreferrer"),
    },
    {
      label: "Poslední visity",
      onClick: () => navigate("/auth/recent-visits"),
    },
  ];

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
