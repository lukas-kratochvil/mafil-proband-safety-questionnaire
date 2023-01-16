import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UuidScalar } from "@graphql/scalars/uuid-scalar";
import { CreateGenderInput } from "./dto/create-gender.input";
import { UpdateGenderInput } from "./dto/update-gender.input";
import { GenderEntity } from "./entities/gender.entity";
import { GenderService } from "./gender.service";

@Resolver(() => GenderEntity)
export class GenderResolver {
  constructor(private readonly genderService: GenderService) {}

  @Mutation(() => GenderEntity)
  createGender(@Args("createGenderInput") createGenderInput: CreateGenderInput): Promise<GenderEntity> {
    return this.genderService.create(createGenderInput);
  }

  @Query(() => [GenderEntity], { name: "genders" })
  findAll(): Promise<GenderEntity[]> {
    return this.genderService.findAll();
  }

  @Query(() => GenderEntity, { name: "gender" })
  findOne(@Args("id", { type: () => UuidScalar }) id: string): Promise<GenderEntity> {
    return this.genderService.findOne(id);
  }

  @Mutation(() => GenderEntity)
  updateGender(@Args("updateGenderInput") updateGenderInput: UpdateGenderInput): Promise<GenderEntity> {
    return this.genderService.update(updateGenderInput.id, updateGenderInput);
  }

  @Mutation(() => GenderEntity)
  removeGender(@Args("id", { type: () => UuidScalar }) id: string): Promise<GenderEntity> {
    return this.genderService.remove(id);
  }
}
