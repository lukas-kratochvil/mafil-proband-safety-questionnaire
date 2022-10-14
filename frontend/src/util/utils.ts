import { NavigateFunction } from "react-router-dom";

export type Override<T, U> = Omit<T, keyof U> & U;

export const getBackButtonProps = (navigate: NavigateFunction, title?: string) => ({
  title: title ?? "Zpět",
  onClick: () => navigate(-1),
});
