import { ExecutionContext, Inject, Injectable, SetMetadata } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request } from "express";
import tokenIntrospect, { errors } from "token-introspection";
import { EnvironmentVariables } from "@app/config/validation";
import { AuthGuardDev } from "./auth.guard.dev";
import type { AuthService } from "./auth.service";
import { AUTH_SERVICE } from "./constants";

const SKIP_OIDC_AUTH_METADATA_KEY = "skipOidcAuth";
/**
 * Decorator for endpoints (for resolver classes and their methods) which should skip OIDC access token request authorization.
 */
export const SkipOidcAuth = () => SetMetadata(SKIP_OIDC_AUTH_METADATA_KEY, true);

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class AuthGuard extends AuthGuardDev {
  private readonly introspectToken: tokenIntrospect.IntrospectionFunction;

  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    private readonly reflector: Reflector,
    config: ConfigService<EnvironmentVariables, true>
  ) {
    super();
    this.introspectToken = tokenIntrospect({
      client_id: config.get("oidc.jpm.clientId", { infer: true }),
      client_secret: config.get("oidc.jpm.clientSecret", { infer: true }),
      endpoint: config.get("oidc.jpm.introspectionEndpoint", { infer: true }),
    });
  }

  private extractAccessToken(request: Request) {
    const [type, accessToken] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? accessToken : undefined;
  }

  async canActivate(exContext: ExecutionContext) {
    if (!(await super.canActivate(exContext))) {
      return false;
    }

    const gqlExContext = GqlExecutionContext.create(exContext);
    const gqlContext = gqlExContext.getContext();
    const request = gqlContext.req as Request;

    // for auth endpoints check the OIDC access token in the HTTP Authorization header
    const skipOidcAuth = this.reflector.getAllAndOverride<boolean>(SKIP_OIDC_AUTH_METADATA_KEY, [
      gqlExContext.getHandler(),
      gqlExContext.getClass(),
    ]);

    if (skipOidcAuth) {
      return true;
    }

    const accessToken = this.extractAccessToken(request);
    if (accessToken === undefined) {
      this.logger.error(`Request from origin '${request.headers.origin}' does not contain OIDC access token!`);
      return false;
    }

    let username = "";
    try {
      const tokenInfo = await this.introspectToken(accessToken);
      username = tokenInfo.sub ?? "";
      await this.authService.verify(username);
    } catch (error) {
      if (error instanceof errors.IntrospectionError) {
        this.logger.error(
          `Request from origin '${request.headers.origin}' has invalid access token! Token introspection error: ${error.message}`
        );
      } else if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(`Username '${username}' not verified: ${error.message}`);
      } else {
        this.logger.error(error);
      }

      return false;
    }

    return true;
  }
}
