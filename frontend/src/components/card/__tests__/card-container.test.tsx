import { render, screen } from "@app/tests/utils";
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

    // ASSERT
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(contentText)).toBeInTheDocument();
  });

  test("has HTML element content", () => {
    // ARRANGE
    const childrenTestId = "children";
    const contentText = "Content";
    const content = <div data-testid={childrenTestId}>{contentText}</div>;

    // ACT
    setup(content);
    const childrenElem = screen.getByTestId(childrenTestId);

    // ASSERT
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(childrenElem).toBeInTheDocument();
    expect(childrenElem).toHaveTextContent(contentText);
  });
});
