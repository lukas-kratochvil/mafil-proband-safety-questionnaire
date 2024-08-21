import { createContext, useContext } from "react";
import type { OperatorDTO } from "@app/util/server_API/dto";

export type Auth = {
  logIn: () => Promise<void>;
  logInCallback: () => Promise<boolean>;
  logOut: () => Promise<void>;
  logOutCallback: () => Promise<void>;
  operator: OperatorDTO | undefined;
  clearAuth: () => Promise<void>;
};

// defaultValue argument is only used when a component does not have a matching Provider above it in the tree – helpful for testing components in isolation
export const authContext = createContext<Auth>(undefined as unknown as Auth);

export const useAuth = () => useContext(authContext);
