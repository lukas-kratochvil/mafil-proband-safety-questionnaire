import { ILinkTabProps } from "../components/operator/navigation/Navigation";

export const tabs: ILinkTabProps[] = [
  {
    // TODO: number must be updated
    label: "Čekárna (2)",
    href: "/auth/waiting-room",
  },
  {
    label: "Poslední visity",
    href: "/auth/recent-visits",
  },
];
