import { Test } from "@nestjs/testing";
import { PrismaClient, type GenderTranslation } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateGenderTranslationInput } from "./dto/create-gender-translation.input";
import type { UpdateGenderTranslationInput } from "./dto/update-gender-translation.input";
import { GenderTranslationService } from "./gender-translation.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const genderTranslation: GenderTranslation = {
  id: "1",
  languageId: "1",
  genderId: "1",
  text: "test",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("GenderTranslationService", () => {
  let genderTranslationService: GenderTranslationService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GenderTranslationService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    genderTranslationService = module.get<GenderTranslationService>(GenderTranslationService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("create gender translation", () => {
    // ARRANGE
    const genderTranslationInput: CreateGenderTranslationInput = { ...genderTranslation };
    prisma.genderTranslation.create.mockResolvedValueOnce(genderTranslation);

    // ACT
    const createdGenderTranslation = genderTranslationService.create(genderTranslationInput);

    // ASSERT
    expect(createdGenderTranslation).resolves.toStrictEqual(genderTranslation);
  });

  it("update gender translation", () => {
    // ARRANGE
    const genderTranslationInput: UpdateGenderTranslationInput = { ...genderTranslation, text: "test2" };
    prisma.genderTranslation.update.mockResolvedValueOnce({ ...genderTranslation, ...genderTranslationInput });

    // ACT
    const updatedGenderTranslation = genderTranslationService.update(genderTranslationInput.id, genderTranslationInput);

    // ASSERT
    expect(updatedGenderTranslation).resolves.toStrictEqual({ ...genderTranslation, ...genderTranslationInput });
  });
});
