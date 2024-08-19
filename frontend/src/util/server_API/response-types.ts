import type {
  ApprovalRoomTableVisitFormDTO,
  ApprovalRoomVisitFormDTO,
  CreateVisitFormDTO,
  GenderDTO,
  HandednessDTO,
  HTMLCardDTO,
  OperatorDTO,
  PdfDTO,
  QuestionDTO,
  UpdateVisitFormDTO,
  WaitingRoomTableVisitFormDTO,
  WaitingRoomVisitFormDTO,
} from "./dto";

export type AuthenticateOperatorResponse = { authenticateOperator: OperatorDTO };

export type OperatorResponse = { operator: OperatorDTO };

export type GendersResponse = { genders: GenderDTO[] };

export type GenderResponse = { gender: GenderDTO };

export type HandednessesResponse = { handednesses: HandednessDTO[] };

export type HandednessResponse = { handedness: HandednessDTO };

export type CurrentQuestionsResponse = { questions: QuestionDTO[] };

export type QuestionResponse = { question: QuestionDTO };

export type EntryInfoResponse = { entryInfo: HTMLCardDTO };

export type SafetyInfoResponse = { safetyInfo: HTMLCardDTO };

export type BeforeExaminationResponse = { beforeExamination: HTMLCardDTO };

export type ExaminationConsentResponse = { examinationConsent: HTMLCardDTO };

export type ProbandContactRequestResponse = { probandContactRequest: HTMLCardDTO };

export type ProbandContactConsentResponse = { probandContactConsent: HTMLCardDTO };

export type WaitingRoomTableVisitFormsResponse = { visitForms: WaitingRoomTableVisitFormDTO[] };

export type WaitingRoomVisitFormResponse = { visitForm: WaitingRoomVisitFormDTO };

export type ApprovalRoomTableVisitFormsResponse = { visitForms: ApprovalRoomTableVisitFormDTO[] };

export type ApprovalRoomVisitFormResponse = { visitForm: ApprovalRoomVisitFormDTO };

export type CreateVisitFormResponse = { createVisitForm: CreateVisitFormDTO };

export type UpdateVisitFormResponse = { updateVisitForm: UpdateVisitFormDTO };

export type RemoveVisitFormResponse = { removeVisitForm: null };

export type GeneratePdfResponse = { generatePDF: PdfDTO };
