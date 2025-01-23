// Mock expo-sqlite avant l'import de App
jest.mock('expo-sqlite/next', () => ({
  openDatabaseSync: jest.fn(() => ({
    transaction: jest.fn(),
    exec: jest.fn(),
    close: jest.fn(),
  }))
}));

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
    useMigrations: jest.fn()
  }));
  
  jest.mock('../MainApp', () => 'MainApp');
  
  // Mock pour la base de données
  jest.mock('../db/client', () => ({
    db: {
      transaction: jest.fn(),
      exec: jest.fn(),
      close: jest.fn(),
    }
  }));
  
  describe("App component", () => {
    beforeEach(() => {
      // Reset tous les mocks avant chaque test
      jest.clearAllMocks();
    });
  
    it("should display migration in progress message", () => {
      // Simuler que la migration est toujours en cours
      useMigrations.mockReturnValue({ success: false, error: null });
  
      const { getByText } = render(<App />);
  
      expect(getByText("Migration en cours...")).toBeTruthy();
    });
  
    it("should display migration error message", () => {
      // Simuler une erreur dans la migration
      useMigrations.mockReturnValue({ 
        success: false, 
        error: { message: "Migration failed" } 
      });
  
      const { getByText } = render(<App />);
  
      expect(getByText("Migration erreur: Migration failed")).toBeTruthy();
    });
  
    it("should display MainApp when migration is successful", async () => {
      // Simuler une migration réussie
      useMigrations.mockReturnValue({ success: true, error: null });
  
      const { root } = render(<App />);
  
      // Attendre que le splash screen se cache et que MainApp se charge
      await waitFor(() => expect(SplashScreen.hideAsync).toHaveBeenCalled());
  
      expect(root).toBeTruthy();
    });

    it('devrait rendre le composant principal', () => {
      const { root } = render(<App />);
      expect(root).toBeTruthy();
    });
  });