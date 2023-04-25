import { GraphQlError } from "./response-types";

export class ServerApiValidationError extends Error {
  constructor(message: string) {
    super(message);
    // setting prototype because we are extending a built-in class
    Object.setPrototypeOf(this, ServerApiValidationError.prototype);
  }
}

// show only validation errors and hide all the others (mostly internal server errors) under one customizable message
export const createServerApiCallError = (errors: GraphQlError[] | undefined, message: string): Error => {
  if (errors && errors.length > 0) {
    let validationErrorMessage = "";
    errors.forEach((error) => {
      if (error.extensions.code === "VALIDATION_ERROR") {
        error.extensions.errors?.forEach((validationError) => {
          validationErrorMessage += `${validationError.field}: ${validationError.errors.join(" ")}\n`;
        });
      }
    });

    if (validationErrorMessage.length > 0) {
      return new ServerApiValidationError(validationErrorMessage);
    }
  }

  return new Error(`Error occurred: ${message}! Please, contact a system administrator.`);
};
