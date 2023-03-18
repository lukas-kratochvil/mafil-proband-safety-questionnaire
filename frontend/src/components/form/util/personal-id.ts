import { addYears, differenceInCalendarYears, getDate, getMonth, getYear, isExists } from "date-fns";
import { ITranslatedEntity } from "@app/util/server_API/dto";

const FEMALE_CONST = 50;

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

  static getMonthIndexFromPersonalId = (personalId: string): number => {
    const month = +personalId.substring(2, 4);

    if (month >= 1 && month <= 12) {
      // male
      return month - 1;
    }
    if (personalId.length === 10 && month >= 21 && month <= 32) {
      // male with special addition of 20 - if all valid 4-digit suffixes are used up on a given day (introduced in 2004)
      return month - 21;
    }
    if (month >= 51 && month <= 62) {
      // female
      return month - 51;
    }
    if (personalId.length === 10 && month >= 71 && month <= 82) {
      // female with special addition of 20 - if all valid 4-digit suffixes are used up on a given day (introduced in 2004)
      return month - 71;
    }

    return NaN;
  };

  static isValidPersonalIdDate = (personalId: string): boolean => {
    const monthIndex = CzechPersonalId.getMonthIndexFromPersonalId(personalId);
    // 'isExists()' needs 'year' as a number - we have only last 2 digits of the year in the personal ID
    return Number.isNaN(monthIndex)
      ? false
      : isExists(1900 + +personalId.substring(0, 2), monthIndex, +personalId.substring(4, 6));
  };

  static isValidPersonalId = (personalId: string): boolean => {
    if (personalId.length === 10 && +personalId % 11 !== 0) {
      return false;
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

export const getPersonalIdFromBirthdateAndGender = (birthdate: Date, gender: ITranslatedEntity): string => {
  const year = getYear(birthdate);
  // month can be plus extra 20, but it's really a rare case when all the IDs are used up on the given day
  const month = getMonth(birthdate) + 1 + (gender.code === "F" ? FEMALE_CONST : 0);
  const day = getDate(birthdate);

  const yearStr = year % 100;
  const monthStr = month < 10 ? `0${month}` : month;
  const dayStr = day < 10 ? `0${day}` : day;
  return `${yearStr}${monthStr}${dayStr}`;
};
