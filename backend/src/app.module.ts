import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GenderTranslationModule } from "@gender-translation/gender-translation.module";
import { GenderModule } from "@gender/gender.module";
import { GraphQLConfigService } from "@graphql/graphql-config.service";
import { HandednessTranslationModule } from "@handedness-translation/handedness-translation.module";
import { HandednessModule } from "@handedness/handedness.module";
import { LanguageModule } from "@language/language.module";
import { NativeLanguageModule } from "@native-language/native-language.module";
import { OperatorModule } from "@operator/operator.module";
import { QuestionTranslationModule } from "@question-translation/question-translation.module";
import { QuestionModule } from "@question/question.module";
import { VisitFormModule } from "@visit-form/visit-form.module";

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
