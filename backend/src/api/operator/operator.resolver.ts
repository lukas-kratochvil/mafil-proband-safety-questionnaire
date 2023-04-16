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
  authenticateOperator(@Args() authenticateOperatorArgs: AuthenticateOperatorArgs): Promise<OperatorEntity> {
    return this.operatorService.authenticate(authenticateOperatorArgs);
  }

  // @Mutation(() => OperatorEntity)
  createOperator(@Args("createOperatorInput") createOperatorInput: CreateOperatorInput): Promise<OperatorEntity> {
    return this.operatorService.create(createOperatorInput);
  }

  @Query(() => [OperatorEntity], { name: "operators" })
  findAll(): Promise<OperatorEntity[]> {
    return this.operatorService.findAll();
  }

  @Query(() => OperatorEntity, { name: "operator" })
  findOne(@Args("uco") uco: string): Promise<OperatorEntity> {
    return this.operatorService.findOne(uco);
  }

  // @Mutation(() => OperatorEntity)
  updateOperator(@Args("updateOperatorInput") updateOperatorInput: UpdateOperatorInput): Promise<OperatorEntity> {
    return this.operatorService.update(updateOperatorInput.id, updateOperatorInput);
  }

  // @Mutation(() => OperatorEntity)
  removeOperator(@Args("id", { type: () => UUID }) id: string): Promise<OperatorEntity> {
    return this.operatorService.remove(id);
  }
}
