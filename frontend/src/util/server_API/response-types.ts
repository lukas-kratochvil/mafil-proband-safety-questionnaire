import {
  IApprovalRoomTableVisitFormDTO,
  IApprovalRoomVisitFormDTO,
  IGenderDTO,
  IHandednessDTO,
  IHTMLCardDTO,
  INativeLanguageDTO,
  IOperatorDTO,
  IOrderedQuestionDTO,
  IPdfDTO,
  IQuestionDTO,
  IWaitingRoomTableVisitFormDTO,
  IWaitingRoomVisitFormDTO,
} from "./dto";

// Server GraphQL API error type
export type GraphQlError = {
  message: string;
  extensions: {
    code: string;
    errors?: {
      field: string;
      errors: string[];
    }[];
  };
};

// Generic server GraphQL API response type
type DataErrorsResponse<TData> = {
  data?: TData | null;
  errors?: GraphQlError[];
};

export type AuthenticateOperatorResponse = DataErrorsResponse<{ authenticateOperator: IOperatorDTO }>;

export type OperatorResponse = DataErrorsResponse<{ operator: IOperatorDTO }>;

export type GendersResponse = DataErrorsResponse<{ genders: IGenderDTO[] }>;

export type GenderResponse = DataErrorsResponse<{ gender: IGenderDTO }>;

export type NativeLanguagesResponse = DataErrorsResponse<{ nativeLanguages: INativeLanguageDTO[] }>;

export type NativeLanguageResponse = DataErrorsResponse<{ nativeLanguage: INativeLanguageDTO }>;

export type HandednessesResponse = DataErrorsResponse<{ handednesses: IHandednessDTO[] }>;

export type HandednessResponse = DataErrorsResponse<{ handedness: IHandednessDTO }>;

export type CurrentQuestionsResponse = DataErrorsResponse<{ questions: IOrderedQuestionDTO[] }>;

export type QuestionResponse = DataErrorsResponse<{ question: IQuestionDTO }>;

export type EntryInfoResponse = DataErrorsResponse<{ entryInfo: IHTMLCardDTO }>;

export type SafetyInfoResponse = DataErrorsResponse<{ safetyInfo: IHTMLCardDTO }>;

export type BeforeExaminationResponse = DataErrorsResponse<{ beforeExamination: IHTMLCardDTO }>;

export type ExaminationConsentResponse = DataErrorsResponse<{ examinationConsent: IHTMLCardDTO }>;

export type ProbandContactRequestResponse = DataErrorsResponse<{ probandContactRequest: IHTMLCardDTO }>;

export type ProbandContactConsentResponse = DataErrorsResponse<{ probandContactConsent: IHTMLCardDTO }>;

export type WaitingRoomTableVisitFormsResponse = DataErrorsResponse<{ visitForms: IWaitingRoomTableVisitFormDTO[] }>;

export type WaitingRoomVisitFormResponse = DataErrorsResponse<{ visitForm: IWaitingRoomVisitFormDTO }>;

export type ApprovalRoomTableVisitFormsResponse = DataErrorsResponse<{ visitForms: IApprovalRoomTableVisitFormDTO[] }>;

export type ApprovalRoomVisitFormResponse = DataErrorsResponse<{ visitForm: IApprovalRoomVisitFormDTO }>;

export type CreateVisitFormResponse = DataErrorsResponse<{
  createVisitForm: {
    id: string;
  };
}>;

export type UpdateVisitFormResponse = DataErrorsResponse<{
  updateVisitForm: {
    id: string;
  };
}>;

export type RemoveVisitFormResponse = DataErrorsResponse<{ removeVisitForm: null }>;

export type GeneratePdfResponse = DataErrorsResponse<{ generatePDF: IPdfDTO }>;
