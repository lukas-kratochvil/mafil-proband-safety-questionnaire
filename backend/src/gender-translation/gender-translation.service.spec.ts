import { Test, TestingModule } from "@nestjs/testing";
import { GenderTranslationService } from "./gender-translation.service";

describe("GenderTranslationService", () => {
  let service: GenderTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenderTranslationService],
    }).compile();

    service = module.get<GenderTranslationService>(GenderTranslationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
