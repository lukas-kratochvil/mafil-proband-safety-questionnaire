import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GenderTranslationModule } from "./api/gender-translation/gender-translation.module";
import { GenderModule } from "./api/gender/gender.module";
import { GraphQLConfigService } from "./api/graphql/graphql-config.service";
import { HandednessTranslationModule } from "./api/handedness-translation/handedness-translation.module";
import { HandednessModule } from "./api/handedness/handedness.module";
import { LanguageModule } from "./api/language/language.module";
import { NativeLanguageModule } from "./api/native-language/native-language.module";
import { OperatorModule } from "./api/operator/operator.module";
import { QuestionTranslationModule } from "./api/question-translation/question-translation.module";
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
    OperatorModule,
    QuestionModule,
    QuestionTranslationModule,
    LanguageModule,
    NativeLanguageModule,
    VisitFormModule,
    GenderModule,
    GenderTranslationModule,
    HandednessModule,
    HandednessTranslationModule,
  ],
})
export class AppModule {}
