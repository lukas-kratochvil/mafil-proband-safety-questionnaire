import { Test } from "@nestjs/testing";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateHandednessInput } from "./dto/create-handedness.input";
import type { UpdateHandednessInput } from "./dto/update-handedness.input";
import { HandednessResolver } from "./handedness.resolver";
import { HandednessService } from "./handedness.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const handedness = {
  id: "1",
  code: "RH",
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  translations: [
    {
      text: "Right-handed",
      language: {
        id: "1",
        code: "en",
        name: "English",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    },
  ],
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("HandednessResolver", () => {
  let handednessResolver: HandednessResolver;
  let handednessService: DeepMockProxy<HandednessService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HandednessResolver, HandednessService, PrismaService, LanguageService],
    })
      .overrideProvider(HandednessService)
      .useValue(mockDeep<HandednessService>())
      .compile();

    handednessResolver = module.get<HandednessResolver>(HandednessResolver);
    handednessService = module.get<HandednessService, DeepMockProxy<HandednessService>>(HandednessService);
  });

  it("create handedness", () => {
    // ARRANGE
    const createHandednessInput: CreateHandednessInput = {
      ...handedness,
      translations: [{ code: "en", text: "Right-handed" }],
    };
    handednessService.create.mockResolvedValueOnce(handedness);

    // ACT
    const createdHandedness = handednessResolver.createHandedness(createHandednessInput);

    // ASSERT
    expect(createdHandedness).resolves.toEqual(handedness);
  });

  it("get handedness", () => {
    // ARRANGE
    handednessService.findOne.mockResolvedValueOnce(handedness);

    // ACT
    const foundHandedness = handednessResolver.getHandedness(handedness.code);

    // ASSERT
    expect(foundHandedness).resolves.toEqual(handedness);
  });

  it("get handednesses", () => {
    // ARRANGE
    const handednesses = [handedness];
    handednessService.findAll.mockResolvedValueOnce(handednesses);

    // ACT
    const foundHandednesses = handednessResolver.getHandednesses();

    // ASSERT
    expect(foundHandednesses).resolves.toEqual(handednesses);
  });

  it("update handedness", () => {
    // ARRANGE
    const updateHandednessInput: UpdateHandednessInput = {
      id: handedness.id,
      code: "X",
    };
    handednessService.update.mockResolvedValueOnce({ ...handedness, code: updateHandednessInput.code as string });

    // ACT
    const updatedHandedness = handednessResolver.updateHandedness(updateHandednessInput);

    // ASSERT
    expect(updatedHandedness).resolves.toEqual({ ...handedness, code: updateHandednessInput.code });
  });

  it("remove handedness", () => {
    // ARRANGE
    const deletedAt = new Date();
    handednessService.remove.mockResolvedValueOnce({ ...handedness, deletedAt: deletedAt });

    // ACT
    const removedHandedness = handednessResolver.removeHandedness(handedness.id);

    // ASSERT
    expect(removedHandedness).resolves.toEqual({ ...handedness, deletedAt: deletedAt });
  });
});
