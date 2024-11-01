import { useState } from "react";
import { logAction } from "@app/util/mafildb_API/calls";
import type { Auth } from "./auth";
import { AuthService } from "./auth-service";

export const useAuthProvider = (): Auth => {
  const authService = AuthService.getInstance();
  const [operator, setOperator] = useState<Auth["operator"]>();

  // Initiate the sign-in process - user authenticates himself in the OIDC provider side
  const logIn = async (): Promise<void> => authService.signIn();

  // Complete the sign-in process - process the response after successful OIDC authentication
  const logInCallback = async (): Promise<boolean> => {
    const validOperator = await authService.completeSignIn();
    if (validOperator) {
      void logAction(
        "info",
        "Login",
        `Operator '${validOperator.name} ${validOperator.surname}' has logged in.`,
        validOperator.username
      );
      setOperator(validOperator);
      return true;
    }

    void logAction("warning", "Login", "Operator has failed to log in.");
    return false;
  };

  // Initiate the sign-out process - user is signed out in the OIDC provider side
  const logOut = async (): Promise<void> => authService.signOut();

  // Complete the sign-out process - process the response after successful OIDC sign out
  const logOutCallback = async (): Promise<void> => {
    await authService.completeSignOut();
    void logAction(
      "info",
      "Logout",
      `Operator '${operator?.name} ${operator?.surname}' has logged out.`,
      operator?.username
    );
    setOperator(undefined);
  };

  const clearAuth = async (): Promise<void> => {
    await authService.clearAuthData();
    setOperator(undefined);
  };

  return { logIn, logInCallback, logOut, logOutCallback, operator, clearAuth };
};
