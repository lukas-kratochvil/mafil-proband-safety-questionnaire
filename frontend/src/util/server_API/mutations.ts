export const CREATE_VISIT_FORM = `
mutation CreateVisitForm (
  $createVisitFormInput: CreateVisitFormInput!
) {
  createVisitForm(createVisitFormInput: $createVisitFormInput) {
    id
  }
}
`;
