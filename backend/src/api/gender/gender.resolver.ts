import { Args, Query, Resolver } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { CreateGenderInput } from "./dto/create-gender.input";
import { UpdateGenderInput } from "./dto/update-gender.input";
import { GenderEntity } from "./entities/gender.entity";
import { GenderService } from "./gender.service";

@Resolver(() => GenderEntity)
export class GenderResolver {
  constructor(private readonly genderService: GenderService) {}

  // @Mutation(() => GenderEntity)
  async createGender(@Args("createGenderInput") createGenderInput: CreateGenderInput) {
    return this.genderService.create(createGenderInput);
  }

  @Query(() => [GenderEntity], { name: "genders" })
  async getGenders() {
    return this.genderService.findAll();
  }

  @Query(() => GenderEntity, { name: "gender" })
  async getGender(@Args("code") code: string) {
    return this.genderService.findOne(code);
  }

  // @Mutation(() => GenderEntity)
  async updateGender(@Args("updateGenderInput") updateGenderInput: UpdateGenderInput) {
    return this.genderService.update(updateGenderInput.id, updateGenderInput);
  }

  // @Mutation(() => GenderEntity)
  async removeGender(@Args("id", { type: () => UUID }) id: string) {
    return this.genderService.remove(id);
  }
}
