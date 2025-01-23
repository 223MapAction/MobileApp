import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from '../../components/TabNavigation';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Platform } from 'react-native';

// Mock des dépendances
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children, initialRouteName, ...props }) => (
      <div testID="tab-navigator" data-initial-route={initialRouteName} {...props}>
        {children}
      </div>
    ),
    Screen: ({ name, component: Component, options }) => (
      <div testID={`screen-${name.toLowerCase()}`}>
        {options?.tabBarIcon && 
          <div testID={`icon-${name.toLowerCase()}`}>
            {typeof options.tabBarIcon === 'function' && 
              options.tabBarIcon({ focused: true, color: '#000' })}
          </div>
        }
        <Component />
      </div>
    ),
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => <div testID="stack-navigator">{children}</div>,
    Screen: ({ name, component: Component, options }) => (
      <div testID={`stack-screen-${name.toLowerCase()}`}>
        {options?.header && options.header()}
        <Component />
      </div>
    ),
  }),
}));

jest.mock('../../shared/Icon', () => {
  return function MockIcon({ name, focused, size, color }) {
    return (
      <div 
        testID={`icon-${name}`} 
        data-focused={focused} 
        data-size={size} 
        data-color={color} 
      />
    );
  };
});

jest.mock('../../screens/newScreen/Dashboard', () => 'Dashboard');
jest.mock('../../screens/CameraScreen', () => 'Picture');
jest.mock('../../components/TabBar', () => 'TabBar');
jest.mock('../../components/ProfilStackNavigation', () => 'ProfilStackNavigation');
jest.mock('../../shared/Header', () => 'Header');

const mockStore = configureStore([]);

describe('TabNavigation Component', () => {
  let store;
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    store = mockStore({
      user: {
        token: 'test-token',
        user: { id: 1, name: 'Test User' }
      }
    });
    Platform.OS = 'ios';
    jest.clearAllMocks();
  });

  it('devrait rendre le composant avec la configuration initiale', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <TabNavigation navigation={mockNavigation} />
        </NavigationContainer>
      </Provider>
    );

    expect(getByTestId('tab-navigator')).toBeTruthy();
    expect(getByTestId('screen-dashboard')).toBeTruthy();
    expect(getByTestId('screen-camera')).toBeTruthy();
    expect(getByTestId('screen-profilstacknavigation')).toBeTruthy();
  });

  it('devrait rendre les icônes correctement', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <TabNavigation navigation={mockNavigation} />
        </NavigationContainer>
      </Provider>
    );

    expect(getByTestId('icon-home')).toBeTruthy();
    expect(getByTestId('icon-user')).toBeTruthy();
  });

  it('devrait gérer les props de navigation', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <TabNavigation navigation={mockNavigation} />
        </NavigationContainer>
      </Provider>
    );

    const tabNavigator = getByTestId('tab-navigator');
    expect(tabNavigator.getAttribute('data-initial-route')).toBe('Dashboard');
  });

  describe('renderIcon', () => {
    it('devrait rendre les icônes avec les bonnes props', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <NavigationContainer>
            <TabNavigation navigation={mockNavigation} />
          </NavigationContainer>
        </Provider>
      );

      const homeIcon = getByTestId('icon-home');
      expect(homeIcon.getAttribute('data-size')).toBe('24');
    });
  });

  describe('Platform specific behavior', () => {
    it('devrait gérer les styles spécifiques à iOS', () => {
      Platform.OS = 'ios';
      const { getByTestId } = render(
        <Provider store={store}>
          <NavigationContainer>
            <TabNavigation navigation={mockNavigation} />
          </NavigationContainer>
        </Provider>
      );

      expect(getByTestId('tab-navigator')).toBeTruthy();
    });

    it('devrait gérer les styles spécifiques à Android', () => {
      Platform.OS = 'android';
      const { getByTestId } = render(
        <Provider store={store}>
          <NavigationContainer>
            <TabNavigation navigation={mockNavigation} />
          </NavigationContainer>
        </Provider>
      );

      expect(getByTestId('tab-navigator')).toBeTruthy();
    });
  });

  describe('Stack Navigators', () => {
    it('devrait rendre DashboardStack correctement', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <NavigationContainer>
            <TabNavigation navigation={mockNavigation} />
          </NavigationContainer>
        </Provider>
      );

      expect(getByTestId('stack-navigator')).toBeTruthy();
      expect(getByTestId('stack-screen-dashboardstack')).toBeTruthy();
    });

    it('devrait rendre CameraStack correctement', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <NavigationContainer>
            <TabNavigation navigation={mockNavigation} />
          </NavigationContainer>
        </Provider>
      );

      expect(getByTestId('stack-screen-picture')).toBeTruthy();
    });
  });
});
