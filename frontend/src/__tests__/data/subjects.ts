import type { ISubject } from "@app/model/subject";
import { nativeLanguagesTest } from "./languages";

const today = new Date();
const birthdate = new Date(today);
birthdate.setFullYear(today.getFullYear() - 20);

export const subjectsTest: ISubject[] = [
  {
    uuid: "1",
    preferredLanguageCode: "cs",
    name: "Karel",
    surname: "Novák",
    birthdate,
    personalId: "123456789",
    genderCode: "M",
    nativeLanguage: nativeLanguagesTest[0]!,
    handednessCode: "RH",
    email: "karel.novak@email.cz",
    phone: "123456789",
  },
];
