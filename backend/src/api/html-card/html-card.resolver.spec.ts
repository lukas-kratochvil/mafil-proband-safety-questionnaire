import { Test } from "@nestjs/testing";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import type { ProbandContactRequestArgs } from "./dto/proband-contact-request.args";
import type { HTMLCardEntity } from "./entities/html-card.entity";
import { HTMLCardResolver } from "./html-card.resolver";
import { HTMLCardService } from "./html-card.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const htmlCardEntity: HTMLCardEntity = {
  title: "title",
  html: "html",
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("HTMLCardResolver", () => {
  let htmlCardResolver: HTMLCardResolver;
  let htmlCardService: DeepMockProxy<HTMLCardService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HTMLCardResolver, HTMLCardService],
    })
      .overrideProvider(HTMLCardService)
      .useValue(mockDeep<HTMLCardService>())
      .compile();

    htmlCardResolver = module.get<HTMLCardResolver>(HTMLCardResolver);
    htmlCardService = module.get<HTMLCardService, DeepMockProxy<HTMLCardService>>(HTMLCardService);
  });

  it("get entry info", () => {
    // ARRANGE
    htmlCardService.getEntryInfo.mockResolvedValueOnce(htmlCardEntity);

    // ACT
    const foundHtmlCardEntity = htmlCardResolver.getEntryInfo("en");

    // ASSERT
    expect(foundHtmlCardEntity).resolves.toEqual(htmlCardEntity);
  });

  it("get safety info", () => {
    // ARRANGE
    htmlCardService.getSafetyInfo.mockResolvedValueOnce(htmlCardEntity);

    // ACT
    const foundHtmlCardEntity = htmlCardResolver.getSafetyInfo("en");

    // ASSERT
    expect(foundHtmlCardEntity).resolves.toEqual(htmlCardEntity);
  });

  it("get before examination", () => {
    // ARRANGE
    htmlCardService.getBeforeExamination.mockResolvedValueOnce(htmlCardEntity);

    // ACT
    const foundHtmlCardEntity = htmlCardResolver.getBeforeExamination("en");

    // ASSERT
    expect(foundHtmlCardEntity).resolves.toEqual(htmlCardEntity);
  });

  it("get examination consent", () => {
    // ARRANGE
    htmlCardService.getExaminationConsent.mockResolvedValueOnce(htmlCardEntity);

    // ACT
    const foundHtmlCardEntity = htmlCardResolver.getExaminationConsent("en");

    // ASSERT
    expect(foundHtmlCardEntity).resolves.toEqual(htmlCardEntity);
  });

  it("get proband contact request", () => {
    // ARRANGE
    const args: ProbandContactRequestArgs = {
      locale: "en",
      name: "John",
      surname: "Smith",
      birthdateStr: "01-01-2000",
      currentDateStr: "01-01-2024",
    };
    htmlCardService.getProbandContactRequest.mockResolvedValueOnce(htmlCardEntity);

    // ACT
    const foundHtmlCardEntity = htmlCardResolver.getProbandContactRequest(args);

    // ASSERT
    expect(foundHtmlCardEntity).resolves.toEqual(htmlCardEntity);
  });

  it("get proband contact consent", () => {
    // ARRANGE
    htmlCardService.getProbandContactConsent.mockResolvedValueOnce(htmlCardEntity);

    // ACT
    const foundHtmlCardEntity = htmlCardResolver.getProbandContactConsent("en");

    // ASSERT
    expect(foundHtmlCardEntity).resolves.toEqual(htmlCardEntity);
  });
});
