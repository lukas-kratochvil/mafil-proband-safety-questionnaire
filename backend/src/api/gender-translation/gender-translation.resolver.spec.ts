import { Test } from "@nestjs/testing";
import type { GenderTranslation } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import type { CreateGenderTranslationInput } from "./dto/create-gender-translation.input";
import type { UpdateGenderTranslationInput } from "./dto/update-gender-translation.input";
import { GenderTranslationResolver } from "./gender-translation.resolver";
import { GenderTranslationService } from "./gender-translation.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const genderTranslation: GenderTranslation = {
  id: "1",
  genderId: "1",
  languageId: "1",
  text: "Male",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("GenderTranslationResolver", () => {
  let genderTranslationResolver: GenderTranslationResolver;
  let genderTranslationService: DeepMockProxy<GenderTranslationService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GenderTranslationResolver, GenderTranslationService],
    })
      .overrideProvider(GenderTranslationService)
      .useValue(mockDeep<GenderTranslationService>())
      .compile();

    genderTranslationResolver = module.get<GenderTranslationResolver>(GenderTranslationResolver);
    genderTranslationService = module.get<GenderTranslationService, DeepMockProxy<GenderTranslationService>>(
      GenderTranslationService
    );
  });

  it("create gender translation", () => {
    // ARRANGE
    const createGenderInput: CreateGenderTranslationInput = { ...genderTranslation };
    genderTranslationService.create.mockResolvedValueOnce(genderTranslation);

    // ACT
    const createdGenderTranslation = genderTranslationResolver.createGenderTranslation(createGenderInput);

    // ASSERT
    expect(createdGenderTranslation).resolves.toEqual(genderTranslation);
  });

  it("update gender translation", () => {
    // ARRANGE
    const updateGenderTranslationInput: UpdateGenderTranslationInput = {
      ...genderTranslation,
      text: "Female",
    };
    genderTranslationService.update.mockResolvedValueOnce({
      ...genderTranslation,
      text: updateGenderTranslationInput.text,
    });

    // ACT
    const updatedGenderTranslation = genderTranslationResolver.updateGenderTranslation(updateGenderTranslationInput);

    // ASSERT
    expect(updatedGenderTranslation).resolves.toEqual({
      ...genderTranslation,
      text: updateGenderTranslationInput.text,
    });
  });
});
