export const CREATE_VISIT_FORM = `
mutation CreateVisitForm (
  $createVisitFormInput: CreateVisitFormInput!
) {
  createVisitForm(createVisitFormInput: $createVisitFormInput) {
    id
  }
}
`;

export const UPDATE_VISIT_FORM = `
mutation UpdateVisitForm (
  $updateVisitFormInput: UpdateVisitFormInput!
) {
  updateVisitForm(updateVisitFormInput: $updateVisitFormInput) {
    id
  }
}
`;
