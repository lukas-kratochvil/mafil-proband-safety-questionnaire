import { Module } from "@nestjs/common";
import { GenderModule } from "./gender/gender.module";
import { HandednessModule } from "./handedness/handedness.module";
import { NativeLanguageModule } from "./native-language/native-language.module";
import { OperatorModule } from "./operator/operator.module";
import { QuestionModule } from "./question/question.module";
import { VisitFormModule } from "./visit-form/visit-form.module";

@Module({
  // only GraphQL resolvers imported from the modules below can be accessed via the GraphQL API
  imports: [GenderModule, HandednessModule, NativeLanguageModule, OperatorModule, QuestionModule, VisitFormModule],
})
export class GraphQLApiModule {}
