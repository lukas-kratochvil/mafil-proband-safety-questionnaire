import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { LanguageModule } from "../language/language.module";
import { QuestionResolver } from "./question.resolver";
import { QuestionService } from "./question.service";

@Module({
  imports: [LanguageModule],
  providers: [QuestionResolver, QuestionService, PrismaService],
  exports: [QuestionResolver],
})
export class QuestionModule {}
