import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { AdditionalVisitFormInfo } from "@prisma/client";
import { IsDate, IsNumber, IsObject, IsPositive, IsUUID, MaxDate, MaxLength } from "class-validator";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { VisitFormEntity } from "./visit-form.entity";

@ObjectType()
export class AdditionalVisitFormInfoEntity extends BaseEntity implements AdditionalVisitFormInfo {
  @IsObject()
  @HideField()
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

  @IsDate()
  @MaxDate(() => new Date())
  @Field()
  finalizedAt: Date;

  // MAFILDB project UUID
  @MaxLength(35)
  @Field()
  projectUuid: string;

  // MAFILDB device ID
  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  deviceId: number;

  @IsDate()
  @Field()
  measuredAt: Date;
}
