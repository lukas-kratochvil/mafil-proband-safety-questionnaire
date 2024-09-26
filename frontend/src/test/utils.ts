import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import type { StrictOmit } from "@app/types";
import { MockedProviders } from "./mocks/MockedProviders";

const customRender = (ui: ReactElement, options?: StrictOmit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: MockedProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
