import { addYears, differenceInCalendarYears, getDate, getMonth, getYear, isExists } from "date-fns";
import type { GenderDTO } from "@app/util/server_API/dto";

const MONTHS_IN_YEAR = 12;
const MALE_CONST_EXHAUSTED = 20;
const FEMALE_CONST = 50;
const FEMALE_CONST_EXHAUSTED = 70;

/**
 * Source about how I check Czech personal ID: https://www.skrblik.cz/navod/jak-se-generuje-rodne-cislo/
 */
export class CzechPersonalId {
  private readonly personalIdWithoutSlash: string = "";

  constructor(personalId: string) {
    const personalIdTrimmed = personalId.trim();

    // format is YYMMDDXXX or YYMMDD/XXX for people born until the year 1953 including
    // format is YYMMDDXXXX or YYMMDD/XXXX for people born after the year 1953
    const personalIdRegex = /^\d{6}\/?\d{3,4}$/;

    if (personalIdRegex.test(personalIdTrimmed)) {
      const personalIdWithoutSlash = personalIdTrimmed.includes("/")
        ? `${personalIdTrimmed.slice(0, 6)}${personalIdTrimmed.slice(7)}`
        : personalIdTrimmed;

      if (CzechPersonalId.isValidPersonalId(personalIdWithoutSlash)) {
        this.personalIdWithoutSlash = personalIdWithoutSlash;
      }
    }
  }

  // People born after the year 1953 have 10-digit personal ID with the 10th digit being the control digit. (People born until the year 1953 including have 9-digit personal ID.)
  private static isNewPersonalId = (personalId: string): boolean => personalId.length === 10;

  // Get month index in range 0-11.
  private static getMonthIndexFromPersonalId = (personalId: string): number => {
    const month = +personalId.substring(2, 4);

    // male
    if (month > 0 && month <= MONTHS_IN_YEAR) {
      return month - 1;
    }
    // male with special addition of 20 - if all valid 4-digit suffixes are used up on a given day (introduced in 2004)
    if (CzechPersonalId.isNewPersonalId(personalId) && month > MALE_CONST_EXHAUSTED && month <= MALE_CONST_EXHAUSTED + MONTHS_IN_YEAR) {
      return month - MALE_CONST_EXHAUSTED - 1;
    }
    // female
    if (month > FEMALE_CONST && month <= FEMALE_CONST + MONTHS_IN_YEAR) {
      return month - FEMALE_CONST - 1;
    }
    // female with special addition of 20 - if all valid 4-digit suffixes are used up on a given day (introduced in 2004)
    if (CzechPersonalId.isNewPersonalId(personalId) && month > FEMALE_CONST_EXHAUSTED && month <= FEMALE_CONST_EXHAUSTED + MONTHS_IN_YEAR) {
      return month - FEMALE_CONST_EXHAUSTED - 1;
    }

    return NaN;
  };

  // Check if the personal ID date part is a valid date.
  private static isValidPersonalIdDate = (personalId: string): boolean => {
    const monthIndex = CzechPersonalId.getMonthIndexFromPersonalId(personalId);
    // 'isExists()' needs 'year' as a number - we have only last 2 digits of the year in the personal ID
    return Number.isNaN(monthIndex)
      ? false
      : isExists(1900 + +personalId.substring(0, 2), monthIndex, +personalId.substring(4, 6));
  };

  // Check if the personal ID is valid.
  private static isValidPersonalId = (personalId: string): boolean => {
    // the new personal ID should be equal to 0 modulo 11 or equal to 0 when you subtract the sum of the even numbers from the sum of the odd numbers
    if (CzechPersonalId.isNewPersonalId(personalId)) {
      let oddSum = 0;
      let evenSum = 0;

      for (let i = 0; i < personalId.length; i++) {
        const char = personalId[i] as string;

        if (!/\d/.test(char)) {
          return false;
        }

        const num = parseInt(char);
        if ((i + 1) % 2 === 0) {
          evenSum += num;
        } else {
          oddSum += num;
        }
      }

      if (+personalId % 11 !== 0 && oddSum - evenSum !== 0) {
        return false;
      }
    }

    return CzechPersonalId.isValidPersonalIdDate(personalId);
  };

  public isValid = (): boolean => this.personalIdWithoutSlash !== "";

  public isMale = (): boolean => !this.isFemale();

  public isFemale = (): boolean => +this.personalIdWithoutSlash.substring(2, 4) > FEMALE_CONST;

  private static correctBirthdate = (birthdate: Date): Date => {
    let correctedBirthdate = birthdate;

    // when proband's personal ID starts with '00' and current year is 2022, it's more likely proband was born in the year 2000 than 1900
    while (differenceInCalendarYears(Date.now(), correctedBirthdate) >= 100) {
      correctedBirthdate = addYears(correctedBirthdate, 100);
    }

    return correctedBirthdate;
  };

  public getBirthdate = (): Date => {
    const birthdate = new Date(
      +this.personalIdWithoutSlash.substring(0, 2),
      CzechPersonalId.getMonthIndexFromPersonalId(this.personalIdWithoutSlash),
      +this.personalIdWithoutSlash.substring(4, 6)
    );

    // 9-digit personal IDs were assigned until the year 1953 including
    return this.personalIdWithoutSlash.length === 9 ? birthdate : CzechPersonalId.correctBirthdate(birthdate);
  };
}

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
