import { CanActivate, ExecutionContext, Injectable, Logger, SetMetadata } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";
import { EnvironmentVariables } from "@app/config";

const SKIP_OIDC_AUTH_KEY = "skipOidcAuth";
/**
 * Decorator for endpoints (for resolver classes and their methods) which should skip OIDC access token request authorization.
 */
export const SkipOidcAuth = () => SetMetadata(SKIP_OIDC_AUTH_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly config: ConfigService<EnvironmentVariables, true>, private reflector: Reflector) {}

  private extractAccessToken(request: Request) {
    const [type, accessToken] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? accessToken : undefined;
  }

  async canActivate(exContext: ExecutionContext) {
    if (exContext.getType<GqlContextType>() !== "graphql") {
      this.logger.error(`Invalid execution context type '${exContext.getType()}'!`);
      return false;
    }

    const gqlExContext = GqlExecutionContext.create(exContext);
    const gqlContext = gqlExContext.getContext();
    const request = gqlContext.req as Request;

    // check if issued API key is valid, other services will be denied access
    // api key HTTP header name must be in the lower case
    const apiKey = request.headers["reg-api-key"] ?? "";
    if (apiKey !== this.config.get("WEB_API_KEY", { infer: true })) {
      this.logger.error(`Request from origin '${request.headers.origin}' has invalid API key: '${apiKey}'!`);
      return false;
    }

    // for auth endpoints check the OIDC access token in the HTTP Authorization header
    const skipOidcAuth = this.reflector.getAllAndOverride<boolean>(SKIP_OIDC_AUTH_KEY, [
      gqlExContext.getHandler(),
      gqlExContext.getClass(),
    ]);
    if (!skipOidcAuth) {
      const accessToken = this.extractAccessToken(request);

      if (accessToken === undefined) {
        this.logger.error(`Request from origin '${request.headers.origin}' doesn't contain OIDC access token!`);
        return false;
      }

      // TODO: verify against JPM OIDC Introspection endpoint

      // if () {
      //   this.logger.error(`Request from origin '${request.headers.origin}' has invalid access token!`);
      //   return false;
      // }
    }

    return true;
  }
}
