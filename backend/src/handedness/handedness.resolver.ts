import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UuidScalar } from "@app/graphql/scalars/uuid-scalar";
import { CreateHandednessInput } from "./dto/create-handedness.input";
import { UpdateHandednessInput } from "./dto/update-handedness.input";
import { HandednessEntity } from "./entities/handedness.entity";
import { HandednessService } from "./handedness.service";

@Resolver(() => HandednessEntity)
export class HandednessResolver {
  constructor(private readonly handednessService: HandednessService) {}

  @Mutation(() => HandednessEntity)
  createHandedness(
    @Args("createHandednessInput") createHandednessInput: CreateHandednessInput
  ): Promise<HandednessEntity> {
    return this.handednessService.create(createHandednessInput);
  }

  @Query(() => [HandednessEntity], { name: "handednesses" })
  findAll(): Promise<HandednessEntity[]> {
    return this.handednessService.findAll();
  }

  @Query(() => HandednessEntity, { name: "handedness" })
  findOne(@Args("id", { type: () => UuidScalar }) id: string): Promise<HandednessEntity> {
    return this.handednessService.findOne(id);
  }

  @Mutation(() => HandednessEntity)
  updateHandedness(
    @Args("updateHandednessInput") updateHandednessInput: UpdateHandednessInput
  ): Promise<HandednessEntity> {
    return this.handednessService.update(updateHandednessInput.id, updateHandednessInput);
  }

  @Mutation(() => HandednessEntity)
  removeHandedness(@Args("id", { type: () => UuidScalar }) id: string): Promise<HandednessEntity> {
    return this.handednessService.remove(id);
  }
}
