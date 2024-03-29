import { IButtonProps } from "@app/util/utils";
import { render, screen } from "@test-utils";
import { IFormSubmitButtonProps } from "../../util/utils";
import { FormButtons } from "../FormButtons";

describe("form buttons", () => {
  test("no buttons visible", () => {
    render(
      <FormButtons
        submitButtonProps={undefined}
        buttonsProps={[]}
      />
    );

    expect(screen.queryAllByRole("button").length).toEqual(0);
  });

  describe("submit button", () => {
    test("is visible", () => {
      const submitButtonProps: IFormSubmitButtonProps = {
        onClick: vi.fn(),
        titleLocalizationKey: "",
      };

      render(
        <FormButtons
          submitButtonProps={submitButtonProps}
          buttonsProps={[]}
        />
      );
      const buttons = screen.getAllByRole("button");

      expect(buttons.length).toEqual(1);
      expect(buttons[0]).toHaveProperty("type", "submit");
    });

    test("has title", () => {
      const titleLocalizationKey = "submitButtonTitle";
      const submitButtonProps: IFormSubmitButtonProps = {
        onClick: vi.fn(),
        titleLocalizationKey,
      };

      render(
        <FormButtons
          submitButtonProps={submitButtonProps}
          buttonsProps={[]}
        />
      );
      const submitButton = screen.getByRole("button");

      expect(submitButton).toHaveTextContent(titleLocalizationKey);
    });
  });

  describe("other buttons", () => {
    test("are visible", () => {
      const buttonsProps: IButtonProps[] = [
        {
          onClick: vi.fn(),
          titleLocalizationKey: "title1",
        },
        {
          onClick: vi.fn(),
          titleLocalizationKey: "title2",
        },
      ];

      render(
        <FormButtons
          submitButtonProps={undefined}
          buttonsProps={buttonsProps}
        />
      );
      const buttons = screen.getAllByRole("button");

      expect(buttons.length).toEqual(buttonsProps.length);
      buttons.forEach((button) => {
        expect(button).not.toHaveProperty("type", "submit");
        expect(button).not.toHaveProperty("color", "error");
      });
    });

    test("have titles", () => {
      const titleLocalizationKey1 = "title1";
      const titleLocalizationKey2 = "title2";
      const buttonsProps: IButtonProps[] = [
        {
          onClick: vi.fn(),
          titleLocalizationKey: titleLocalizationKey1,
        },
        {
          onClick: vi.fn(),
          titleLocalizationKey: titleLocalizationKey2,
        },
      ];

      render(
        <FormButtons
          submitButtonProps={undefined}
          buttonsProps={buttonsProps}
        />
      );
      const buttons = screen.getAllByRole("button");

      expect(buttons[0]).toHaveTextContent(titleLocalizationKey1);
      expect(buttons[1]).toHaveTextContent(titleLocalizationKey2);
    });
  });

  test("all buttons visible", () => {
    const submitButtonTitle = "submitButtonTitle";
    const submitButtonProps: IFormSubmitButtonProps = {
      onClick: vi.fn(),
      titleLocalizationKey: submitButtonTitle,
    };
    const titleButton1 = "title1";
    const titleButton2 = "title2";
    const buttonsProps: IButtonProps[] = [
      {
        onClick: vi.fn(),
        titleLocalizationKey: titleButton1,
      },
      {
        onClick: vi.fn(),
        titleLocalizationKey: titleButton2,
      },
    ];

    render(
      <FormButtons
        submitButtonProps={submitButtonProps}
        buttonsProps={buttonsProps}
      />
    );
    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toEqual(3);
    expect(buttons[0]).toHaveTextContent(submitButtonTitle);
    expect(buttons[0]).toHaveProperty("type", "submit");
    expect(buttons[1]).toHaveTextContent(titleButton1);
    expect(buttons[1]).not.toHaveProperty("type", "submit");
    expect(buttons[2]).toHaveTextContent(titleButton2);
    expect(buttons[2]).not.toHaveProperty("type", "submit");
  });
});
