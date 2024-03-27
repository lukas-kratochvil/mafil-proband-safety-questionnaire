import type { MDB_ISubjectDTO } from "@app/util/mafildb_API/dto";
import type { INativeLanguage } from "./language";

export type ISubject = {
  uuid: MDB_ISubjectDTO["uuid"];
  preferredLanguageCode: MDB_ISubjectDTO["preferred_language_code"];
  name: MDB_ISubjectDTO["first_name"];
  surname: MDB_ISubjectDTO["last_name"];
  birthdate: MDB_ISubjectDTO["birth_date"];
  personalId: MDB_ISubjectDTO["personal_ID"];
  // TODO: should i have Gender and Handedness objects or just codes?
  genderCode: MDB_ISubjectDTO["gender"];
  handednessCode: MDB_ISubjectDTO["handedness"];
  nativeLanguage: INativeLanguage;
  email: MDB_ISubjectDTO["email"];
  phone: MDB_ISubjectDTO["phone"];
};
