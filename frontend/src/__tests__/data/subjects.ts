import { ISubject } from "@app/model/subject";

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
    nativeLanguageId: 1,
    handednessCode: "RH",
    email: "karel.novak@email.cz",
    phone: "123456789",
  },
];
