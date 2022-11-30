import { addYears, differenceInCalendarYears, getDate, getMonth, getYear } from "date-fns";
import { Gender } from "@interfaces/visit";

const FEMALE_CONST = 50;

export class CzechPersonalId {
  private readonly personalId: string;

  constructor(personalId: string) {
    let personalIdNumeric = NaN;

    if (personalId.length === 10) {
      // format is: yyMMddnnnn
      personalIdNumeric = +personalId;
    } else if (personalId.length === 11 && personalId[6] === "/") {
      // format is: yyMMdd/nnnn
      personalIdNumeric = +`${personalId.slice(0, 6)}${personalId.slice(7)}`;
    }

    this.personalId
      = Number.isNaN(personalIdNumeric) || personalIdNumeric % 11 !== 0 ? "" : personalIdNumeric.toString();
  }

  public isValid(): boolean {
    return this.personalId.length !== 0;
  }

  public isMale(): boolean {
    return !this.isFemale();
  }

  public isFemale(): boolean {
    return +this.personalId.substring(2, 4) > FEMALE_CONST;
  }

  public getBirthdate(): Date {
    const birthdate = new Date(
      +this.personalId.substring(0, 2),
      +this.personalId.substring(2, 4) - (this.isFemale() ? FEMALE_CONST + 1 : 1),
      +this.personalId.substring(4, 6)
    );

    // When proband's personal ID starts with '00' and current year is 2022, it's more likely proband was born in the year 2000 than 1900
    return Math.abs(differenceInCalendarYears(birthdate, Date.now())) < 100 ? birthdate : addYears(birthdate, 100);
  }
}

export const getPersonalIdFromBirthdateAndGender = (birthdate: Date, gender: Gender): string => {
  const year = getYear(birthdate);
  const month = getMonth(birthdate) + (gender === Gender.FEMALE ? FEMALE_CONST + 1 : 1);
  const day = getDate(birthdate);

  const yearStr = year % 100;
  const monthStr = month < 10 ? `0${month}` : month;
  const dayStr = day < 10 ? `0${day}` : day;
  return `${yearStr}${monthStr}${dayStr}`;
};
