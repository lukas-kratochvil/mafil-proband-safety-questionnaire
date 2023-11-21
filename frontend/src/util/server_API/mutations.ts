import { gql } from "./gql-tag";

export const CREATE_VISIT_FORM = gql`
mutation CreateVisitForm (
  $createVisitFormInput: CreateVisitFormInput!
) {
  createVisitForm(createVisitFormInput: $createVisitFormInput) {
    id
  }
}
`;

export const UPDATE_VISIT_FORM = gql`
mutation UpdateVisitForm (
  $updateVisitFormInput: UpdateVisitFormInput!
) {
  updateVisitForm(updateVisitFormInput: $updateVisitFormInput) {
    id
  }
}
`;

export const REMOVE_VISIT_FORM = gql`
mutation RemoveVisitForm($id: UUID!) {
  removeVisitForm(id: $id)
}
`;
