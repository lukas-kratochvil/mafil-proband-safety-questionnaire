interface ITranslation {
  text: string;
  language: {
    code: string;
  };
}

export interface ITranslatedEntity {
  id: string;
  code: string;
  translations: ITranslation[];
}
