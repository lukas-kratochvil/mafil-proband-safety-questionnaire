import "yup";

declare module "yup" {
  interface StringSchema {
    customEmail(): this;
    customPhoneNumber(): this;
  }
}
