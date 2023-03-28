import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { NativeLanguageTranslationService } from "./native-language-translation.service";

describe("NativeLanguageTranslationService", () => {
  let nativeLanguageTranslationService: NativeLanguageTranslationService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NativeLanguageTranslationService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    nativeLanguageTranslationService = module.get<NativeLanguageTranslationService>(NativeLanguageTranslationService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(nativeLanguageTranslationService).toBeDefined();
  });
});
