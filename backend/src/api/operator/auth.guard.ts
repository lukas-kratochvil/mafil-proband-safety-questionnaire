import { CanActivate, ExecutionContext, Inject, Injectable, Logger, SetMetadata } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request } from "express";
import tokenIntrospect, { errors } from "token-introspection";
import { EnvironmentVariables } from "@app/config";
import type { AuthService } from "./auth.service";
import { AUTH_SERVICE } from "./constants";

const SKIP_OIDC_AUTH_METADATA_KEY = "skipOidcAuth";
/**
 * Decorator for endpoints (for resolver classes and their methods) which should skip OIDC access token request authorization.
 */
export const SkipOidcAuth = () => SetMetadata(SKIP_OIDC_AUTH_METADATA_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly introspectToken: tokenIntrospect.IntrospectionFunction;

  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
    private readonly reflector: Reflector
  ) {
    this.introspectToken = tokenIntrospect({
      client_id: config.get("JPM_CLIENT_ID"),
      client_secret: config.get("JPM_CLIENT_SECRET"),
      endpoint: config.get("JPM_INTROSPECTION_ENDPOINT"),
    });
  }

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

    // TODO: delete API key after OIDC auth is done
    if (
      apiKey !== this.config.get("ADMIN_API_KEY", { infer: true })
      && apiKey !== this.config.get("WEB_API_KEY", { infer: true })
    ) {
      this.logger.error(
        `Request from origin '${request.headers.origin}' [User-Agent: ${request.headers["user-agent"]}] has invalid API key: '${apiKey}'!`
      );
      return false;
    }

    // for auth endpoints check the OIDC access token in the HTTP Authorization header
    if (this.config.get("NODE_ENV", { infer: true }) === "production") {
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
    }

    return true;
  }
}
