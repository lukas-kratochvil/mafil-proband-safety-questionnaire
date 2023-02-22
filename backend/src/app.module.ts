import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GenderTranslationModule } from "@app/gender-translation/gender-translation.module";
import { GenderModule } from "@app/gender/gender.module";
import { GraphQLConfigService } from "@app/graphql/graphql-config.service";
import { HandednessTranslationModule } from "@app/handedness-translation/handedness-translation.module";
import { HandednessModule } from "@app/handedness/handedness.module";
import { LanguageModule } from "@app/language/language.module";
import { NativeLanguageModule } from "@app/native-language/native-language.module";
import { OperatorModule } from "@app/operator/operator.module";
import { QuestionTranslationModule } from "@app/question-translation/question-translation.module";
import { QuestionModule } from "@app/question/question.module";
import { VisitFormModule } from "@app/visit-form/visit-form.module";

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
