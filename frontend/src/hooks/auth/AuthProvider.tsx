import { PropsWithChildren } from "react";
import { authContext, useAuthProvider } from "./auth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
