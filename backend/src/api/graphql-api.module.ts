import path from "path";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphQLFormattedError } from "graphql";
import { AppErrorExtensions, ValidationFieldErrors, VALIDATION_ERROR } from "@app/exception-handling";
import { GenderModule } from "./gender/gender.module";
import { HandednessModule } from "./handedness/handedness.module";
import { HTMLCardModule } from "./html-card/html-card.module";
import { NativeLanguageModule } from "./native-language/native-language.module";
import { OperatorModule } from "./operator/operator.module";
import { QuestionModule } from "./question/question.module";
import { UUID } from "./utils/scalars/uuid-scalar";
import { Void } from "./utils/scalars/void-scalar";
import { VisitFormModule } from "./visit-form/visit-form.module";

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        autoSchemaFile: path.join(process.cwd(), "graphql-schema.gql"),
        // passing original request and response objects into the GraphQL context
        context: ({ req, res }: { req: any; res: any }) => ({ req, res }),
        // error formatting inspired by: https://github.com/nestjs/graphql/issues/1053#issuecomment-786972617
        formatError: (error: GraphQLFormattedError) => {
          if (error.message === VALIDATION_ERROR) {
            const appErrorExtensions = error.extensions as AppErrorExtensions;
            const validationFieldErrors: ValidationFieldErrors[] = [];

            appErrorExtensions.validationErrors.forEach((validationError) => {
              if (validationError.constraints !== undefined) {
                const constraints: string[] = [];
                Object.keys(validationError.constraints).forEach((constraintKey) => {
                  constraints.push((validationError.constraints as any)[constraintKey]);
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
          } else {
            return error;
          }
        },
        resolvers: {
          UUID: UUID,
          Void: Void,
        },
        playground: config.get<string>("NODE_ENV") === "development",
      }),
    }),
    // only GraphQL resolvers imported from the modules below can be accessed via the GraphQL API
    GenderModule,
    HandednessModule,
    HTMLCardModule,
    NativeLanguageModule,
    OperatorModule,
    QuestionModule,
    VisitFormModule,
  ],
})
export class GraphQLApiModule {}
