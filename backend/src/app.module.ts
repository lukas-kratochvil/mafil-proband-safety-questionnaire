import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "@app.controller";
import { AppService } from "@app.service";
import { GraphQLConfigService } from "@graphql/graphql-config.service";
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
