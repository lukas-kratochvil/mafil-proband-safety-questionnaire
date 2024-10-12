import { addYears, getDate, getMonth, getYear, isExists, subYears } from "date-fns";
import type { GenderDTO } from "@app/util/server_API/dto";

const MONTHS_IN_YEAR = 12;
const MALE_CONST_EXHAUSTED = 20;
const FEMALE_CONST = 50;
const FEMALE_CONST_EXHAUSTED = 70;
const INVALID_PERSONAL_ID = "";

/**
 * Sources about how I check Czech and Slovak personal ID:
 *  - CZ
 *    - https://www.skrblik.cz/navod/jak-se-generuje-rodne-cislo/
 *    - https://napovime.cz/navod/jak-zjistit-rodne-cislo/#Jak_zjistit_vek_a_pohlavi_z_rodneho_cisla
 *  - SK
 *    - https://www.skutocnost.sk/rubriky/financie/ako-zistit-rodne-cislo-format-a-z-coho-sa-sklada_1366.html
 */
export class CzechSlovakPersonalId {
  readonly #personalIdWithoutSlash: string = INVALID_PERSONAL_ID;

  constructor(personalId: string) {
    const personalIdTrimmed = personalId.trim();

    // format is YYMMDDXXX or YYMMDD/XXX for people born until the year 1953 including
    // format is YYMMDDXXXX or YYMMDD/XXXX for people born after the year 1953
    const personalIdRegex = /^\d{6}\/?\d{3,4}$/;

    if (personalIdRegex.test(personalIdTrimmed)) {
      const personalIdWithoutSlash = personalIdTrimmed.includes("/")
        ? `${personalIdTrimmed.slice(0, 6)}${personalIdTrimmed.slice(7)}`
        : personalIdTrimmed;

      if (CzechSlovakPersonalId.#isValidPersonalId(personalIdWithoutSlash)) {
        this.#personalIdWithoutSlash = personalIdWithoutSlash;
      }
    }
  }

  // People born after the year 1953 have 10-digit personal ID with the 10th digit being the control digit. (People born until the year 1953 including have 9-digit personal ID.)
  static #isNewPersonalId = (personalId: string): boolean => personalId.length === 10;

  // Get month index in range 0-11.
  static #getMonthIndexFromPersonalId = (personalId: string): number => {
    const month = +personalId.substring(2, 4);

    // male
    if (month > 0 && month <= MONTHS_IN_YEAR) {
      return month - 1;
    }
    // male with special addition of 20 - if all valid 4-digit suffixes are used up on a given day (introduced in 2004)
    if (
      CzechSlovakPersonalId.#isNewPersonalId(personalId)
      && MALE_CONST_EXHAUSTED < month
      && month <= MALE_CONST_EXHAUSTED + MONTHS_IN_YEAR
    ) {
      return month - MALE_CONST_EXHAUSTED - 1;
    }
    // female
    if (FEMALE_CONST < month && month <= FEMALE_CONST + MONTHS_IN_YEAR) {
      return month - FEMALE_CONST - 1;
    }
    // female with special addition of 20 - if all valid 4-digit suffixes are used up on a given day (introduced in 2004)
    if (
      CzechSlovakPersonalId.#isNewPersonalId(personalId)
      && FEMALE_CONST_EXHAUSTED < month
      && month <= FEMALE_CONST_EXHAUSTED + MONTHS_IN_YEAR
    ) {
      return month - FEMALE_CONST_EXHAUSTED - 1;
    }

    return NaN;
  };

  // Check if the personal ID date part is a valid date.
  static #isValidPersonalIdDate = (personalId: string): boolean => {
    const monthIndex = CzechSlovakPersonalId.#getMonthIndexFromPersonalId(personalId);
    // 'isExists()' needs 'year' as a number - we have only last 2 digits of the year in the personal ID
    return Number.isNaN(monthIndex)
      ? false
      : isExists(1900 + +personalId.substring(0, 2), monthIndex, +personalId.substring(4, 6));
  };

  // Check if the personal ID is valid.
  static #isValidPersonalId = (personalId: string): boolean => {
    const year = +personalId.substring(0, 2);
    // the new personal ID should be equal to 0 modulo 11
    // or in special case personal ID has 10th digit equal to 0 if first 9 digits are equal to 0 modulo 11 (valid only 1954-1985)
    if (
      CzechSlovakPersonalId.#isNewPersonalId(personalId)
      && (+personalId % 11 !== 0
        || (year >= 54 && year <= 85 && !(+personalId.slice(0, 9) % 11 === 0 && personalId[9] === "0")))
    ) {
      return false;
    }

    return CzechSlovakPersonalId.#isValidPersonalIdDate(personalId);
  };

  public isValid = (): boolean => this.#personalIdWithoutSlash !== INVALID_PERSONAL_ID;

  public isMale = (): boolean => !this.isFemale();

  public isFemale = (): boolean => +this.#personalIdWithoutSlash.substring(2, 4) > FEMALE_CONST;

  public getBirthdate = (): Date => {
    const year = +this.#personalIdWithoutSlash.substring(0, 2);
    const birthdateCentury19 = new Date(
      year,
      CzechSlovakPersonalId.#getMonthIndexFromPersonalId(this.#personalIdWithoutSlash),
      +this.#personalIdWithoutSlash.substring(4, 6)
    );

    // 10-digit personal IDs are assigned after the year 1953
    if (CzechSlovakPersonalId.#isNewPersonalId(this.#personalIdWithoutSlash)) {
      return year < 53 ? addYears(birthdateCentury19, 100) : birthdateCentury19;
    }

    // 9-digit personal IDs were assigned until the year 1953 including
    return year > 53 ? subYears(birthdateCentury19, 100) : birthdateCentury19;
  };
}

/**
 * Computes the Czech personal ID part (without the last 4 digits) from the birthdate and gender.
 */
export const getPersonalIdPart = (birthdate: Date, gender: GenderDTO): string => {
  const year = getYear(birthdate) % 100;
  // month can be plus extra 20 when all the IDs are used up on the given day, but it's really a rare case
  const month = getMonth(birthdate) + 1 + (gender.code === "F" ? FEMALE_CONST : 0);
  const day = getDate(birthdate);

  const yearStr = year < 10 ? `0${year}` : year;
  const monthStr = month < 10 ? `0${month}` : month;
  const dayStr = day < 10 ? `0${day}` : day;
  return `${yearStr}${monthStr}${dayStr}`;
};
