import path from "path";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlOptionsFactory } from "@nestjs/graphql";
import { Request, Response } from "express";
import { GraphQLFormattedError } from "graphql";
import { EnvironmentVariables } from "@app/config/validation";
import { ValidationErrorExtensions, ValidationFieldErrors, VALIDATION_ERROR } from "@app/exception/exception-handling";
import { GENERATED_DIR_PATH } from "@app/utils/paths";
import { UUID } from "./utils/scalars/uuid-scalar";
import { Void } from "./utils/scalars/void-scalar";

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class GraphQLConfigService implements GqlOptionsFactory {
  readonly #logger = new Logger("GraphQL");

  constructor(private readonly config: ConfigService<EnvironmentVariables, true>) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: path.join(GENERATED_DIR_PATH, "graphql-schema.gql"),
      // passing original request and response objects into the GraphQL context
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
      // error formatting inspired by: https://github.com/nestjs/graphql/issues/1053#issuecomment-786972617
      formatError: (error: GraphQLFormattedError): GraphQLFormattedError => {
        if (error.message !== VALIDATION_ERROR) {
          this.#logger.error(error);
          return error;
        }

        const validationErrorExtensions = error.extensions as ValidationErrorExtensions;
        const validationFieldErrors: ValidationFieldErrors[] = [];

        validationErrorExtensions.validationErrors.forEach((validationError) => {
          if (validationError.constraints !== undefined) {
            validationFieldErrors.push({
              field: validationError.property,
              errors: Object.values(validationError.constraints),
            });
          }
        });

        const graphQLFormattedError: GraphQLFormattedError = {
          message: "Validation error",
          extensions: {
            code: VALIDATION_ERROR,
            errors: validationFieldErrors,
          },
        };
        this.#logger.error(graphQLFormattedError);
        return graphQLFormattedError;
      },
      resolvers: {
        UUID: UUID,
        Void: Void,
      },
      // GraphQL playground can be found here: http://localhost:4000/graphql
      playground: this.config.get("nodeEnv", { infer: true }) === "development",
    };
  }
}
