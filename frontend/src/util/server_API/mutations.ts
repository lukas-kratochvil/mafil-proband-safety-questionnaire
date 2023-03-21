export const CREATE_PROBAND_VISIT_FORM = `
mutation CreateVisitForm (
  $createVisitFormInput: CreateVisitFormInput!
) {
  createVisitForm(createVisitFormInput: $createVisitFormInput) {
    id
  }
}
`;
