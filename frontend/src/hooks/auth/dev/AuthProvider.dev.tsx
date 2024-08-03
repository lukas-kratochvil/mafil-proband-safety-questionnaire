import type { PropsWithChildren } from "react";
import { authContext } from "../auth";
import { useAuthProviderDev } from "./auth-provider.dev";

const AuthProviderDev = ({ children }: PropsWithChildren) => (
  <authContext.Provider value={useAuthProviderDev()}>{children}</authContext.Provider>
);

export default AuthProviderDev;
