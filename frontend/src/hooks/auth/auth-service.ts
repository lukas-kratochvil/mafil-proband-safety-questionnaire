import { User, UserManager, UserManagerSettings } from "oidc-client-ts";
import { RoutingPath } from "@app/routing-paths";
import { LocalizedError } from "@app/util/error-handling/LocalizedError";
import { authenticateOperator } from "@app/util/server_API/calls";
import { IOperatorDTO } from "@app/util/server_API/dto";

// Multi-factor authentication - URL of the second factor authentication provider
const MFA_URL = "https://refeds.org/profile/mfa";

// Using OIDC Authorization Code Flow
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
    const user = await this.userManager.signinRedirectCallback();

    // Check the presence of required OIDC claims
    if (
      user.profile.given_name === undefined
      || user.profile.family_name === undefined
      || user.profile.email === undefined
      || user.profile.preferred_username === undefined
    ) {
      throw new LocalizedError("missingOidcClaims");
    }

    /**
     * TODO: allow MFA
     *
     * Note: Disallowed due to the auth problem. This web app requires MFA on every user login, but the OIDC
     *       provider Jednotné přihlášení MUNI provides the MFA only once per some period of time and remember that so
     *       that the user does not need to undergo the second factor authentication on every login. So we cannot
     *       check the MFA, because it is not provided on every user login and so the acr value is not provided in the
     *       request header.
     */
    // Check that the user used MFA to authenticate
    // if (user.profile.acr !== MFA_URL) {
    //   throw new LocalizedError("missingMFA");
    // }

    // Check that the user is registered in our app and should have access to the authenticated part of the app
    return authenticateOperator({
      name: user.profile.given_name,
      surname: user.profile.family_name,
      email: user.profile.email,
      uco: user.profile.preferred_username,
    });
  }

  public async signOut(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  public async completeSignOut(): Promise<void> {
    await this.userManager.signoutRedirectCallback();
  }

  public async getAuthUser(): Promise<User | null> {
    return this.userManager.getUser();
  }
}
