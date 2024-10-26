import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HeaderLeft from "../../utils/HeaderLeft";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("HeaderLeft", () => {
  const navigation = { goBack: jest.fn() };

  beforeEach(() => {
    useNavigation.mockReturnValue(navigation);
  });

  it("renders TouchableOpacity and Icon with correct properties", () => {
    const { getByTestId, getByRole } = render(<HeaderLeft colors="black" />);
    
    const touchableOpacity = getByTestId("header-left");
    expect(touchableOpacity).toBeTruthy();

    const icon = getByRole("image"); 
    expect(icon.props.name).toBe("arrow-back");
    expect(icon.props.size).toBe(27);
    expect(icon.props.color).toBe("black");
  });

  it("navigates back on press", () => {
    const { getByTestId } = render(<HeaderLeft colors="black" />);

    const touchableOpacity = getByTestId("header-left");

    fireEvent.press(touchableOpacity);
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it("changes pressed state on press", () => {
    const { getByTestId } = render(<HeaderLeft colors="black" />);

    const touchableOpacity = getByTestId("header-left");

    fireEvent.press(touchableOpacity);
    expect(touchableOpacity.props.accessibilityState.selected).toBe(true);
  });
});
