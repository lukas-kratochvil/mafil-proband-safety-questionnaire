import { NavigateFunction } from "react-router-dom";

export const getBackButtonProps = (navigate: NavigateFunction) => ({
  title: "Zpět",
  onClick: () => navigate(-1),
});
