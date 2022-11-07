import { render, screen } from "../../../__tests__/utils";
import { CardContainer } from "../CardContainer";

describe("card-container", () => {
  test("has title", () => {
    const title = "Title";

    render(<CardContainer title={title} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test("has text content", () => {
    const content = "Content";

    const { container } = render(<CardContainer title="Title">{content}</CardContainer>);

    expect(container).toHaveTextContent(content);
  });

  test("has element content", () => {
    const childrenTestId = "children";
    const content = <div data-testid={childrenTestId}>Content</div>;

    const { container } = render(<CardContainer title="Title">{content}</CardContainer>);
    const children = screen.getByTestId(childrenTestId);

    expect(container).toContainElement(children);
  });
});
