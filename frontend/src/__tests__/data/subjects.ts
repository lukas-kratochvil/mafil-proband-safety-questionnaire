import { ISubjectDTO } from "@app/util/mafildb_API/dto";

export const subjectsTest: ISubjectDTO[] = [
  {
    uuid: "1",
    preferred_language_id: "cs",
    first_name: "Karel",
    last_name: "Novák",
    birth_date: new Date(),
    personal_ID: "123456789",
    gender: "M",
    native_language_id: "cs",
    handedness: "r",
    email: "karel.novak@email.cz",
    phone: "123456789",
  },
];
