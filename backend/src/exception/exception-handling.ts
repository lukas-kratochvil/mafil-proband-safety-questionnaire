import { UserInputError } from "@nestjs/apollo";
import { ValidationError } from "class-validator";
import { GraphQLErrorExtensions } from "graphql";

// Exceptions handling inspired by: https://github.com/nestjs/graphql/issues/1053#issuecomment-786972617

export const VALIDATION_ERROR = "VALIDATION_ERROR";

export type ValidationErrorExtensions = GraphQLErrorExtensions & {
  validationErrors: ValidationError[];
};

const createValidationErrorExtensions = (errors: ValidationError[]): ValidationErrorExtensions => ({
  validationErrors: errors,
});

export const createUserInputError = (errors: ValidationError[]) =>
  new UserInputError(VALIDATION_ERROR, { extensions: createValidationErrorExtensions(errors) });

export interface ValidationFieldErrors {
  field: string;
  errors: string[];
}
