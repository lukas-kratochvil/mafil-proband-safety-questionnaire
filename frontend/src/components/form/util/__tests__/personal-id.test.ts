import { gendersTest } from "@test/data/genders";
import { CzechSlovakPersonalId, getPersonalIdPart } from "../personal-id";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("personal ID", () => {
  describe("invalid inputs", () => {
    test.each([
      "",
      "0",
      "00060610", // 8 digits
      "00060610000", // 11 digits
      "000606//915", // 9-digit personal ID containing 2 slashes
      "/000606/915", // 9-digit personal ID containing 2 slashes
      "000606/915/", // 9-digit personal ID containing 2 slashes
      "000606/9a5", // 9-digit personal ID containing letter
      "121301/123", // 9-digit personal ID invalid month 13
      "010132/123", // 9-digit personal ID invalid day 32
      "010100/123", // 9-digit personal ID invalid day 0
      "002101/902", // 9-digit personal ID having extra 20 for male (only valid for 10 digit personal IDs)
      "007106/902", // 9-digit personal ID having extra 20 for female (only valid for 10 digit personal IDs)
      "000101//9050", // 10-digit personal ID containing 2 slashes
      "/000101/9050", // 10-digit personal ID containing 2 slashes
      "000101/9050/", // 10-digit personal ID containing 2 slashes
      "000101/9a50", // 10-digit personal ID containing letter
      "121301/1030", // 10-digit personal ID invalid month 13
      "010132/1231", // 10-digit personal ID invalid day 32
      "010100/1230", // 10-digit personal ID invalid day 0
      "000606/1001", // 10-digit personal ID where mod 11 is 1
      "000606/4090", // 10-digit personal ID where mod 11 is 10
    ])("'%s'", (personalIdInput: string) => {
      // ACT
      const personalId = new CzechSlovakPersonalId(personalIdInput);

      // ASSERT
      expect(personalId.isValid()).toBeFalsy();
    });
  });

  describe("9-digit", () => {
    test.each([
      ["000606915", new Date(1900, 5, 6)],
      ["000606/915", new Date(1900, 5, 6)],
    ])("valid MALE personal ID %s", (personalIdInput: string, expectedBirthdate: Date) => {
      // ACT
      const personalId = new CzechSlovakPersonalId(personalIdInput);

      // ASSERT
      expect(personalId.isValid()).toBeTruthy();
      expect(personalId.isMale()).toBeTruthy();
      expect(personalId.isFemale()).toBeFalsy();
      expect(personalId.getBirthdate()).toEqual(expectedBirthdate);
    });

    test.each([
      ["006206915", new Date(1900, 11, 6)],
      ["006206/915", new Date(1900, 11, 6)],
    ])("valid FEMALE personal ID %s", (personalIdInput: string, expectedBirthdate: Date) => {
      // ACT
      const personalId = new CzechSlovakPersonalId(personalIdInput);

      // ASSERT
      expect(personalId.isValid()).toBeTruthy();
      expect(personalId.isFemale()).toBeTruthy();
      expect(personalId.isMale()).toBeFalsy();
      expect(personalId.getBirthdate()).toEqual(expectedBirthdate);
    });
  });

  describe("10-digit", () => {
    test.each([
      ["0006061000", new Date(2000, 5, 6)],
      ["000606/1000", new Date(2000, 5, 6)],
      ["0026061200", new Date(2000, 5, 6)], // month plus extra 20
      ["002606/1200", new Date(2000, 5, 6)], // month plus extra 20
      ["0032061205", new Date(2000, 11, 6)], // month plus extra 20
      ["003206/1205", new Date(2000, 11, 6)], // month plus extra 20
      ["5511111210", new Date(1955, 10, 11)], // in special case personal ID has 10th digit equal to 0 if first 9 digits are equal to 0 modulo 11 (valid only 1954-1985)
    ])("valid MALE personal ID %s", (personalIdInput: string, expectedBirthdate: Date) => {
      // ACT
      const personalId = new CzechSlovakPersonalId(personalIdInput);

      // ASSERT
      expect(personalId.isValid()).toBeTruthy();
      expect(personalId.isMale()).toBeTruthy();
      expect(personalId.isFemale()).toBeFalsy();
      expect(personalId.getBirthdate()).toEqual(expectedBirthdate);
    });

    test.each([
      ["0056012000", new Date(2000, 5, 1)],
      ["005601/2000", new Date(2000, 5, 1)],
      ["0076061260", new Date(2000, 5, 6)], // month plus extra 20
      ["007606/1260", new Date(2000, 5, 6)], // month plus extra 20
      ["0082061100", new Date(2000, 11, 6)], // month plus extra 20
      ["008206/1100", new Date(2000, 11, 6)], // month plus extra 20
    ])("valid FEMALE personal ID %s", (personalIdInput: string, expectedBirthdate: Date) => {
      // ACT
      const personalId = new CzechSlovakPersonalId(personalIdInput);

      // ASSERT
      expect(personalId.isValid()).toBeTruthy();
      expect(personalId.isFemale()).toBeTruthy();
      expect(personalId.isMale()).toBeFalsy();
      expect(personalId.getBirthdate()).toEqual(expectedBirthdate);
    });
  });

  describe("part of personal ID filled from birthdate and gender", () => {
    test.each([
      { birthdate: new Date(2000, 2, 1), expectedPersonalIdPart: "000301" },
      { birthdate: new Date(2000, 2, 10), expectedPersonalIdPart: "000310" },
      { birthdate: new Date(2010, 2, 1), expectedPersonalIdPart: "100301" },
      { birthdate: new Date(2099, 2, 1), expectedPersonalIdPart: "990301" },
    ])("valid MALE personalID part $expectedPersonalIdPart", ({ birthdate, expectedPersonalIdPart }) => {
      // ARRANGE
      const maleGender = gendersTest[0]!;

      // ACT
      const personalIdPart = getPersonalIdPart(birthdate, maleGender);

      // ASSERT
      expect(personalIdPart.length).toBe(6);
      expect(personalIdPart).toBe(expectedPersonalIdPart);
    });

    test.each([
      { birthdate: new Date(2000, 2, 1), expectedPersonalIdPart: "005301" },
      { birthdate: new Date(2000, 2, 10), expectedPersonalIdPart: "005310" },
      { birthdate: new Date(2010, 2, 1), expectedPersonalIdPart: "105301" },
      { birthdate: new Date(2099, 2, 1), expectedPersonalIdPart: "995301" },
    ])("valid FEMALE personalID part $expectedPersonalIdPart", ({ birthdate, expectedPersonalIdPart }) => {
      // ARRANGE
      const femaleGender = gendersTest[1]!;

      // ACT
      const personalIdPart = getPersonalIdPart(birthdate, femaleGender);

      // ASSERT
      expect(personalIdPart.length).toBe(6);
      expect(personalIdPart).toBe(expectedPersonalIdPart);
    });
  });
});
