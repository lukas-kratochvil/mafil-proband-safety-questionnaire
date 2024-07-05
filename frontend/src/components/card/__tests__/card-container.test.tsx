import { render, screen } from "@test-utils";
import { CardContainer } from "../CardContainer";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("card container", () => {
  const title = "Title";

  const setup = (content: JSX.Element | string) => {
    render(<CardContainer title={title}>{content}</CardContainer>);
  };

  test("has text content", () => {
    // ARRANGE
    const contentText = "Content";

    // ACT
    setup(contentText);
    const titleElem = screen.getByText(title);
    const childrenElem = screen.getByText(contentText);

    // ASSERT
    expect(titleElem).toBeInTheDocument();
    expect(childrenElem).toBeInTheDocument();
  });

  test("has HTML element content", () => {
    // ARRANGE
    const childrenTestId = "children";
    const contentText = "Content";
    const content = <div data-testid={childrenTestId}>{contentText}</div>;

    // ACT
    setup(content);
    const titleElem = screen.getByText(title);
    const childrenElem = screen.getByTestId(childrenTestId);

    // ASSERT
    expect(titleElem).toBeInTheDocument();
    expect(childrenElem).toBeInTheDocument();
    expect(childrenElem).toHaveTextContent(contentText);
  });
});
