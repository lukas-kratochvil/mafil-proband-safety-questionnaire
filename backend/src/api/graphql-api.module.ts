import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GenderModule } from "./gender/gender.module";
import { GraphQLConfigService } from "./graphql-config.service";
import { HandednessModule } from "./handedness/handedness.module";
import { NativeLanguageModule } from "./native-language/native-language.module";
import { OperatorModule } from "./operator/operator.module";
import { ProbandContactConsentModule } from "./proband-contact-consent/proband-contact-consent.module";
import { QuestionModule } from "./question/question.module";
import { VisitFormModule } from "./visit-form/visit-form.module";

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useClass: GraphQLConfigService,
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
