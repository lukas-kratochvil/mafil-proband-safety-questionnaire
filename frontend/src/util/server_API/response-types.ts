import type {
  ApprovalRoomTableVisitFormDTO,
  ApprovalRoomVisitFormDTO,
  GenderDTO,
  HandednessDTO,
  HTMLCardDTO,
  OperatorDTO,
  OrderedQuestionDTO,
  PdfDTO,
  QuestionDTO,
  WaitingRoomTableVisitFormDTO,
  WaitingRoomVisitFormDTO,
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

export type AuthenticateOperatorResponse = DataErrorsResponse<{ authenticateOperator: OperatorDTO }>;

export type OperatorResponse = DataErrorsResponse<{ operator: OperatorDTO }>;

export type GendersResponse = DataErrorsResponse<{ genders: GenderDTO[] }>;

export type GenderResponse = DataErrorsResponse<{ gender: GenderDTO }>;

export type HandednessesResponse = DataErrorsResponse<{ handednesses: HandednessDTO[] }>;

export type HandednessResponse = DataErrorsResponse<{ handedness: HandednessDTO }>;

export type CurrentQuestionsResponse = DataErrorsResponse<{ questions: OrderedQuestionDTO[] }>;

export type QuestionResponse = DataErrorsResponse<{ question: QuestionDTO }>;

export type EntryInfoResponse = DataErrorsResponse<{ entryInfo: HTMLCardDTO }>;

export type SafetyInfoResponse = DataErrorsResponse<{ safetyInfo: HTMLCardDTO }>;

export type BeforeExaminationResponse = DataErrorsResponse<{ beforeExamination: HTMLCardDTO }>;

export type ExaminationConsentResponse = DataErrorsResponse<{ examinationConsent: HTMLCardDTO }>;

export type ProbandContactRequestResponse = DataErrorsResponse<{ probandContactRequest: HTMLCardDTO }>;

export type ProbandContactConsentResponse = DataErrorsResponse<{ probandContactConsent: HTMLCardDTO }>;

export type WaitingRoomTableVisitFormsResponse = DataErrorsResponse<{ visitForms: WaitingRoomTableVisitFormDTO[] }>;

export type WaitingRoomVisitFormResponse = DataErrorsResponse<{ visitForm: WaitingRoomVisitFormDTO }>;

export type ApprovalRoomTableVisitFormsResponse = DataErrorsResponse<{ visitForms: ApprovalRoomTableVisitFormDTO[] }>;

export type ApprovalRoomVisitFormResponse = DataErrorsResponse<{ visitForm: ApprovalRoomVisitFormDTO }>;

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

export type GeneratePdfResponse = DataErrorsResponse<{ generatePDF: PdfDTO }>;
