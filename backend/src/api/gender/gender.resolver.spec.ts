import { Test } from "@nestjs/testing";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateGenderInput } from "./dto/create-gender.input";
import type { UpdateGenderInput } from "./dto/update-gender.input";
import { GenderResolver } from "./gender.resolver";
import { GenderService } from "./gender.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const gender = {
  id: "1",
  code: "M",
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  translations: [
    {
      text: "Male",
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
describe("GenderResolver", () => {
  let genderResolver: GenderResolver;
  let genderService: DeepMockProxy<GenderService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GenderResolver, GenderService, PrismaService, LanguageService],
    })
      .overrideProvider(GenderService)
      .useValue(mockDeep<GenderService>())
      .compile();

    genderResolver = module.get<GenderResolver>(GenderResolver);
    genderService = module.get<GenderService, DeepMockProxy<GenderService>>(GenderService);
  });

  it("create gender", () => {
    // ARRANGE
    const createGenderInput: CreateGenderInput = {
      ...gender,
      translations: [{ code: "en", text: "Male" }],
    };
    genderService.create.mockResolvedValueOnce(gender);

    // ACT
    const createdGender = genderResolver.createGender(createGenderInput);

    // ASSERT
    expect(createdGender).resolves.toEqual(gender);
  });

  it("get gender", () => {
    // ARRANGE
    genderService.findOne.mockResolvedValueOnce(gender);

    // ACT
    const foundGender = genderResolver.getGender(gender.code);

    // ASSERT
    expect(foundGender).resolves.toEqual(gender);
  });

  it("get genders", () => {
    // ARRANGE
    const genders = [gender];
    genderService.findAll.mockResolvedValueOnce(genders);

    // ACT
    const foundGenders = genderResolver.getGenders();

    // ASSERT
    expect(foundGenders).resolves.toEqual(genders);
  });

  it("update gender", () => {
    // ARRANGE
    const updateGenderInput: UpdateGenderInput = {
      id: gender.id,
      code: "X",
    };
    genderService.update.mockResolvedValueOnce({ ...gender, code: updateGenderInput.code as string });

    // ACT
    const updatedGender = genderResolver.updateGender(updateGenderInput);

    // ASSERT
    expect(updatedGender).resolves.toEqual({ ...gender, code: updateGenderInput.code });
  });

  it("remove gender", () => {
    // ARRANGE
    const deletedAt = new Date();
    genderService.remove.mockResolvedValueOnce({ ...gender, deletedAt: deletedAt });

    // ACT
    const removedGender = genderResolver.removeGender(gender.id);

    // ASSERT
    expect(removedGender).resolves.toEqual({ ...gender, deletedAt: deletedAt });
  });
});
