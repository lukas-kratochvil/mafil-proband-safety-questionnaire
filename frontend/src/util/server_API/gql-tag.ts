// GraphQL tag
export const gql = String.raw;

export const OPERATOR_PROPS = gql`
id
name
surname
username
email
role
`;

export const TRANSLATIONS_FRAGMENT = gql`
translations {
  text
  language {
    code
    name
  }
}
`;

export const TRANSLATION_ENTITY_PROPS = gql`
id
code
${TRANSLATIONS_FRAGMENT}
`;

export const ORDERED_TRANSLATION_ENTITY_PROPS = gql`
order
${TRANSLATION_ENTITY_PROPS}
`;

export const HTML_PROPS = gql`
title
html
`;
