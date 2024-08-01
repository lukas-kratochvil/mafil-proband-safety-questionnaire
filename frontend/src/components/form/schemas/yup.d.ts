import "yup";

declare module "yup" {
  interface StringSchema {
    removeWhitespace(): this;
    normalizeWhitespace(): this;
    customEmail(): this;
    customPhoneNumber(): this;
  }
}
