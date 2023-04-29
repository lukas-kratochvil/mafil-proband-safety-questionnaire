import { UserManager, UserManagerSettings } from "oidc-client-ts";
import { RoutingPath } from "@app/routing-paths";
import { authenticateOperator } from "@app/util/server_API/calls";
import { IOperatorDTO } from "@app/util/server_API/dto";

const config: UserManagerSettings = {
  authority: "https://oidc.muni.cz/oidc/",
  client_id: import.meta.env.VITE_JPM_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_JPM_REDIRECT_URI,
  scope: import.meta.env.VITE_JPM_SCOPES,
  post_logout_redirect_uri: `${window.location.origin}${RoutingPath.LOGIN}`,
};

const userManager = new UserManager(config);

export const signIn = (): Promise<void> => userManager.signinRedirect();

export const signOut = (): Promise<void> => userManager.signoutRedirect();

export const completeSignIn = async (): Promise<IOperatorDTO | null> => {
  try {
    // TODO: specify optional URL or leave it undefined?
    const jpmUser = await userManager.signinRedirectCallback(RoutingPath.WAITING_ROOM);
    // Check that the user is registered in our app and should have access to the authenticated part of the app
    return await authenticateOperator({
      name: jpmUser.profile.given_name ?? "",
      surname: jpmUser.profile.family_name ?? "",
      email: jpmUser.profile.email ?? "",
      uco: jpmUser.profile.preferred_username ?? "",
    });
  } catch {
    await signOut();
    return null;
  }
};

export const completeSignOut = async (): Promise<void> => {
  await userManager.signoutRedirectCallback();
};
