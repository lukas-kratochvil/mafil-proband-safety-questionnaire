import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { QuestionTranslationResolver } from "./question-translation.resolver";
import { QuestionTranslationService } from "./question-translation.service";

@Module({
  providers: [QuestionTranslationResolver, QuestionTranslationService, PrismaService],
})
export class QuestionTranslationModule {}
