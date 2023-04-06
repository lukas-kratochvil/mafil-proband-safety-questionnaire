import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { IS_PUBLIC_KEY } from "./is-public";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly config: ConfigService, private reflector: Reflector) {}

  // TODO: implement app authorization somehow
  async canActivate(exContext: ExecutionContext): Promise<boolean> {
    if (exContext.getType<GqlContextType>() !== "graphql") {
      this.logger.error(exContext);
      return false;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      exContext.getHandler(),
      exContext.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const gqlExContext = GqlExecutionContext.create(exContext);
    const apiKey = gqlExContext.getContext().req.headers["server-api-key"] || "";

    if (apiKey === this.config.get("API_KEY_FOR_WEB")) {
      return true;
    }

    this.logger.error(`Request has invalid API key: '${apiKey}'`);
    return false;
  }
}
