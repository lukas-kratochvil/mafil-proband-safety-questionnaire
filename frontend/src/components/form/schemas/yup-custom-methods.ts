import { addMethod, string } from "yup";

//======================================================================================================================
// Custom Yup methods
//
//  - register implemented methods in the './yup.d.ts' file to be able to use them
//======================================================================================================================

//----------------------------------------------
// Email
//
// - using custom email regex due to very free yup email validator, inspired by: https://github.com/jquense/yup/issues/507#issuecomment-765799429
// - email can be empty if proband does not want to fill in contact info
//----------------------------------------------
const EMAIL_REGEX
  // eslint-disable-next-line no-useless-escape
  = /^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
addMethod(string, "customEmail", function() {
  return this.matches(EMAIL_REGEX, "form.validation.notValid");
});

//----------------------------------------------
// Phone number
//
// - phone number can be empty if proband does not want to fill in contact info
//----------------------------------------------
const PHONE_NUMBER_REGEX = /^$|^(\+|00)?[1-9]{1}[0-9]{3,}$/;
addMethod(string, "customPhoneNumber", function() {
  return this.matches(PHONE_NUMBER_REGEX, "form.validation.notValid");
});
