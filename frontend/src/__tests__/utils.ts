import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { MockedProviders } from "./__mocks__/MockedProviders";

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: MockedProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
