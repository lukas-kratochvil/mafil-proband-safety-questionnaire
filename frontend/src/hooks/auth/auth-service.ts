import { User, UserManager, UserManagerSettings } from "oidc-client-ts";
import { RoutingPath } from "@app/routing-paths";
import { authenticateOperator } from "@app/util/server_API/calls";
import { IOperatorDTO } from "@app/util/server_API/dto";

// Multi-factor authentication - URL of the second factor authentication provider
const MFA_URL = "https://refeds.org/profile/mfa";

const config: UserManagerSettings = {
  authority: "https://oidc.muni.cz/oidc",
  client_id: import.meta.env.VITE_JPM_CLIENT_ID,
  redirect_uri: `${window.location.origin}${RoutingPath.OIDC_LOGIN}`,
  scope: "openid profile email eduperson_entitlement",
  acr_values: MFA_URL,
  post_logout_redirect_uri: `${window.location.origin}${RoutingPath.LOGOUT}`,
};

export class AuthService {
  private static instance: AuthService;

  private userManager = new UserManager(config);

  /* eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function */
  private constructor() {}

  public static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  public async signIn(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public async completeSignIn(): Promise<IOperatorDTO | null> {
    try {
      const jpmUser = await this.userManager.signinRedirectCallback();

      // Check that the user used MFA to authenticate
      // TODO: uncomment and use MFA
      // if (jpmUser.profile.acr !== MFA_URL) {
      //   return null;
      // }

      // Check that the user is registered in our app and should have access to the authenticated part of the app
      return await authenticateOperator({
        name: jpmUser.profile.given_name ?? "",
        surname: jpmUser.profile.family_name ?? "",
        email: jpmUser.profile.email ?? "",
        uco: jpmUser.profile.preferred_username ?? "",
      });
    } catch (error) {
      // TODO: delete logging to the console
      console.log(error);
      await this.signOut();
      return null;
    }
  }

  public async signOut(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  public async completeSignOut(): Promise<void> {
    const response = await this.userManager.signoutRedirectCallback();
    // TODO: delete logging to the console
    console.log("Sign out response:");
    console.log(response);
  }

  public async getAuthUser(): Promise<User | null> {
    return this.userManager.getUser();
  }
}
