import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly config: ConfigService, private reflector: Reflector) {}

  async canActivate(exContext: ExecutionContext): Promise<boolean> {
    if (exContext.getType<GqlContextType>() !== "graphql") {
      this.logger.error(`Invalid execution context type '${exContext.getType()}'!`);
      return false;
    }

    const gqlExContext = GqlExecutionContext.create(exContext);
    const gqlContext = gqlExContext.getContext();
    const request = gqlContext.req;
    const apiKey = request.headers["server-api-key"] || "";

    // Checking web service API key. Other services will be denied access.
    if (apiKey === this.config.get("API_KEY_FOR_WEB")) {
      return true;
    }

    const ip = request.ip || "";
    this.logger.error(`Request from ${ip} has invalid API key: '${apiKey}'!`);
    return false;
  }
}
