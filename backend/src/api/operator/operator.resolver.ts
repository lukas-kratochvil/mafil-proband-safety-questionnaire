import { Inject, Logger, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Args, Context, Query, Resolver } from "@nestjs/graphql";
import type { Request } from "express";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { AuthOperatorGuard } from "./auth-operator.guard";
import { AuthOperatorGuardDev } from "./auth-operator.guard.dev";
import type { AuthService } from "./auth.service";
import { AUTH_SERVICE } from "./constants";
import { CreateOperatorInput } from "./dto/create-operator.input";
import { UpdateOperatorInput } from "./dto/update-operator.input";
import { OperatorEntity } from "./entities/operator.entity";
import { OperatorService } from "./operator.service";

@Resolver(() => OperatorEntity)
export class OperatorResolver {
  readonly #logger = new Logger(OperatorResolver.name);

  constructor(
    private readonly operatorService: OperatorService,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService
  ) {}

  @UseGuards(process.env["NODE_ENV"] === "production" ? AuthOperatorGuard : AuthOperatorGuardDev)
  @Query(() => OperatorEntity)
  async authenticateOperator(@Context("req") request: Request) {
    if (!request.user) {
      this.#logger.error("User context not present in the authentication request!");
      throw new UnauthorizedException();
    }

    const { username, ...userData } = request.user;
    return this.authService.authenticate(username, userData);
  }

  // @Mutation(() => OperatorEntity)
  async createOperator(@Args("createOperatorInput") createOperatorInput: CreateOperatorInput) {
    return this.operatorService.create(createOperatorInput);
  }

  @Query(() => [OperatorEntity], { name: "operators" })
  async getOperators() {
    return this.operatorService.findAll();
  }

  @Query(() => OperatorEntity, { name: "operator" })
  async getOperator(@Args("username") username: string) {
    return this.operatorService.findOne(username);
  }

  // @Mutation(() => OperatorEntity)
  async updateOperator(@Args("updateOperatorInput") updateOperatorInput: UpdateOperatorInput) {
    return this.operatorService.update(updateOperatorInput.id, updateOperatorInput);
  }

  // @Mutation(() => OperatorEntity)
  async removeOperator(@Args("id", { type: () => UUID }) id: string) {
    return this.operatorService.remove(id);
  }
}
