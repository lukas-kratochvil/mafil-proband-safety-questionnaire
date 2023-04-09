import * as path from "path";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlOptionsFactory } from "@nestjs/graphql";
import { Request, Response } from "express";
import { GraphQLFormattedError } from "graphql";
import { AppErrorExtensions, ValidationFieldErrors, VALIDATION_ERROR } from "@app/exception-handling";
import { UUID } from "./utils/scalars/uuid-scalar";
import { Void } from "./utils/scalars/void-scalar";

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class GraphQLConfigService implements GqlOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: path.join(process.cwd(), "graphql-schema.gql"),
      // passing original request and response objects into the GraphQL context
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
      // error formatting inspired by: https://github.com/nestjs/graphql/issues/1053#issuecomment-786972617
      formatError: (error: GraphQLFormattedError) => {
        if (error.message === VALIDATION_ERROR) {
          const appErrorExtensions = error.extensions as AppErrorExtensions;
          const validationFieldErrors: ValidationFieldErrors[] = [];

          appErrorExtensions.validationErrors.forEach((validationError) => {
            if (validationError.constraints !== undefined) {
              const constraints: string[] = [];
              Object.keys(validationError.constraints).forEach((constraintKey) => {
                constraints.push((validationError.constraints as Record<string, string>)[constraintKey]);
              });
              validationFieldErrors.push({
                field: validationError.property,
                errors: constraints,
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
          return graphQLFormattedError;
        }

        return error;
      },
      resolvers: {
        UUID: UUID,
        Void: Void,
      },
      playground: this.config.get<string>("NODE_ENV") === "development",
    };
  }
}
