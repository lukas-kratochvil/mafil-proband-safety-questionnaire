import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { NativeLanguageTranslationResolver } from "./native-language-translation.resolver";
import { NativeLanguageTranslationService } from "./native-language-translation.service";

describe("NativeLanguageTranslationResolver", () => {
  let nativeLanguageTranslationResolver: NativeLanguageTranslationResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NativeLanguageTranslationResolver, NativeLanguageTranslationService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    nativeLanguageTranslationResolver = module.get<NativeLanguageTranslationResolver>(
      NativeLanguageTranslationResolver
    );
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(nativeLanguageTranslationResolver).toBeDefined();
  });
});
