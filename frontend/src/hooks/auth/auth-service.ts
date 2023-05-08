import { User, UserManager, UserManagerSettings } from "oidc-client-ts";
import { RoutingPath } from "@app/routing-paths";
import { authenticateOperator } from "@app/util/server_API/calls";
import { IOperatorDTO } from "@app/util/server_API/dto";

const config: UserManagerSettings = {
  authority: "https://oidc.muni.cz/oidc",
  client_id: "client_id", // TODO: add MUNI OIDC client ID
  redirect_uri: `${window.location.origin}${RoutingPath.WAITING_ROOM}`,
  scope: "openid profile email eduperson_entitlement",
  post_logout_redirect_uri: `${window.location.origin}${RoutingPath.LOGIN}`,
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

  public async signOut(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  public async completeSignIn(): Promise<IOperatorDTO | null> {
    try {
      // TODO: specify optional URL or leave it undefined?
      const jpmUser = await this.userManager.signinRedirectCallback(RoutingPath.WAITING_ROOM);
      // Check that the user is registered in our app and should have access to the authenticated part of the app
      return await authenticateOperator({
        name: jpmUser.profile.given_name ?? "",
        surname: jpmUser.profile.family_name ?? "",
        email: jpmUser.profile.email ?? "",
        uco: jpmUser.profile.preferred_username ?? "",
      });
    } catch {
      await this.signOut();
      return null;
    }
  }

  public async completeSignOut(): Promise<void> {
    await this.userManager.signoutRedirectCallback();
  }

  public async getAuthUser(): Promise<User | null> {
    return this.userManager.getUser();
  }
}
