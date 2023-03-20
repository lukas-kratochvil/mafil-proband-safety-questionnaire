export interface IOperatorDTO {
  id: string;
  name: string;
  surname: string;
  uco: string;
  email: string;
  hasHigherPermission: boolean;
}

interface ITranslation {
  text: string;
  language: {
    code: string;
  };
}

export interface IGenderDTO {
  id: string;
  code: string;
  translations: ITranslation[];
}

export interface INativeLanguageDTO {
  id: string;
  code: string;
  order: number | null;
  translations: ITranslation[];
}

export interface IHandednessDTO {
  id: string;
  code: string;
  translations: ITranslation[];
}

export interface IQuestionDTO {
  id: string;
  partNumber: number;
  mustBeApproved: boolean;
  translations: ITranslation[];
}
