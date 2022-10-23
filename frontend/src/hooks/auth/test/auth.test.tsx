import { act, renderHook } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { describe, vi } from "vitest";
import { authContext, IAuthMethod, useAuth } from "../Auth";

// Mocking react useContext() hook to behave like custom useAuth() hook
let operator: string | undefined = undefined;
const username = "Username";

const mockLogIn = vi.fn().mockImplementation((authmethod: IAuthMethod): boolean => {
  operator = username;
  return true;
});

const mockLogOut = vi.fn().mockImplementation(() => {
  operator = undefined;
});

const testingIAuth = {
  operator,
  logIn: mockLogIn,
  logOut: mockLogOut,
};

const mockUseContext = vi.fn().mockImplementation(() => testingIAuth);

React.useContext = mockUseContext;

// Mocking react-router-dom useNavigate() hook
const mockedUsedNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.mock("react-router-dom") as any,
  useNavigate: () => mockedUsedNavigate,
}));

// Creating wrapper component for cusotm useAuth() hook
const AuthContextProvider = ({ children }: PropsWithChildren) => (
  <authContext.Provider value={testingIAuth}>{children}</authContext.Provider>
);

const wrapper = ({ children }: PropsWithChildren) => <AuthContextProvider>{children}</AuthContextProvider>;

// Tests
afterEach(() => {
  const { logOut } = useAuth();
  logOut();
});

describe("useAuth() hook", () => {
  test("returns undefined operator", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.operator).toBeUndefined();
  });

  test("returns logged in operator", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logIn(IAuthMethod.MUNI);
    });

    expect(result.current.operator).toEqual(username);
  });
});
