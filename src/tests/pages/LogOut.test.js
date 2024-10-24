import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Logout from "../../pages/Logout"; 
import Storage from "../../api/userStorage"; 

const mockStore = configureStore([]);

jest.mock("../../api/userStorage", () => ({
  logout: jest.fn(() => Promise.resolve()), 
}));

const createTestProps = (props) => ({
  navigation: { replace: jest.fn() },
  ...props,
});

describe("Logout Component", () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore({});
    props = createTestProps({});
  });

  it("should call logout and navigate to Login", async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Logout {...props} />
      </Provider>
    );

    
    expect(getByTestId("activity-indicator")).toBeTruthy();

    await waitFor(() => {
      expect(Storage.logout).toHaveBeenCalled(); 
      expect(props.navigation.replace).toHaveBeenCalledWith("Login"); 
    });
  });
});
