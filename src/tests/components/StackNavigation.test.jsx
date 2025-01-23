import React from 'react';
import { render } from '@testing-library/react-native';
import StackNavigation from '../../components/StackNavigation';

// Mock expo-sqlite
jest.mock('expo-sqlite/next', () => ({
  openDatabaseSync: jest.fn(() => ({
    transaction: jest.fn(),
    exec: jest.fn(),
    close: jest.fn(),
  }))
}));

// Mock minimal nécessaire
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  createNavigatorFactory: () => jest.fn(),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
}));

// Mock pour @react-navigation/drawer
jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
}));

describe('StackNavigation Component', () => {
  it('devrait se rendre sans erreur', () => {
    const { root } = render(<StackNavigation />);
    expect(root).toBeTruthy();
  });
}); 