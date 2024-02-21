import { ProbandVisitLanguageCode } from "./visit";

export interface ISubject {
  uuid: string;
  preferredLanguageCode: ProbandVisitLanguageCode;
  name: string;
  surname: string;
  birthdate: Date;
  personalId: string;
  // TODO: should i have Gender and Handedness objects or just codes?
  genderCode: string;
  handednessCode: string;
  nativeLanguageId: number;
  email: string;
  phone: string;
}
