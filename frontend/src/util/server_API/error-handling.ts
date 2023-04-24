import { GraphQlError } from "./response-types";

// show only validation errors and hide all the others (mostly internal server errors) under one customizable message
export const createServerApiCallError = (errors: GraphQlError[] | undefined, message: string): Error => {
  if (errors) {
    let errorMessage = "";
    errors.forEach((error) => {
      if (error.extensions.code === "VALIDATION_ERROR") {
        error.extensions.errors?.forEach((validationError) => {
          errorMessage += `${validationError.field}: ${validationError.errors.join(" ")}\n`;
        });
      }
    });

    if (errorMessage.length > 0) {
      return new Error(errorMessage);
    }
  }

  return new Error(`Error occurred: ${message}! Please, contact a system administrator.`);
};
