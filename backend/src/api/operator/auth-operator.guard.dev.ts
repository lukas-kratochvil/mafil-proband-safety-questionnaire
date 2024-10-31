import { ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request, UserContext } from "express";
import { EnvironmentVariables } from "@app/config/validation";
import { GraphQLGuard } from "../graphql.guard";

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class AuthOperatorGuardDev extends GraphQLGuard {
  readonly #userContext: Required<UserContext>;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    super(AuthOperatorGuardDev.name);
    this.#userContext = config.get("userContext", { infer: true });
  }

  override async canActivate(exContext: ExecutionContext) {
    if (!(await super.canActivate(exContext))) {
      return false;
    }

    const gqlExContext = GqlExecutionContext.create(exContext);
    const gqlContext = gqlExContext.getContext();
    const request = gqlContext.req as Request;

    request.user = this.#userContext;
    return true;
  }
}
