import React from "react";
import { render, waitFor, act, cleanup } from "@testing-library/react-native";
import Welcome from "../../slides/Welcome";
import { onLogin } from "../../redux/user/action";
import { onGetCommunaute } from "../../redux/communautes/action";
import Storage from "../../api/userStorage";
import { verify_token } from "../../api/auth";
import { read_user } from "../../api/user";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
jest.mock("../../api/userStorage");
jest.mock("../../api/auth");
jest.mock("../../api/user");
jest.mock("../../redux/user/action", () => ({
  onLogin: jest.fn(),
}));
jest.mock("../../redux/communautes/action", () => ({
  onGetCommunaute: jest.fn(),
}));
const mockStore = configureStore([]);
const store = mockStore({});

describe("Welcome component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.getUser.mockResolvedValue({ token: null });
  });
  afterEach(() => {
    cleanup();
  });
  const renderWithProvider = (component) => {
   return render(<Provider store={store}>{component}</Provider>);
  };
  it("should render the loading indicator initially", () => {
    const { getByTestId } = renderWithProvider(
        <Welcome navigation={{ replace: jest.fn() }} />
      );
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("should navigate to DrawerNavigation if token is valid", async () => {
    Storage.getUser.mockResolvedValue({ token: "valid-token" });
    verify_token.mockResolvedValue(true);
    read_user.mockResolvedValue({ id: 1, name: "Test User" });
    const replace = jest.fn();
  
    await act(async () => {
      renderWithProvider(<Welcome navigation={{ replace }} />);
    });
  
    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({
        token: "valid-token",
        user: { id: 1, name: "Test User" },
      });
      expect(replace).toHaveBeenCalledWith("DrawerNavigation");
    });
  });

  it("should navigate to Accueil if token is invalid", async () => {
    Storage.getUser.mockResolvedValue({ token: "invalid-token" });
    verify_token.mockRejectedValue(new Error("Invalid token"));
    const replace = jest.fn();

    await act(async () => {
      renderWithProvider(<Welcome navigation={{ replace }} />);
    });

    await waitFor(() => expect(replace).toHaveBeenCalledWith("Accueil"));
  });
});