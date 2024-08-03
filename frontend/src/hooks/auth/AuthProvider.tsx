import type { PropsWithChildren } from "react";
import { authContext } from "./auth";
import { useAuthProvider } from "./auth-provider";

const AuthProvider = ({ children }: PropsWithChildren) => (
  <authContext.Provider value={useAuthProvider()}>{children}</authContext.Provider>
);

export default AuthProvider;
