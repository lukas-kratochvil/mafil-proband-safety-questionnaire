import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { IS_PUBLIC_KEY } from "./is-public";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService, private reflector: Reflector) {}

  async canActivate(exContext: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      exContext.getHandler(),
      exContext.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // TODO: implement app authorization somehow
    if (exContext.getType<GqlContextType>() === "graphql") {
      const graphqlContext = GqlExecutionContext.create(exContext);
      return graphqlContext.getContext().req.headers["server-api-key"] === this.config.get("API_KEY_FOR_WEB");
    }

    return false;
  }
}
