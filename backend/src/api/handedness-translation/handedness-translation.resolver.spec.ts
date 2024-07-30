import { Test } from "@nestjs/testing";
import type { HandednessTranslation } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { CreateHandednessTranslationInput } from "./dto/create-handedness-translation.input";
import type { UpdateHandednessTranslationInput } from "./dto/update-handedness-translation.input";
import { HandednessTranslationResolver } from "./handedness-translation.resolver";
import { HandednessTranslationService } from "./handedness-translation.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const handednessTranslation: HandednessTranslation = {
  id: "1",
  handednessId: "1",
  languageId: "1",
  text: "Right-handed",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("HandednessTranslationResolver", () => {
  let handednessTranslationResolver: HandednessTranslationResolver;
  let handednessTranslationService: DeepMockProxy<HandednessTranslationService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HandednessTranslationResolver, HandednessTranslationService],
    })
      .overrideProvider(HandednessTranslationService)
      .useValue(mockDeep<HandednessTranslationService>())
      .compile();

    handednessTranslationResolver = module.get<HandednessTranslationResolver>(HandednessTranslationResolver);
    handednessTranslationService = module.get<
      HandednessTranslationService,
      DeepMockProxy<HandednessTranslationService>
    >(HandednessTranslationService);
  });

  it("create handedness translation", () => {
    // ARRANGE
    const createHandednessInput: CreateHandednessTranslationInput = { ...handednessTranslation };
    handednessTranslationService.create.mockResolvedValueOnce(handednessTranslation);

    // ACT
    const createdHandednessTranslation
      = handednessTranslationResolver.createHandednessTranslation(createHandednessInput);

    // ASSERT
    expect(createdHandednessTranslation).resolves.toEqual(handednessTranslation);
  });

  it("update handedness translation", () => {
    // ARRANGE
    const updateHandednessTranslationInput: UpdateHandednessTranslationInput = {
      ...handednessTranslation,
      text: "Left-handed",
    };
    handednessTranslationService.update.mockResolvedValueOnce({
      ...handednessTranslation,
      text: updateHandednessTranslationInput.text,
    });

    // ACT
    const updatedHandednessTranslation = handednessTranslationResolver.updateHandednessTranslation(
      updateHandednessTranslationInput
    );

    // ASSERT
    expect(updatedHandednessTranslation).resolves.toEqual({
      ...handednessTranslation,
      text: updateHandednessTranslationInput.text,
    });
  });
});
