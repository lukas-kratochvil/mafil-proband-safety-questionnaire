import { UuidScalar } from "@graphql/uuid-scalar";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateOperatorInput } from "./dto/create-operator.input";
import { UpdateOperatorInput } from "./dto/update-operator.input";
import { Operator } from "./entities/operator.entity";
import { OperatorService } from "./operator.service";

@Resolver(() => Operator)
export class OperatorResolver {
  constructor(private readonly operatorService: OperatorService) {}

  @Mutation(() => Operator)
  async createOperator(@Args("createOperatorInput") createOperatorInput: CreateOperatorInput): Promise<Operator> {
    return await this.operatorService.create(createOperatorInput);
  }

  @Query(() => [Operator], { name: "findOperators" })
  findAll(): Promise<Operator[]> {
    return this.operatorService.findAll();
  }

  @Query(() => Operator, { name: "findOperator", nullable: true })
  findOne(@Args("id", { type: () => UuidScalar }) id: string): Promise<Operator | null> {
    return this.operatorService.findOne(id);
  }

  @Mutation(() => Operator, { nullable: true })
  updateOperator(@Args("updateOperatorInput") updateOperatorInput: UpdateOperatorInput): Promise<Operator | null> {
    return this.operatorService.update(updateOperatorInput.id, updateOperatorInput);
  }

  @Mutation(() => Operator, { nullable: true })
  removeOperator(@Args("id", { type: () => UuidScalar }) id: string): Promise<Operator | null> {
    return this.operatorService.remove(id);
  }
}
