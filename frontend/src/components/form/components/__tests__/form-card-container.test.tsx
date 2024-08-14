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

    // ASSERT
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  test("has element content", () => {
    // ARRANGE
    const childrenTestId = "children";
    const content = <div data-testid={childrenTestId} />;

    // ACT
    setup(content);

    // ASSERT
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId(childrenTestId)).toBeInTheDocument();
  });
});
