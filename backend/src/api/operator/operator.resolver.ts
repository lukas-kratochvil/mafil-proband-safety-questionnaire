import { Args, Query, Resolver } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { AuthenticateOperatorArgs } from "./dto/authenticate-operator.args";
import { CreateOperatorInput } from "./dto/create-operator.input";
import { UpdateOperatorInput } from "./dto/update-operator.input";
import { OperatorEntity } from "./entities/operator.entity";
import { OperatorService } from "./operator.service";

@Resolver(() => OperatorEntity)
export class OperatorResolver {
  constructor(private readonly operatorService: OperatorService) {}

  @Query(() => OperatorEntity)
  async authenticateOperator(@Args() authenticateOperatorArgs: AuthenticateOperatorArgs) {
    return this.operatorService.authenticate(authenticateOperatorArgs);
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
  async getOperator(@Args("uco") uco: string) {
    return this.operatorService.findOne(uco);
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
