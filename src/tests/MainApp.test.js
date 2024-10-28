// App.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import App from "../MainApp";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../redux/root";

jest.mock("expo-sqlite/next", () => ({
  openDatabaseSync: jest.fn(() => ({
    transaction: jest.fn((callback) => callback({
      executeSql: jest.fn(),
    })),
  })),
}));


jest.mock("../utils/backgroundTask", () => ({
  registerBackgroundTask: jest.fn(),
}));

const renderWithRedux = (component, { initialState, store = createStore(rootReducer, initialState) } = {}) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("App Component", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithRedux(<App />);
    const appContainer = getByTestId("app-container");
    // const toast = getByTestId("toast");
    
    expect(appContainer).toBeTruthy();
    // expect(toast).toBeTruthy();t
  });

  it("registers background task on mount", () => {
    const { registerBackgroundTask } = require("../utils/backgroundTask");
    renderWithRedux(<App />);
    expect(registerBackgroundTask).toHaveBeenCalled();
  });
});
