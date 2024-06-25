import type { MDB_SubjectDTO } from "@app/util/mafildb_API/dto";
import type { NativeLanguage } from "./language";

export type RecentVisitSubject = {
  uuid: MDB_SubjectDTO["uuid"];
  preferredLanguageCode: MDB_SubjectDTO["preferred_language_id"];
  name: MDB_SubjectDTO["first_name"];
  surname: MDB_SubjectDTO["last_name"];
  birthdate: MDB_SubjectDTO["birth_date"];
  personalId: MDB_SubjectDTO["personal_ID"];
  // TODO: should Gender and Handedness be objects or just codes?
  genderCode: MDB_SubjectDTO["gender"];
  handednessCode: MDB_SubjectDTO["handedness"];
  nativeLanguage: NativeLanguage | null;
  email: MDB_SubjectDTO["email"];
  phone: MDB_SubjectDTO["phone"];
};

export type Subject = Omit<RecentVisitSubject, "preferredLanguageCode" | "nativeLanguage"> & {
  preferredLanguageCode: NonNullable<RecentVisitSubject["preferredLanguageCode"]>;
  nativeLanguage: NonNullable<RecentVisitSubject["nativeLanguage"]>;
};
