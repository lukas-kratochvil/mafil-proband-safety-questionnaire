import { render, screen } from "@app/tests/utils";
import { FormCardContainer } from "../FormCardContainer";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("form card container", () => {
  const title = "Title";

  const setup = (content: JSX.Element | string) => {
    render(<FormCardContainer title={title}>{content}</FormCardContainer>);
  };

  test("has text content", () => {
    // ARRANGE
    const content = "Content";

    // ACT
    setup(content);
    const titleElem = screen.getByText(title);
    const childrenElem = screen.getByText(content);

    // ASSERT
    expect(titleElem).toBeInTheDocument();
    expect(childrenElem).toBeInTheDocument();
  });

  test("has element content", () => {
    // ARRANGE
    const childrenTestId = "children";
    const content = <div data-testid={childrenTestId} />;

    // ACT
    setup(content);
    const titleElem = screen.getByText(title);
    const childrenElem = screen.getByTestId(childrenTestId);

    // ASSERT
    expect(titleElem).toBeInTheDocument();
    expect(childrenElem).toBeInTheDocument();
  });
});
