import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { GqlContextType } from "@nestjs/graphql";

@Injectable()
export class AuthGuardDev implements CanActivate {
  readonly #logger = new Logger(AuthGuardDev.name);

  async canActivate(exContext: ExecutionContext) {
    if (exContext.getType<GqlContextType>() !== "graphql") {
      this.#logger.error(`Invalid execution context type '${exContext.getType()}'!`);
      return false;
    }

    return true;
  }
}
