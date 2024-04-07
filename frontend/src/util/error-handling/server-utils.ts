import { LocalizedError } from "./LocalizedError";
import { ServerApiValidationError } from "./ServerApiValidationError";

// Server GraphQL API error type
export type GraphQlError = {
  message: string;
  extensions: {
    code: string;
    errors?: {
      field: string;
      errors: string[];
    }[];
  };
};

// show only validation errors and hide all the others (mostly internal server errors) under one customizable message
export const createServerApiCallError = (errors: GraphQlError[] | undefined): Error => {
  if (errors && errors.length > 0) {
    let validationErrorMessage = "";
    errors.forEach((error) => {
      if (error.extensions.code === "VALIDATION_ERROR") {
        error.extensions.errors?.forEach((validationError) => {
          validationErrorMessage += `${validationError.field}: ${validationError.errors.join(" ")}\n`;
        });
      }
    });
    validationErrorMessage = validationErrorMessage.trim();

    if (validationErrorMessage.length > 0) {
      return new ServerApiValidationError(validationErrorMessage);
    }
  }

  return new LocalizedError("contactAdmin");
};
