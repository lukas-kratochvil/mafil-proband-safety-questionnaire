import { render, screen } from "@test-utils";
import { FormCardContainer } from "../FormCardContainer";

describe("form card container", () => {
  test("has title", () => {
    const title = "Title";

    render(<FormCardContainer title={title} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test("has text content", () => {
    const content = "Content";

    const { container } = render(<FormCardContainer title="Title">{content}</FormCardContainer>);

    expect(container).toHaveTextContent(content);
  });

  test("has element content", () => {
    const childrenTestId = "children";
    const content = <div data-testid={childrenTestId}>Content</div>;

    const { container } = render(<FormCardContainer title="Title">{content}</FormCardContainer>);
    const children = screen.getByTestId(childrenTestId);

    expect(container).toContainElement(children);
  });
});
