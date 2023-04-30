import { useState } from "react";
import { IAuth, Operator } from "./AuthProvider";
import { AuthService } from "./auth-service";

export const useAuthProvider = (): IAuth => {
  const [operator, setOperator] = useState<Operator>();

  const logIn = async (): Promise<void> => {
    const authService = AuthService.getInstance();
    // Initiate the sign-in process
    await authService.signIn();
    // Complete the sign-in process
    const validOperator = await authService.completeSignIn();

    if (validOperator) {
      setOperator(validOperator);
      return;
    }

    setOperator(undefined);
  };

  const logOut = async (): Promise<void> => {
    const authService = AuthService.getInstance();
    // Initiate the sign-out process
    await authService.signOut();
    // Complete the sign-out process
    await authService.completeSignOut();
    setOperator(undefined);
  };

  return { logIn, logOut, operator };
};
