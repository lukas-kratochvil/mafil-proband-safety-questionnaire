import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { AdditionalVisitFormInfo } from "@prisma/client";
import { IsDate, IsInstance, IsUUID, MaxLength } from "class-validator";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { VisitFormEntity } from "./visit-form.entity";

@ObjectType()
export class AdditionalVisitFormInfoEntity extends BaseEntity implements AdditionalVisitFormInfo {
  @IsInstance(VisitFormEntity)
  @Field(() => VisitFormEntity)
  visitForm: VisitFormEntity;

  @IsUUID()
  @HideField()
  visitFormId: string;

  @IsInstance(OperatorEntity)
  @Field(() => OperatorEntity)
  finalizer: OperatorEntity;

  @IsUUID()
  @Field(() => UUID)
  finalizerId: string;

  @MaxLength(35)
  @Field()
  projectId: string;

  @MaxLength(30)
  @Field()
  projectAcronym: string;

  @MaxLength(35)
  @Field()
  deviceId: string;

  @MaxLength(200)
  @Field()
  deviceName: string;

  @IsDate()
  @Field()
  measuredAt: Date;

  @IsDate()
  @Field()
  finalizedAt: Date;
}
