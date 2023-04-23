import { IHandednessDTO } from "@app/util/server_API/dto";

export const handednessesDev: IHandednessDTO[] = [
  {
    id: "1",
    code: "r",
    translations: [
      {
        text: "Right-handed",
        language: {
          code: "cimode",
        },
      },
    ],
  },
  {
    id: "2",
    code: "l",
    translations: [
      {
        text: "Left-handed",
        language: {
          code: "cimode",
        },
      },
    ],
  },
  {
    id: "3",
    code: "rl",
    translations: [
      {
        text: "Retrained left-handed",
        language: {
          code: "cimode",
        },
      },
    ],
  },
  {
    id: "4",
    code: "u",
    translations: [
      {
        text: "Undetermined",
        language: {
          code: "cimode",
        },
      },
    ],
  },
];
