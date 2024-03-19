import { Test, TestingModule } from "@nestjs/testing";
import { NativeLanguageService } from "./native-language.service";

describe("NativeLanguageService", () => {
  let nativeLanguageService: NativeLanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NativeLanguageService],
    }).compile();

    nativeLanguageService = module.get<NativeLanguageService>(NativeLanguageService);
  });

  it("should be defined", () => {
    expect(nativeLanguageService).toBeDefined();
  });
});
