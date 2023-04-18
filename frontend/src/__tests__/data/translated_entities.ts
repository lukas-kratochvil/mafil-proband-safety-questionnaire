import { IGenderDTO, IHandednessDTO, INativeLanguageDTO, IQuestionDTO } from "@app/util/server_API/dto";

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

export const nativeLanguagesDev: INativeLanguageDTO[] = [
  {
    id: "1",
    code: "cs",
    order: 1,
    translations: [
      {
        text: "Czech",
        language: {
          code: "cimode",
        },
      },
    ],
  },
  {
    id: "2",
    code: "sk",
    order: 2,
    translations: [
      {
        text: "Slovak",
        language: {
          code: "cimode",
        },
      },
    ],
  },
  {
    id: "3",
    code: "en",
    order: 3,
    translations: [
      {
        text: "English",
        language: {
          code: "cimode",
        },
      },
    ],
  },
];

export const questionDev: IQuestionDTO[] = [
  {
    id: "p1q01",
    updatedAt: new Date(),
    partNumber: 1,
    mustBeApproved: false,
    translations: [
      {
        text: "Question1",
        language: {
          code: "cimode",
        },
      },
    ],
    hiddenByGenders: [],
  },
  {
    id: "p1q02",
    updatedAt: new Date(),
    partNumber: 1,
    mustBeApproved: false,
    translations: [
      {
        text: "Question2",
        language: {
          code: "cimode",
        },
      },
    ],
    hiddenByGenders: [],
  },
  {
    id: "p2q01",
    updatedAt: new Date(),
    partNumber: 2,
    mustBeApproved: true,
    translations: [
      {
        text: "Question3",
        language: {
          code: "cimode",
        },
      },
    ],
    hiddenByGenders: [],
  },
  {
    id: "p2q02",
    updatedAt: new Date(),
    partNumber: 2,
    mustBeApproved: true,
    translations: [
      {
        text: "Question4",
        language: {
          code: "cimode",
        },
      },
    ],
    hiddenByGenders: [],
  },
];
