import userEvent from "@testing-library/user-event";
import i18n from "@app/i18n";
import { render, within } from "@test-utils";
import { LanguageMenu } from "../LanguageMenu";

describe("language menu", () => {
  test("language name is visible on the language button", async () => {
    await i18n.changeLanguage("en");
    const { container } = render(<LanguageMenu />);

    const button = within(container).getByRole("button");

    expect(button).toHaveTextContent(/^English$/);
  });

  test("is visible after clicking the language button", async () => {
    const user = userEvent.setup();
    const { container } = render(<LanguageMenu />);

    const button = within(container).getByRole("button");
    await user.click(button);
    const menu = within(container).getByRole("menu");

    expect(menu).toBeInTheDocument();
  });

  test("contains all supported languages", async () => {
    const user = userEvent.setup();
    const supportedLanguages = ["Čeština", "English"];
    const { container } = render(<LanguageMenu />);

    const button = within(container).getByRole("button");
    await user.click(button);
    const menu = within(container).getByRole("menu");
    const menuItems = within(menu).getAllByRole("menuitem");

    expect(menuItems.map((menuItem) => menuItem.textContent)).toEqual(expect.arrayContaining(supportedLanguages));
  });

  test("isn't visible after selecting one of the supported languages", async () => {
    const user = userEvent.setup();
    const { container } = render(<LanguageMenu />);

    const button = within(container).getByRole("button");
    await user.click(button);
    const menu = within(container).getByRole("menu");
    // click on one of the menutitems
    const menuItem = within(menu).getByText("English");
    await user.click(menuItem);

    expect(menu).not.toBeInTheDocument();
  });

  test("switches between languages", async () => {
    const user = userEvent.setup();
    const { container } = render(<LanguageMenu />);
    const button = within(container).getByRole("button");

    // click on the language button
    await user.click(button);
    let menu = within(container).getByRole("menu");
    // click on menutitem
    let menuItem = within(menu).getByText("English");
    await user.click(menuItem);

    // selected language is visible on the button
    expect(container).toHaveTextContent(/^English$/);

    // click on the language button
    await user.click(button);
    menu = within(container).getByRole("menu");
    // click on menutitem
    menuItem = within(menu).getByText("Čeština");
    await user.click(menuItem);

    // selected language is visible on the button
    expect(button).toHaveTextContent(/^Čeština$/);
  });
});
