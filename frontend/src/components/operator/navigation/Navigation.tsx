import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

interface ILinkTabProps {
  label: string;
  href: string;
}

const LinkTab = (props: ILinkTabProps) => {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => event.preventDefault()}
      {...props}
      sx={{
        borderRight: 1,
        borderColor: 'black'
      }}
    />
  );
}

const tabs: ILinkTabProps[] = [
  {
    // TODO: number must be updated
    label: "Čekárna (2)",
    href: "/waiting-room",
  },
  {
    // TODO: number must be updated
    label: "Formuláře ke kontrole (1)",
    href: "/forms-to-check",
  },
  {
    label: "Poslední visity",
    href: "/recent-visits",
  },
];

export const Navigation = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => setValue(newValue);;

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'orange',
        borderTop: 1,
        borderBottom: 1,
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="top-menu navigation"
      >
        {tabs.map((tab, index) => <LinkTab key={index} {...tab} />)}
      </Tabs>
    </Box>
  );
};
