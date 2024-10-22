import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Login from "../../pages/Login"; 
import { NavigationContainer } from '@react-navigation/native';

describe("Login Component", () => {
  const mockPush = jest.fn(); 

  const mockNavigation = {
    push: mockPush, 
  };

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should render correctly", () => {
    const { getByText } = render(
      <NavigationContainer>
        <Login navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Se connecter avec")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("Numéro de Téléphone")).toBeTruthy();
    expect(getByText("Réseaux sociaux")).toBeTruthy();
    expect(getByText("Je n'ai pas de compte S'inscrire")).toBeTruthy();
  });

  it("should navigate to email screen when Email button is pressed", () => {
    const { getByText } = render(
      <NavigationContainer>
        <Login navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByText("Email"));
    expect(mockPush).toHaveBeenCalledWith("email");
  });

  it("should navigate to Inscription screen when Inscription text is pressed", () => {
    const { getByText } = render(
      <NavigationContainer>
        <Login navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByText("Je n'ai pas de compte S'inscrire"));
    expect(mockPush).toHaveBeenCalledWith("Inscription");
  });
});
