import path from "path";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GenderModule } from "./gender/gender.module";
import { HandednessModule } from "./handedness/handedness.module";
import { NativeLanguageModule } from "./native-language/native-language.module";
import { OperatorModule } from "./operator/operator.module";
import { ProbandContactConsentModule } from "./proband-contact-consent/proband-contact-consent.module";
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
    NativeLanguageModule,
    OperatorModule,
    ProbandContactConsentModule,
    QuestionModule,
    VisitFormModule,
  ],
})
export class GraphQLApiModule {}
