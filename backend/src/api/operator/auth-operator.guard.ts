import { ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";
import { EnvironmentVariables } from "@app/config/validation";
import { GraphQLGuard } from "../graphql.guard";
import { extractAccessToken } from "../utils/utils";

type UserInfoEndpointReturnType = {
  sub: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  zoneinfo?: string;
  email?: string;
  email_verified?: boolean;
  eduperson_entitlement?: ReadonlyArray<string>;
};

const buildOidcUserInfoEndpointFetch = (userInfoEndpoint: string) => {
  return (accessToken: string) =>
    fetch(userInfoEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json() as Promise<UserInfoEndpointReturnType>);
};

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class AuthOperatorGuard extends GraphQLGuard {
  readonly #callOidcUserInfo: ReturnType<typeof buildOidcUserInfoEndpointFetch>;
  readonly #allowedEdupersonEntitlements: string[];

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    super(AuthOperatorGuard.name);
    this.#callOidcUserInfo = buildOidcUserInfoEndpointFetch(config.get("oidc.jpm.userInfoEndpoint", { infer: true }));
    this.#allowedEdupersonEntitlements = config.get("oidc.jpm.allowedEdupersonEntitlements", { infer: true });
  }

  override async canActivate(exContext: ExecutionContext) {
    if (!(await super.canActivate(exContext))) {
      return false;
    }

    const gqlExContext = GqlExecutionContext.create(exContext);
    const gqlContext = gqlExContext.getContext();
    const request = gqlContext.req as Request;

    const accessToken = extractAccessToken(request);
    if (!accessToken) {
      this.logger.error(`Request from origin '${request.headers.origin}' does not contain OIDC access token!`);
      return false;
    }

    let data: UserInfoEndpointReturnType;

    try {
      data = await this.#callOidcUserInfo(accessToken);
    } catch (error) {
      this.logger.error(error);
      return false;
    }

    if (!data.eduperson_entitlement?.find((group) => this.#allowedEdupersonEntitlements.includes(group))) {
      this.logger.error(
        `Request from origin '${request.headers.origin}' does not contain any of the allowed 'eduperson_entitlement' values!`
      );
      return false;
    }

    if (!data.sub || !data.given_name || !data.family_name || !data.email) {
      this.logger.error(`Missing some of the required claim values from the access token!`, data);
      return false;
    }

    request.user = {
      username: data.sub,
      name: data.given_name,
      surname: data.family_name,
      email: data.email,
    };
    return true;
  }
}
