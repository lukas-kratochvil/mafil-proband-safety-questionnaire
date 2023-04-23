import { IGenderDTO } from "@app/util/server_API/dto";

export const gendersDev: IGenderDTO[] = [
  {
    id: "1",
    code: "M",
    translations: [
      {
        text: "Male",
        language: {
          code: "cimode",
        },
      },
    ],
  },
  {
    id: "2",
    code: "F",
    translations: [
      {
        text: "Female",
        language: {
          code: "cimode",
        },
      },
    ],
  },
  {
    id: "3",
    code: "O",
    translations: [
      {
        text: "Other",
        language: {
          code: "cimode",
        },
      },
    ],
  },
];
