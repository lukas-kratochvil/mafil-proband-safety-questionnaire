import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { GqlContextType } from "@nestjs/graphql";

@Injectable()
export abstract class GraphQLGuard implements CanActivate {
  protected readonly logger: Logger;

  constructor(loggerName: string) {
    this.logger = new Logger(loggerName);
  }

  async canActivate(exContext: ExecutionContext) {
    if (exContext.getType<GqlContextType>() !== "graphql") {
      this.logger.error(`Invalid execution context type '${exContext.getType()}'!`);
      return false;
    }

    return true;
  }
}
