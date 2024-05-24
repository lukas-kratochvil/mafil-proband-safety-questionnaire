import type { Request } from "express";
import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { EnvironmentVariables } from "@app/config";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly config: ConfigService<EnvironmentVariables, true>, private reflector: Reflector) {}

  async canActivate(exContext: ExecutionContext): Promise<boolean> {
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
      this.logger.error(`Request from origin '${request.headers.origin}' [${request.headers["user-agent"]}] has invalid API key: '${apiKey}'!`);
      return false;
    }

    return true;
  }
}
