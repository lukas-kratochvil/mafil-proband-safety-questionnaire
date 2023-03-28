import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GenderModule } from "./api/gender/gender.module";
import { GraphQLConfigService } from "./api/graphql/graphql-config.service";
import { HandednessModule } from "./api/handedness/handedness.module";
import { NativeLanguageModule } from "./api/native-language/native-language.module";
import { OperatorModule } from "./api/operator/operator.module";
import { QuestionModule } from "./api/question/question.module";
import { VisitFormModule } from "./api/visit-form/visit-form.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useClass: GraphQLConfigService,
    }),
    GenderModule,
    HandednessModule,
    NativeLanguageModule,
    OperatorModule,
    QuestionModule,
    VisitFormModule,
  ],
})
export class AppModule {}
