import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { AdditionalVisitFormInfo } from "@prisma/client";
import { IsDate, IsInstance, IsUUID, MaxLength } from "class-validator";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { VisitFormEntity } from "./visit-form.entity";

@ObjectType()
export class AdditionalVisitFormInfoEntity extends BaseEntity implements AdditionalVisitFormInfo {
  @Field(() => VisitFormEntity)
  @IsInstance(VisitFormEntity)
  visitForm: VisitFormEntity;

  @HideField()
  @IsUUID()
  visitFormId: string;

  @Field(() => OperatorEntity)
  @IsInstance(OperatorEntity)
  finalizer: OperatorEntity;

  @Field(() => UUID)
  @IsUUID()
  finalizerId: string;

  @Field()
  @MaxLength(35)
  projectId: string;

  @Field()
  @MaxLength(30)
  projectAcronym: string;

  @Field()
  @MaxLength(35)
  deviceId: string;

  @Field()
  @MaxLength(200)
  deviceName: string;

  @Field()
  @IsDate()
  measuredAt: Date;

  @Field()
  @IsDate()
  finalizedAt: Date;
}
