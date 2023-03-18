interface ITranslation {
  text: string;
  language: {
    code: string;
  };
}

export interface ITranslatedEntity {
  id: string;
  code: string;
  order?: number | null;
  translations: ITranslation[];
}

export interface IQuestionEntity {
  id: string;
  partNumber: number;
  mustBeApproved: boolean;
  translations: ITranslation[];
}
