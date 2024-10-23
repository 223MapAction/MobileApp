import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Cgu from '../../screens/cgu' 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

// Mock de la navigation
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));

describe('Cgu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear.mockClear(); // Réinitialise le mock de clear
    AsyncStorage.getItem.mockReset(); // Réinitialise les valeurs retournées par getItem
  });

  it('should show loading indicator initially', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Cgu />
      </NavigationContainer>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should navigate to DrawerNavigation if CGU accepted', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('true'); // Simule que les CGU ont été acceptées

    render(
      <NavigationContainer>
        <Cgu />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('DrawerNavigation');
    });
  });

  it('should display the CGU text when not accepted', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null); // Simule que les CGU n'ont pas été acceptées

    const { getByText } = render(
      <NavigationContainer>
        <Cgu />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText(/Accepter/i)).toBeTruthy();
      expect(getByText(/Refuser/i)).toBeTruthy();
    });
  });

  it('should save acceptance in AsyncStorage and navigate to DrawerNavigation on accept', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null); // Simule que les CGU n'ont pas été acceptées

    const { getByText } = render(
      <NavigationContainer>
        <Cgu />
      </NavigationContainer>
    );

    fireEvent.press(getByText(/Accepter/i));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('acceptedCgu', 'true');
      expect(mockNavigate).toHaveBeenCalledWith('DrawerNavigation');
    });
  });

  it('should navigate to Welcome on decline', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Cgu />
      </NavigationContainer>
    );

    fireEvent.press(getByText(/Refuser/i));

    expect(mockNavigate).toHaveBeenCalledWith('Welcome');
  });
});