import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { LanguageService } from "@app/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import { NativeLanguageResolver } from "./native-language.resolver";
import { NativeLanguageService } from "./native-language.service";

describe("NativeLanguageResolver", () => {
  let nativeLanguageResolver: NativeLanguageResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NativeLanguageResolver, NativeLanguageService, PrismaService, LanguageService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    nativeLanguageResolver = module.get<NativeLanguageResolver>(NativeLanguageResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(nativeLanguageResolver).toBeDefined();
  });
});
