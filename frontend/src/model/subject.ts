import { ProbandVisitLanguageCode } from "./visitForm";

export interface ISubject {
  uuid: string;
  preferredLanguageCode: ProbandVisitLanguageCode;
  name: string;
  surname: string;
  birthdate: Date;
  personalId: string;
  // TODO: should i have Gender, Native language and Handedness objects or just codes?
  genderCode: string;
  nativeLanguageCode: string;
  handednessCode: string;
  email: string;
  phone: string;
}
