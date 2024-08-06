import { userEvent } from "@testing-library/user-event";
import i18n from "@app/i18n/i18n";
import { render, screen, within } from "@test-utils";
import { LanguageMenu } from "../LanguageMenu";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("language menu", () => {
  const setup = () => {
    render(<LanguageMenu />);
  };

  test("language name is visible on the language button", async () => {
    // ARRANGE
    await i18n.changeLanguage("en");

    // ACT
    setup();
    const languageButton = screen.getByRole("button");

    // ASSERT
    expect(languageButton).toHaveTextContent("English");
  });

  test("contains all supported languages", async () => {
    // ARRANGE
    const user = userEvent.setup();
    const supportedLanguages = ["Čeština", "English"];

    // ACT
    setup();
    const languageButton = screen.getByRole("button");
    await user.click(languageButton);
    const menu = screen.getByRole("menu");
    const menuItems = within(menu).getAllByRole("menuitem");

    // ASSERT
    expect(menu).toBeInTheDocument();
    expect(menuItems.map((menuItem) => menuItem.textContent)).toEqual(expect.arrayContaining(supportedLanguages));
  });

  test("menu is closed after selecting one of the supported languages", async () => {
    // ARRANGE
    const user = userEvent.setup();
    const enLanguage = "English";

    // ACT
    setup();
    const languageButton = screen.getByRole("button");
    await user.click(languageButton);
    const menu = screen.getByRole("menu");
    const menuItem = within(menu).getByText(enLanguage);
    await user.click(menuItem);

    // ASSERT
    expect(menu).not.toBeInTheDocument();
    expect(languageButton).toHaveTextContent(enLanguage);
  });

  test("switches between languages", async () => {
    // ARRANGE
    const user = userEvent.setup();
    const enLanguage = "English";
    const csLanguage = "Čeština";

    // ACT & ASSERT
    setup();
    const languageButton = screen.getByRole("button");
    await user.click(languageButton);
    let menu = screen.getByRole("menu");
    let menuItem = within(menu).getByText(enLanguage);
    await user.click(menuItem);

    expect(languageButton).toHaveTextContent(enLanguage);

    await user.click(languageButton);
    menu = screen.getByRole("menu");
    menuItem = within(menu).getByText(csLanguage);
    await user.click(menuItem);

    expect(languageButton).toHaveTextContent(csLanguage);
  });
});
