import { AnySchema } from "yup";
import { probandFormSchema } from "../proband-form-schema";

describe("form schemas", () => {
  describe("proband form schema", () => {
    test.each([
      ["John", true],
      [" John ", true],
    ])("name: '%s' -> %s", (input: string, isValid: boolean) => {
      const schema = probandFormSchema.pick(["name"]) as AnySchema;
      const toValidate = { name: input };

      expect(schema.isValidSync(toValidate)).toBe(isValid);
    });

    test.each([
      ["Wick", true],
      [" Wick ", true],
    ])("surname: '%s' -> %s", (input: string, isValid: boolean) => {
      const schema = probandFormSchema.pick(["surname"]) as AnySchema;
      const toValidate = { surname: input };

      expect(schema.isValidSync(toValidate)).toBe(isValid);
    });

    test.each([
      ["0025644861", true],
      ["   0025644861", true],
      ["0025644861   ", true],
      [" 0025644861 ", true],
    ])("personal ID: '%s' -> %s", (input: string, isValid: boolean) => {
      const schema = probandFormSchema.pick(["personalId"]) as AnySchema;
      const toValidate = { personalId: input };

      expect(schema.isValidSync(toValidate)).toBe(isValid);
    });

    test.each([
      ["2007-12-03T10:15:30Z", true],
      ["9999-12-03T10:15:30Z", false],
    ])("birthdate: '%s' -> %s", (input: string, isValid: boolean) => {
      const schema = probandFormSchema.pick(["birthdate"]) as AnySchema;
      const toValidate = { birthdate: input };

      expect(schema.isValidSync(toValidate)).toBe(isValid);
    });

    test.each([
      ["-1", false],
      ["0", false],
      ["1", true],
      [" 1 ", true],
      ["0,5", false],
      ["0.5", false],
    ])("height cm: '%s' -> %s", (input: string, isValid: boolean) => {
      const schema = probandFormSchema.pick(["heightCm"]) as AnySchema;
      const toValidate = { heightCm: input };

      expect(schema.isValidSync(toValidate)).toBe(isValid);
    });

    test.each([
      ["-1", false],
      ["0", false],
      ["1", true],
      [" 1 ", true],
      ["0,5", false],
      ["0.5", false],
    ])("weight kg: '%s' -> %s", (input: string, isValid: boolean) => {
      const schema = probandFormSchema.pick(["weightKg"]) as AnySchema;
      const toValidate = { weightKg: input };

      expect(schema.isValidSync(toValidate)).toBe(isValid);
    });

    test.each([
      ["", false],
      ["email", false],
      ["name.surname@email", false],
      ["name.surname@email.", false],
      ["name.surname@.c", false],
      ["name.surname@e.c", false],
      ["name.surname@email.c", false],
      ["name.surname@email.com.c", false],
      ["name.surname@email.com..com", false],
      ["name.surname@email.com", true],
      [" name.surname@email.com ", true],
    ])("email: '%s' -> %s", (input: string, isValid: boolean) => {
      const schema = probandFormSchema.pick(["email"]) as AnySchema;
      const toValidate = { email: input };

      expect(schema.isValidSync(toValidate)).toBe(isValid);
    });

    test.each([
      ["123456789", true], // without any national code prefix
      ["00155625", true],
      ["00 1 556 25", true],
      [" 00 1 556 25 ", true],
      ["+420155625", true],
      ["+420 1 556 25", true],
      [" +420 1 556 25 ", true],
      ["+420", false],
      ["+420 5", true],
      ["00", false],
      ["00 5", false],
    ])("phone: '%s' -> %s", (input: string, isValid: boolean) => {
      const schema = probandFormSchema.pick(["phone"]) as AnySchema;
      const toValidate = { phone: input };

      expect(schema.isValidSync(toValidate)).toBe(isValid);
    });
  });
});
