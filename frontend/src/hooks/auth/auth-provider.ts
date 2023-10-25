import { useState } from "react";
import { IAuth, Operator } from "./AuthProvider";
import { AuthService } from "./auth-service";

export const useAuthProvider = (): IAuth => {
  const authService = AuthService.getInstance();
  const [operator, setOperator] = useState<Operator>();

  // Initiate the sign-in process
  const logIn = async (): Promise<void> => authService.signIn();

  // Complete the sign-in process
  const logInCallback = async (): Promise<boolean> => {
    const validOperator = await authService.completeSignIn();
    if (validOperator) {
      setOperator(validOperator);
      return true;
    }

    return false;
  };

  // Initiate the sign-out process
  const logOut = async (): Promise<void> => authService.signOut();

  // Complete the sign-out process
  const logOutCallback = async (): Promise<void> => {
    await authService.completeSignOut();
    setOperator(undefined);
  };

  return { logIn, logInCallback, logOut, logOutCallback, operator };
};
