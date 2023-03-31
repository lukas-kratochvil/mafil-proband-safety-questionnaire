import { PropsWithChildren } from "react";
import { authContextDev, useAuthProviderDev } from "./auth-dev";

export const AuthProviderDev = ({ children }: PropsWithChildren) => {
  const auth = useAuthProviderDev();
  return <authContextDev.Provider value={auth}>{children}</authContextDev.Provider>;
};
