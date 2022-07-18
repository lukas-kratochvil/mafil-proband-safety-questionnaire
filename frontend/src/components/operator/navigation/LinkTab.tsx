import { Tab } from "@mui/material";

export interface ILinkTabProps {
  label: string;
  href: string;
}

export const LinkTab = (props: ILinkTabProps) => {
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
