import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { AdditionalVisitFormInfo } from "@prisma/client";
import { IsDate, IsObject, IsUUID, MaxLength } from "class-validator";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { VisitFormEntity } from "./visit-form.entity";

@ObjectType()
export class AdditionalVisitFormInfoEntity extends BaseEntity implements AdditionalVisitFormInfo {
  @IsObject()
  @Field(() => VisitFormEntity)
  visitForm: VisitFormEntity;

  @IsUUID()
  @HideField()
  visitFormId: string;

  @IsObject()
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
