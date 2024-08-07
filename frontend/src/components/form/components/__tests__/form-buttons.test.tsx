import type { ButtonProps } from "@app/util/utils";
import { render, screen } from "@app/tests/utils";
import { FormButtons } from "../FormButtons";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("form buttons", () => {
  test("no buttons visible", () => {
    // ACT
    render(
      <FormButtons
        submitButtonProps={undefined}
        buttonsProps={[]}
      />
    );
    const buttons = screen.queryAllByRole("button");

    // ASSERT
    expect(buttons.length).toEqual(0);
  });

  test("only submit button", () => {
    // ARRANGE
    const titleLocalizationKey = "submitButtonTitle";

    // ACT
    render(
      <FormButtons
        submitButtonProps={{
          onClick: vi.fn(),
          titleLocalizationKey,
        }}
        buttonsProps={[]}
      />
    );
    const buttons = screen.getAllByRole("button");

    // ASSERT
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveProperty("type", "submit");
    expect(buttons[0]).toHaveTextContent(titleLocalizationKey);
  });

  test("only other buttons", () => {
    // ARRANGE
    const titleLocalizationKey1 = "title1";
    const titleLocalizationKey2 = "title2";
    const buttonsProps: ButtonProps[] = [
      {
        onClick: vi.fn(),
        titleLocalizationKey: titleLocalizationKey1,
      },
      {
        onClick: vi.fn(),
        titleLocalizationKey: titleLocalizationKey2,
      },
    ];

    // ACT
    render(
      <FormButtons
        submitButtonProps={undefined}
        buttonsProps={buttonsProps}
      />
    );
    const buttons = screen.getAllByRole("button");

    // ASSERT
    expect(buttons.length).toEqual(buttonsProps.length);
    buttons.forEach((button) => {
      expect(button).not.toHaveProperty("type", "submit");
      expect(button).not.toHaveProperty("color", "error");
    });
    expect(buttons[0]).toHaveTextContent(titleLocalizationKey1);
    expect(buttons[1]).toHaveTextContent(titleLocalizationKey2);
  });

  test("all buttons visible", () => {
    // ARRANGE
    const submitButtonTitle = "submitButtonTitle";
    const titleButton1 = "title1";
    const titleButton2 = "title2";
    const buttonsProps: ButtonProps[] = [
      {
        onClick: vi.fn(),
        titleLocalizationKey: titleButton1,
      },
      {
        onClick: vi.fn(),
        titleLocalizationKey: titleButton2,
      },
    ];

    // ACT
    render(
      <FormButtons
        submitButtonProps={{
          onClick: vi.fn(),
          titleLocalizationKey: submitButtonTitle,
        }}
        buttonsProps={buttonsProps}
      />
    );
    const buttons = screen.getAllByRole("button");

    // ASSERT
    expect(buttons.length).toEqual(buttonsProps.length + 1);
    expect(buttons[0]).toHaveTextContent(submitButtonTitle);
    expect(buttons[0]).toHaveProperty("type", "submit");
    expect(buttons[1]).toHaveTextContent(titleButton1);
    expect(buttons[1]).not.toHaveProperty("type", "submit");
    expect(buttons[2]).toHaveTextContent(titleButton2);
    expect(buttons[2]).not.toHaveProperty("type", "submit");
  });
});
