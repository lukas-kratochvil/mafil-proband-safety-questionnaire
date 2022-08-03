import { ILinkTabProps } from "../components/navigation/Navigation";

export const tabs: ILinkTabProps[] = [
  {
    // TODO: number must be updated
    label: "Čekárna (2)",
    link: "/auth/waiting-room",
  },
  {
    label: "Poslední visity",
    link: "/auth/recent-visits",
  },
];
