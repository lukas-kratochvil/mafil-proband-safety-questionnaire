import { Args, Query, Resolver } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { SkipOidcAuth } from "@app/guards/auth/auth.guard";
import { CreateHandednessInput } from "./dto/create-handedness.input";
import { UpdateHandednessInput } from "./dto/update-handedness.input";
import { HandednessEntity } from "./entities/handedness.entity";
import { HandednessService } from "./handedness.service";

@Resolver(() => HandednessEntity)
export class HandednessResolver {
  constructor(private readonly handednessService: HandednessService) {}

  // @Mutation(() => HandednessEntity)
  async createHandedness(@Args("createHandednessInput") createHandednessInput: CreateHandednessInput) {
    return this.handednessService.create(createHandednessInput);
  }

  @SkipOidcAuth()
  @Query(() => [HandednessEntity], { name: "handednesses" })
  async getHandednesses() {
    return this.handednessService.findAll();
  }

  @Query(() => HandednessEntity, { name: "handedness" })
  async getHandedness(@Args("code") code: string) {
    return this.handednessService.findOne(code);
  }

  // @Mutation(() => HandednessEntity)
  async updateHandedness(@Args("updateHandednessInput") updateHandednessInput: UpdateHandednessInput) {
    return this.handednessService.update(updateHandednessInput.id, updateHandednessInput);
  }

  // @Mutation(() => HandednessEntity)
  async removeHandedness(@Args("id", { type: () => UUID }) id: string) {
    return this.handednessService.remove(id);
  }
}
