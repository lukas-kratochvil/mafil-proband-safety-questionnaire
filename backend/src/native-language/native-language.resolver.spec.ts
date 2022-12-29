import { Test, TestingModule } from "@nestjs/testing";
import { NativeLanguageResolver } from "./native-language.resolver";
import { NativeLanguageService } from "./native-language.service";

describe("NativeLanguageResolver", () => {
  let resolver: NativeLanguageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NativeLanguageResolver, NativeLanguageService],
    }).compile();

    resolver = module.get<NativeLanguageResolver>(NativeLanguageResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
