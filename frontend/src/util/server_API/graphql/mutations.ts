import { gql } from "./utils";

const CREATE_VISIT_FORM = gql`
  mutation CreateVisitForm($createVisitFormInput: CreateVisitFormInput!) {
    createVisitForm(createVisitFormInput: $createVisitFormInput) {
      id
    }
  }
`;

const UPDATE_VISIT_FORM = gql`
  mutation UpdateVisitForm($updateVisitFormInput: UpdateVisitFormInput!) {
    updateVisitForm(updateVisitFormInput: $updateVisitFormInput) {
      id
    }
  }
`;

const REMOVE_VISIT_FORM = gql`
  mutation RemoveVisitForm($id: UUID!) {
    removeVisitForm(id: $id)
  }
`;

export { CREATE_VISIT_FORM, UPDATE_VISIT_FORM, REMOVE_VISIT_FORM };
