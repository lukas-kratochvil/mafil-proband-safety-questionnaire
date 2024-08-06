import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { SkipOidcAuth } from "./auth.guard";
import type { AuthService } from "./auth.service";
import { AUTH_SERVICE } from "./constants";
import { AuthenticateOperatorArgs } from "./dto/authenticate-operator.args";
import { CreateOperatorInput } from "./dto/create-operator.input";
import { UpdateOperatorInput } from "./dto/update-operator.input";
import { OperatorEntity } from "./entities/operator.entity";
import { OperatorService } from "./operator.service";

@Resolver(() => OperatorEntity)
export class OperatorResolver {
  constructor(
    private readonly operatorService: OperatorService,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService
  ) {}

  @SkipOidcAuth()
  @Query(() => OperatorEntity)
  async authenticateOperator(@Args() authenticateOperatorArgs: AuthenticateOperatorArgs) {
    return this.authService.authenticate(authenticateOperatorArgs.username, { ...authenticateOperatorArgs });
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
