import { UserInputError } from "@nestjs/apollo";
import { ValidationError } from "class-validator";
import { GraphQLErrorExtensions } from "graphql";

// Exceptions handling inspired by: https://github.com/nestjs/graphql/issues/1053#issuecomment-786972617

export const VALIDATION_ERROR = "VALIDATION_ERROR";

export type AppErrorExtensions = GraphQLErrorExtensions & {
  validationErrors: ValidationError[];
};

const createAppErrorExtensions = (errors: ValidationError[]): AppErrorExtensions => ({ validationErrors: errors });

export const createUserInputError = (errors: ValidationError[]) =>
  new UserInputError(VALIDATION_ERROR, { extensions: createAppErrorExtensions(errors) });

export interface ValidationFieldErrors {
  field: string;
  errors: string[];
}
