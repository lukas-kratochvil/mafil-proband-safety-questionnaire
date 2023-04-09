import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GenderModule } from "./gender/gender.module";
import { GraphQLConfigService } from "./graphql-config.service";
import { HandednessModule } from "./handedness/handedness.module";
import { HTMLCardModule } from "./html-card/html-card.module";
import { NativeLanguageModule } from "./native-language/native-language.module";
import { OperatorModule } from "./operator/operator.module";
import { PDFModule } from "./pdf/pdf.module";
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
    HTMLCardModule,
    NativeLanguageModule,
    OperatorModule,
    PDFModule,
    QuestionModule,
    VisitFormModule,
  ],
})
export class GraphQLApiModule {}
