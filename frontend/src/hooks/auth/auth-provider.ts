import { useState } from "react";
import { IAuth, Operator } from "./AuthProvider";
import { AuthService } from "./auth-service";

export const useAuthProvider = (): IAuth => {
  const authService = AuthService.getInstance();
  const [operator, setOperator] = useState<Operator>();

  // Initiate the sign-in process - user authenticates himself in the OIDC provider side
  const logIn = async (): Promise<void> => authService.signIn();

  // Complete the sign-in process - process the response after successful OIDC authentication
  const logInCallback = async (): Promise<boolean> => {
    const validOperator = await authService.completeSignIn();
    if (validOperator) {
      setOperator(validOperator);
      return true;
    }

    return false;
  };

  // Initiate the sign-out process - user is signed out in the OIDC provider side
  const logOut = async (): Promise<void> => authService.signOut();

  // Complete the sign-out process - process the response after successful OIDC sign out
  const logOutCallback = async (): Promise<void> => {
    await authService.completeSignOut();
    setOperator(undefined);
  };

  return { logIn, logInCallback, logOut, logOutCallback, operator };
};
