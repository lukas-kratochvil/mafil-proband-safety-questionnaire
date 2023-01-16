import { Test, TestingModule } from "@nestjs/testing";
import { GenderResolver } from "./gender.resolver";
import { GenderService } from "./gender.service";

describe("GenderResolver", () => {
  let resolver: GenderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenderResolver, GenderService],
    }).compile();

    resolver = module.get<GenderResolver>(GenderResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
