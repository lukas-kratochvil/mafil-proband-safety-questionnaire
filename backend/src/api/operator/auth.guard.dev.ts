import { ExecutionContext, Injectable } from "@nestjs/common";
import { GraphQLGuard } from "../graphql.guard";

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class AuthGuardDev extends GraphQLGuard {
  constructor() {
    super(AuthGuardDev.name);
  }

  override async canActivate(exContext: ExecutionContext) {
    return super.canActivate(exContext);
  }
}
