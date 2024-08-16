import { BadRequestException, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard as NestThrottlerGuard } from "@nestjs/throttler";

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class ThrottlerGuard extends NestThrottlerGuard {
  private readonly logger = new Logger(ThrottlerGuard.name);

  override getRequestResponse(exContext: ExecutionContext) {
    const reqType = exContext.getType<GqlContextType>();

    if (reqType === "graphql") {
      const gqlExContext = GqlExecutionContext.create(exContext);
      const gqlContext = gqlExContext.getContext();
      return { req: gqlContext.req, res: gqlContext.res };
    }

    const errorMsg = `Invalid execution context type '${exContext.getType()}'!`;
    this.logger.error(errorMsg);
    throw new BadRequestException(errorMsg);
  }
}
