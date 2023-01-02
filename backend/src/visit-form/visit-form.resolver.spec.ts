import { Test, TestingModule } from "@nestjs/testing";
import { VisitFormResolver } from "./visit-form.resolver";
import { VisitFormService } from "./visit-form.service";

describe("VisitFormResolver", () => {
  let resolver: VisitFormResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitFormResolver, VisitFormService],
    }).compile();

    resolver = module.get<VisitFormResolver>(VisitFormResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
