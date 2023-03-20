interface ITranslation {
  text: string;
  language: {
    code: string;
  };
}

export interface ITranslatedEntityDTO {
  id: string;
  code: string;
  order?: number | null;
  translations: ITranslation[];
}

export interface IQuestionDTO {
  id: string;
  partNumber: number;
  mustBeApproved: boolean;
  translations: ITranslation[];
}
