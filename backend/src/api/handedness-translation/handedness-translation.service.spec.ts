import { Test } from "@nestjs/testing";
import { PrismaClient, type HandednessTranslation } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateHandednessTranslationInput } from "./dto/create-handedness-translation.input";
import type { UpdateHandednessTranslationInput } from "./dto/update-handedness-translation.input";
import { HandednessTranslationService } from "./handedness-translation.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const handednessTranslation: HandednessTranslation = {
  id: "1",
  languageId: "1",
  handednessId: "1",
  text: "test",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("HandednessTranslationService", () => {
  let handednessTranslationService: HandednessTranslationService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HandednessTranslationService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    handednessTranslationService = module.get<HandednessTranslationService>(HandednessTranslationService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("create handedness translation", () => {
    // ARRANGE
    const handednessTranslationInput: CreateHandednessTranslationInput = { ...handednessTranslation };
    prisma.handednessTranslation.create.mockResolvedValueOnce(handednessTranslation);

    // ACT
    const createdHandednessTranslation = handednessTranslationService.create(handednessTranslationInput);

    // ASSERT
    expect(createdHandednessTranslation).resolves.toStrictEqual(handednessTranslation);
  });

  it("update handedness translation", () => {
    // ARRANGE
    const handednessTranslationInput: UpdateHandednessTranslationInput = { ...handednessTranslation, text: "test2" };
    prisma.handednessTranslation.update.mockResolvedValueOnce({
      ...handednessTranslation,
      ...handednessTranslationInput,
    });

    // ACT
    const updatedHandednessTranslation = handednessTranslationService.update(
      handednessTranslationInput.id,
      handednessTranslationInput
    );

    // ASSERT
    expect(updatedHandednessTranslation).resolves.toStrictEqual({
      ...handednessTranslation,
      ...handednessTranslationInput,
    });
  });
});
