import { render, screen } from "@test-utils";
import { CardContainer } from "../CardContainer";

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("card container", () => {
  test("has title", () => {
    const title = "Title";

    const { container } = render(<CardContainer title={title} />);

    expect(container).toHaveTextContent(new RegExp(`^${title}$`));
  });

  test("has text content", () => {
    const title = "Title";
    const content = "Content";

    const { container } = render(<CardContainer title={title}>{content}</CardContainer>);

    expect(container).toHaveTextContent(new RegExp(`^${title}${content}$`));
  });

  test("has element content", () => {
    const childrenTestId = "children";
    const contentText = "Content";
    const content = <div data-testid={childrenTestId}>{contentText}</div>;

    const { container } = render(<CardContainer title="Title">{content}</CardContainer>);
    const children = screen.getByTestId(childrenTestId);

    expect(container).toContainElement(children);
    expect(children).toHaveTextContent(new RegExp(`^${contentText}$`));
  });
});
