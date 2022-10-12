import { NavigateFunction } from "react-router-dom";

export const getBackButtonProps = (navigate: NavigateFunction, title?: string) => ({
  title: title ?? "Zpět",
  onClick: () => navigate(-1),
});
