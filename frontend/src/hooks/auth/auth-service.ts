import { UserManager, type User, type UserManagerSettings } from "oidc-client-ts";
import { getConfig } from "@app/config/config";
import { authenticateOperator } from "@app/util/server_API/calls";
import type { OperatorDTO } from "@app/util/server_API/dto";

// This option will revoke the access and the refresh token to avoid accessing secured APIs using these tokens
const revokeTokenTypes = ["access_token", "refresh_token"] as const satisfies Required<
  UserManagerSettings["revokeTokenTypes"]
>;

// Using OIDC Authorization Code Flow
// Using "Jednotné přihlášení MUNI" OIDC provider
const oidcConfig: UserManagerSettings = {
  authority: getConfig().oidc.jpm.authorizationEndpoint,
  client_id: getConfig().oidc.jpm.clientId,
  redirect_uri: getConfig().oidc.jpm.redirectUri,
  scope: getConfig().oidc.jpm.scopes,
  /**
   * Multi-factor authentication - URL of the second factor authentication provider.
   *
   * This web app requires MFA on every user login, but the OIDC provider "Jednotné přihlášení MUNI" provides the MFA
   * attribute in the HTTP request header only once per some period of time because it remembers that the user had
   * logged in using MFA a moment ago so the user does not need to undergo the second factor authentication on every
   * login. Because of that we have to trust the OIDC provider that it manages the MFA correctly!
   */
  acr_values: getConfig().oidc.jpm.mfaEndpoint,
  post_logout_redirect_uri: getConfig().oidc.jpm.postLogoutRedirectUri,
  automaticSilentRenew: true,
  // Revoke access token and refresh token on signout to avoid accessing secured APIs using these tokens
  revokeTokensOnSignout: true,
  revokeTokenTypes,
};

export class AuthService {
  static #instance: AuthService;

  readonly #userManager = new UserManager(oidcConfig);

  /* eslint-disable-next-line no-useless-constructor, no-empty-function */
  private constructor() {}

  public static getInstance(): AuthService {
    if (!this.#instance) {
      this.#instance = new AuthService();
    }
    return this.#instance;
  }

  public async signIn(): Promise<void> {
    return this.#userManager.signinRedirect();
  }

  public async completeSignIn(): Promise<OperatorDTO | null> {
    await this.#userManager.signinCallback();
    // OIDC access token is added by the Axios request interceptor to the original server API request
    return authenticateOperator();
  }

  public async signOut(): Promise<void> {
    return this.#userManager.signoutRedirect();
  }

  public async completeSignOut(): Promise<void> {
    await this.#userManager.signoutRedirectCallback();
  }

  public async getAuthUser(): Promise<User | null> {
    return this.#userManager.getUser();
  }

  public async clearAuthData(): Promise<void> {
    await this.#userManager.removeUser();
    return this.#userManager.revokeTokens(revokeTokenTypes);
  }
}
