import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VisitFormState } from "@prisma/client";
import { UuidScalar } from "@app/graphql/scalars/uuid-scalar";
import { CreateVisitFormInput } from "./dto/create-visit-form.input";
import { UpdateVisitFormInput } from "./dto/update-visit-form.input";
import { VisitFormEntity } from "./entities/visit-form.entity";
import { VisitFormService } from "./visit-form.service";

@Resolver(() => VisitFormEntity)
export class VisitFormResolver {
  constructor(private readonly visitFormService: VisitFormService) {}

  @Mutation(() => VisitFormEntity)
  createVisitForm(@Args("createVisitFormInput") createVisitFormInput: CreateVisitFormInput) {
    return this.visitFormService.create(createVisitFormInput);
  }

  @Query(() => [VisitFormEntity], { name: "visitForms" })
  findAll(@Args("state", { type: () => VisitFormState, nullable: true }) state?: VisitFormState) {
    return this.visitFormService.findAll(state);
  }

  @Query(() => VisitFormEntity, { name: "visitForm" })
  findOne(@Args("id", { type: () => UuidScalar }) id: string) {
    return this.visitFormService.findOne(id);
  }

  @Mutation(() => VisitFormEntity)
  updateVisitForm(@Args("updateVisitFormInput") updateVisitFormInput: UpdateVisitFormInput) {
    return this.visitFormService.update(updateVisitFormInput.id, updateVisitFormInput);
  }

  @Mutation(() => VisitFormEntity)
  removeVisitForm(@Args("id", { type: () => UuidScalar }) id: string) {
    return this.visitFormService.remove(id);
  }
}
