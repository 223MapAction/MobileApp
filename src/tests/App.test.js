import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import App from "../../App"; 
import * as SplashScreen from "expo-splash-screen";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Text } from "react-native";
jest.mock("expo-splash-screen", () => ({
    preventAutoHideAsync: jest.fn(),
    hideAsync: jest.fn(),
}));
  
  // Mock de useMigrations
  jest.mock("drizzle-orm/expo-sqlite/migrator", () => ({
    useMigrations: jest.fn(),
  }));
  
  
  
  describe("App component", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Réinitialiser les mocks après chaque test
    });
  
    it("should display migration in progress message", () => {
      // Simuler que la migration est toujours en cours
      useMigrations.mockReturnValue({ success: false, error: null });
  
      const { getByText } = render(<App />);
  
      expect(getByText("Migration is in progress...")).toBeTruthy();
    });
  
    it("should display migration error message", () => {
      // Simuler une erreur dans la migration
      useMigrations.mockReturnValue({ success: false, error: { message: "Migration failed" } });
  
      const { getByText } = render(<App />);
  
      expect(getByText("Migration error: Migration failed")).toBeTruthy();
    });
  
    it("should display MainApp when migration is successful", async () => {
      // Simuler une migration réussie
      useMigrations.mockReturnValue({ success: true, error: null });
  
      const { getByText } = render(<App />);
  
      // Attendre que le splash screen se cache et que MainApp se charge
      await waitFor(() => expect(SplashScreen.hideAsync).toHaveBeenCalled());
  
      expect(getByText("MainApp Loaded")).toBeTruthy();
    });
  });