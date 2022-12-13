import { Module } from "@nestjs/common";
import { LanguageService } from "@language/language.service";
import { PrismaService } from "@prisma/prisma.service";
import { QuestionResolver } from "./question.resolver";
import { QuestionService } from "./question.service";

@Module({
  providers: [QuestionResolver, QuestionService, PrismaService, LanguageService],
})
export class QuestionModule {}
