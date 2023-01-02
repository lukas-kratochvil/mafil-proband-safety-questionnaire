import { Test, TestingModule } from "@nestjs/testing";
import { VisitFormService } from "./visit-form.service";

describe("VisitFormService", () => {
  let service: VisitFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitFormService],
    }).compile();

    service = module.get<VisitFormService>(VisitFormService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
