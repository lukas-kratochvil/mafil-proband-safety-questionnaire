import type { MDB_SubjectDTO } from "@app/util/mafildb_API/dto";
import type { GenderCode, HandednessCode } from "@app/util/server_API/dto";
import type { NativeLanguage } from "./language";

export type RecentVisitSubject = {
  uuid: MDB_SubjectDTO["uuid"];
  preferredLanguageCode: MDB_SubjectDTO["preferred_language"];
  name: MDB_SubjectDTO["first_name"];
  surname: MDB_SubjectDTO["last_name"];
  birthdate: MDB_SubjectDTO["birth_date"];
  personalId: MDB_SubjectDTO["personal_ID"];
  genderCode: GenderCode;
  handednessCode: HandednessCode;
  nativeLanguage: MDB_SubjectDTO["native_language"];
  email: MDB_SubjectDTO["email"];
  phone: MDB_SubjectDTO["phone"];
};

export type Subject = Omit<RecentVisitSubject, "nativeLanguage"> & { nativeLanguage: NativeLanguage };

export type DuplicatedProbandVisitSubject = Omit<Subject, "preferredLanguageCode"> & {
  preferredLanguageCode: NonNullable<Subject["preferredLanguageCode"]>;
};

export type DuplicatedPhantomVisitSubject = Omit<Subject, "preferredLanguageCode"> & {
  preferredLanguageCode: Extract<Subject["preferredLanguageCode"], null>;
};
