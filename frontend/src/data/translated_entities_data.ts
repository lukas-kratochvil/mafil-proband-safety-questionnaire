import { ITranslatedEntity } from "@app/util/server_API/dto";

export const genders: ITranslatedEntity[] = [
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

export const handednesses: ITranslatedEntity[] = [
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

export const nativeLanguages: ITranslatedEntity[] = [
  {
    id: "1",
    code: "cs",
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
