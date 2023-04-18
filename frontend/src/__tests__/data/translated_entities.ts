import { IGenderDTO, IHandednessDTO, INativeLanguageDTO } from "@app/util/server_API/dto";

export const genders: IGenderDTO[] = [
  {
    id: "1",
    code: "M",
    translations: [
      {
        text: "Muž",
        language: {
          code: "cs",
        },
      },
      {
        text: "Male",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "2",
    code: "F",
    translations: [
      {
        text: "Žena",
        language: {
          code: "cs",
        },
      },
      {
        text: "Female",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "3",
    code: "O",
    translations: [
      {
        text: "Jiné",
        language: {
          code: "cs",
        },
      },
      {
        text: "Other",
        language: {
          code: "en",
        },
      },
    ],
  },
];

export const handednesses: IHandednessDTO[] = [
  {
    id: "1",
    code: "r",
    translations: [
      {
        text: "Pravák",
        language: {
          code: "cs",
        },
      },
      {
        text: "Right-handed",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "2",
    code: "l",
    translations: [
      {
        text: "Levák",
        language: {
          code: "cs",
        },
      },
      {
        text: "Left-handed",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "3",
    code: "rl",
    translations: [
      {
        text: "Přeučený levák",
        language: {
          code: "cs",
        },
      },
      {
        text: "Retrained left-handed",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "4",
    code: "u",
    translations: [
      {
        text: "Neurčeno",
        language: {
          code: "cs",
        },
      },
      {
        text: "Undetermined",
        language: {
          code: "en",
        },
      },
    ],
  },
];

export const nativeLanguages: INativeLanguageDTO[] = [
  {
    id: "1",
    code: "cs",
    order: 1,
    translations: [
      {
        text: "Čeština",
        language: {
          code: "cs",
        },
      },
      {
        text: "Czech",
        language: {
          code: "en",
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
        text: "Slovenština",
        language: {
          code: "cs",
        },
      },
      {
        text: "Slovak",
        language: {
          code: "en",
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
        text: "Angličtina",
        language: {
          code: "cs",
        },
      },
      {
        text: "English",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "4",
    code: "de",
    order: null,
    translations: [
      {
        text: "Němčina",
        language: {
          code: "cs",
        },
      },
      {
        text: "German",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "5",
    code: "pl",
    order: null,
    translations: [
      {
        text: "Polština",
        language: {
          code: "cs",
        },
      },
      {
        text: "Polish",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "6",
    code: "fr",
    order: null,
    translations: [
      {
        text: "Francouzština",
        language: {
          code: "cs",
        },
      },
      {
        text: "French",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "7",
    code: "es",
    order: null,
    translations: [
      {
        text: "Španělština",
        language: {
          code: "cs",
        },
      },
      {
        text: "Spanish",
        language: {
          code: "en",
        },
      },
    ],
  },
];
