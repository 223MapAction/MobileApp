import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HeaderLeft from "../../utils/HeaderLeft";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("react-native-vector-icons/MaterialIcons", () => {
  return jest.fn(() => null);
});

describe("HeaderLeft", () => {
  const navigation = { goBack: jest.fn() };

  beforeEach(() => {
    useNavigation.mockReturnValue(navigation);
  });

  it("renders TouchableOpacity and Icon with correct properties", () => {
    const { getByTestId } = render(<HeaderLeft colors="black" />);
    
    const touchableOpacity = getByTestId("header-left");
    expect(touchableOpacity).toBeTruthy();

    // Récupérer l'icône par son nom
    expect(Icon).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "arrow-back",
        size: 27,
        color: "black",
      }),
      expect.anything()
    );
  });

  it("navigates back on press", () => {
    const { getByTestId } = render(<HeaderLeft colors="black" />);

    const touchableOpacity = getByTestId("header-left");

    fireEvent.press(touchableOpacity);
    expect(navigation.goBack).toHaveBeenCalled();
  });

  
});
