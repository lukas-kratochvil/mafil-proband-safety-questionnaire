export interface ILanguage {
  id: number;
  nativeName: string;
  nameCs: string;
  nameEn: string;
  code: string;
  priority: number | null;
}

export type INativeLanguage = ILanguage;
