import { UserManager, type User, type UserManagerSettings } from "oidc-client-ts";
import { RoutingPath } from "@app/routing-paths";
import { LocalizedError } from "@app/util/error-handling/LocalizedError";
import { authenticateOperator } from "@app/util/server_API/calls";
import type { OperatorDTO } from "@app/util/server_API/dto";
import config from "config.json";

// Using OIDC Authorization Code Flow
const oidcConfig: UserManagerSettings = {
  // Using "Jednotné přihlášení MUNI" OIDC provider
  authority: "https://oidc.muni.cz/oidc",
  client_id: config.JPM_CLIENT_ID,
  redirect_uri: `${window.location.origin}${RoutingPath.OIDC_LOGIN}`,
  scope: "openid profile email eduperson_entitlement",
  /**
   * Multi-factor authentication - URL of the second factor authentication provider.
   *
   * This web app requires MFA on every user login, but the OIDC provider "Jednotné přihlášení MUNI" provides the MFA
   * attribute in the HTTP request header only once per some period of time because it remembers that the user had
   * logged in using MFA a moment ago so the user does not need to undergo the second factor authentication on every
   * login. Because of that we have to trust the OIDC provider that it manages the MFA correctly!
   */
  acr_values: "https://refeds.org/profile/mfa",
  post_logout_redirect_uri: `${window.location.origin}${RoutingPath.LOGOUT}`,
};

export class AuthService {
  private static instance: AuthService;

  private userManager = new UserManager(oidcConfig);

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

  public async completeSignIn(): Promise<OperatorDTO | null> {
    const user = await this.userManager.signinRedirectCallback();

    // Check the presence of required OIDC claims
    if (
      user.profile.given_name === undefined
      || user.profile.family_name === undefined
      || user.profile.email === undefined
      || user.profile.sub === undefined
    ) {
      throw new LocalizedError("missingOidcClaims");
    }

    // Check that the user is registered in our app and should have access to the authenticated part of the app
    return authenticateOperator({
      name: user.profile.given_name,
      surname: user.profile.family_name,
      email: user.profile.email,
      username: user.profile.sub,
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
