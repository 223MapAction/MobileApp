import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Header from "../../shared/Header";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { ApiUrl } from "../../api/http";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("../../slides/Slide3", () => {
    const { View } = require("react-native");
    return {
      MyImage: ({ style }) => <View style={style} />,
    };
});
  

const mockStore = configureStore([]);

describe("Header Component", () => {
  let store;
  let navigation;

  beforeEach(() => {
    store = mockStore({
      user: { user: { id: 1, first_name: "John", last_name: "Doe", avatar: "/path/to/avatar.jpg" } },
    });
    navigation = {
      openDrawer: jest.fn(),
      navigate: jest.fn(),
    };
    useNavigation.mockReturnValue(navigation);
  });

  it("renders correctly with title and without left button", () => {
    const { getByText } = render(
      <Provider store={store}>
        <Header title="Home" />
      </Provider>
    );
    expect(getByText("Home")).toBeTruthy();
  });

  it("renders the left button and triggers navigation on press", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Header title="Home" navigation={navigation} />
      </Provider>
    );
    fireEvent.press(getByTestId("left-button"));
    expect(navigation.openDrawer).toHaveBeenCalled();
  });

  it("renders the user's avatar and name when user is provided", () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <Header title="Home" />
      </Provider>
    );
    expect(getByTestId("avatar-image").props.source.uri).toBe(ApiUrl + "/path/to/avatar.jpg");
    expect(getByText("John Doe")).toBeTruthy();
  });

  it("navigates to Profile screen when avatar is pressed", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Header title="Home" />
      </Provider>
    );
    fireEvent.press(getByTestId("avatar-touchable"));
    expect(navigation.navigate).toHaveBeenCalledWith("TabNavigation", { screen: "ProfilStackNavigation" });
  });

  it("renders the default image if no title is provided", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Header showImage={true} />
      </Provider>
    );
    expect(getByTestId("default-image")).toBeTruthy();
  });
});
