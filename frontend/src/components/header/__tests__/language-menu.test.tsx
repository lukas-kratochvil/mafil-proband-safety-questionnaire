import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import { render, within } from "../../../__tests__/utils";
import { LanguageMenu } from "../LanguageMenu";

const supportedLanguages = ["Čeština", "English"];

describe("language-menu", () => {
  // TODO: REPAIR - returns 'English' only because of the i18n langauge detector - can be different on other machines
  // test("language name is visible on the language button", () => {
  //   const { container } = render(<LanguageMenu />);

  //   const button = within(container).getByRole("button");

  //   expect(button).toHaveTextContent(/^English$/);
  // });

  test("language menu is visible after clicking the language button", async () => {
    const { container } = render(<LanguageMenu />);

    const button = within(container).getByRole("button");
    await userEvent.click(button);
    const menu = within(container).getByRole("menu");

    expect(menu).toBeInTheDocument();
  });

  test("contains all supported languages", async () => {
    const { container } = render(<LanguageMenu />);

    const button = within(container).getByRole("button");
    await userEvent.click(button);
    const menu = within(container).getByRole("menu");
    const menuItems = within(menu).getAllByRole("menuitem");

    // supported languages: czech and english
    expect(menuItems.length).toBe(2);
  });

  test("language menu isn't visible after selecting one of the supported languages", async () => {
    const { container } = render(<LanguageMenu />);

    const button = within(container).getByRole("button");
    await userEvent.click(button);
    const menu = within(container).getByRole("menu");
    // click on one of the menutitems
    const menuItem = within(menu).getByText(supportedLanguages[0]);
    await userEvent.click(menuItem);

    expect(menu).not.toBeInTheDocument();
  });

  test("switches between languages", async () => {
    const { container } = render(<LanguageMenu />);
    const button = within(container).getByRole("button");

    // click on the language button
    await userEvent.click(button);
    let menu = within(container).getByRole("menu");
    // click on menutitem
    let menuItem = within(menu).getByText("English");
    await userEvent.click(menuItem);

    // selected language is visible on the button
    expect(container).toHaveTextContent(/^English$/);

    // click on the language button
    await userEvent.click(button);
    menu = within(container).getByRole("menu");
    // click on menutitem
    menuItem = within(menu).getByText("Čeština");
    await userEvent.click(menuItem);

    // selected language is visible on the button
    expect(button).toHaveTextContent(/^Čeština$/);
  });
});
