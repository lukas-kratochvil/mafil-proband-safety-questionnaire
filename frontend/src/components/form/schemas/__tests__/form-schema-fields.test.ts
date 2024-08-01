import { parseISO } from "date-fns";
import { ValidationError, type AnySchema } from "yup";
import { probandFormSchema } from "../proband-form-schema";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("form schema", () => {
  test.each([
    ["John", "John"],
    [" John ", "John"],
    [" Jo hn ", "Jo hn"],
    [" Jo    hn ", "Jo hn"],
  ])("name: '%s' -> %s", (input: string, expectedOutput: string) => {
    // ARRANGE
    const schema = probandFormSchema.pick(["name"]) as AnySchema;
    const toValidate = { name: input };
    const expectedValidationOutput = { name: expectedOutput };

    // ACT
    const output = schema.validateSync(toValidate);

    // ASSERT
    expect(output).toStrictEqual(expectedValidationOutput);
  });

  test.each([
    ["Wick", "Wick"],
    [" Wick ", "Wick"],
    [" Wi ck ", "Wi ck"],
    [" Wi    ck ", "Wi ck"],
  ])("surname: '%s' -> %s", (input: string, expectedOutput: string) => {
    // ARRANGE
    const schema = probandFormSchema.pick(["surname"]) as AnySchema;
    const toValidate = { surname: input };
    const expectedValidationOutput = { surname: expectedOutput };

    // ACT
    const output = schema.validateSync(toValidate);

    // ASSERT
    expect(output).toStrictEqual(expectedValidationOutput);
  });

  test.each([
    ["0025644861", "0025644861"],
    ["   0025644861", "0025644861"],
    ["0025644861   ", "0025644861"],
    [" 0025644861 ", "0025644861"],
    [" 00256 44861 ", "0025644861"],
    [" 00256     44861 ", "0025644861"],
  ])("personal ID: '%s' -> %s", (input: string, expectedOutput: string) => {
    // ARRANGE
    const schema = probandFormSchema.pick(["personalId"]) as AnySchema;
    const toValidate = { personalId: input };
    const expectedValidationOutput = { personalId: expectedOutput };

    // ACT
    const output = schema.validateSync(toValidate);

    // ASSERT
    expect(output).toStrictEqual(expectedValidationOutput);
  });

  test.each([
    ["2007-12-03T10:15:30Z", parseISO("2007-12-03T10:15:30Z")],
    ["9999-12-03T10:15:30Z", null],
  ])("birthdate: '%s' -> %s", async (input: string, expectedOutput: Date | null) => {
    // ARRANGE
    const schema = probandFormSchema.pick(["birthdate"]) as AnySchema;
    const toValidate = { birthdate: input };
    const expectedValidationOutput = expectedOutput === null ? new ValidationError("") : { birthdate: expectedOutput };

    // ACT
    const output = schema.validate(toValidate);

    // ASSERT
    if (expectedValidationOutput instanceof ValidationError) {
      await expect(output).rejects.toBeInstanceOf(ValidationError);
    } else {
      await expect(output).resolves.toStrictEqual(expectedValidationOutput);
    }
  });

  test.each([
    ["-1", null],
    ["0", null],
    ["1", 1],
    [" 1 ", 1],
    ["0,5", null],
    ["0.5", null],
  ])("height cm: '%s' -> %s", async (input: string, expectedOutput: number | null) => {
    // ARRANGE
    const schema = probandFormSchema.pick(["heightCm"]) as AnySchema;
    const toValidate = { heightCm: input };
    const expectedValidationOutput = expectedOutput === null ? new ValidationError("") : { heightCm: expectedOutput };

    // ACT
    const output = schema.validate(toValidate);

    // ASSERT
    if (expectedValidationOutput instanceof ValidationError) {
      await expect(output).rejects.toBeInstanceOf(ValidationError);
    } else {
      await expect(output).resolves.toStrictEqual(expectedValidationOutput);
    }
  });

  test.each([
    ["-1", null],
    ["0", null],
    ["1", 1],
    [" 1 ", 1],
    ["0,5", null],
    ["0.5", null],
  ])("weight kg: '%s' -> %s", async (input: string, expectedOutput: number | null) => {
    // ARRANGE
    const schema = probandFormSchema.pick(["weightKg"]) as AnySchema;
    const toValidate = { weightKg: input };
    const expectedValidationOutput = expectedOutput === null ? new ValidationError("") : { weightKg: expectedOutput };

    // ACT
    const output = schema.validate(toValidate);

    // ASSERT
    if (expectedValidationOutput instanceof ValidationError) {
      await expect(output).rejects.toBeInstanceOf(ValidationError);
    } else {
      await expect(output).resolves.toStrictEqual(expectedValidationOutput);
    }
  });

  test.each([
    ["", null],
    ["email", null],
    ["name.surname@email", null],
    ["name.surname@email.", null],
    ["name.surname@.c", null],
    ["name.surname@e.c", null],
    ["name.surname@email.c", null],
    ["name.surname@email.com.c", null],
    ["name.surname@email.com..com", null],
    ["name.surname@email.com", "name.surname@email.com"],
    [" name.surname@email.com ", "name.surname@email.com"],
  ])("email: '%s' -> %s", async (input: string, expectedOutput: string | null) => {
    // ARRANGE
    const schema = probandFormSchema.pick(["email"]) as AnySchema;
    const toValidate = { email: input };
    const expectedValidationOutput = expectedOutput === null ? new ValidationError("") : { email: expectedOutput };

    // ACT
    const output = schema.validate(toValidate);

    // ASSERT
    if (expectedValidationOutput instanceof ValidationError) {
      await expect(output).rejects.toBeInstanceOf(ValidationError);
    } else {
      await expect(output).resolves.toStrictEqual(expectedValidationOutput);
    }
  });

  test.each([
    ["123456789", "00420123456789"], // without any national code prefix
    ["00155625", "00155625"],
    ["00 1 556 25", "00155625"],
    [" 00 1 556 25 ", "00155625"],
    ["+420155625", "00420155625"],
    ["+420 1 556 25", "00420155625"],
    [" +420 1 556 25 ", "00420155625"],
    ["+420", null],
    ["+420 5", "004205"],
    ["00", null],
    ["00 5", null],
  ])("phone: '%s' -> %s", async (input: string, expectedOutput: string | null) => {
    // ARRANGE
    const schema = probandFormSchema.pick(["phone"]) as AnySchema;
    const toValidate = { phone: input };
    const expectedValidationOutput = expectedOutput === null ? new ValidationError("") : { phone: expectedOutput };

    // ACT
    const output = schema.validate(toValidate);

    // ASSERT
    if (expectedValidationOutput instanceof ValidationError) {
      await expect(output).rejects.toBeInstanceOf(ValidationError);
    } else {
      await expect(output).resolves.toStrictEqual(expectedValidationOutput);
    }
  });
});
