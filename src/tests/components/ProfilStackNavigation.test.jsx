import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ProfilStackNavigation from '../../components/ProfilStackNavigation';

// Mock des dépendances
jest.mock('@react-navigation/stack', () => {
  const actualNav = jest.requireActual('@react-navigation/stack');
  return {
    ...actualNav,
    createStackNavigator: () => ({
      Navigator: ({ children, initialRouteName }) => (
        <div testID="stack-navigator" data-initial-route={initialRouteName}>
          {children}
        </div>
      ),
      Screen: ({ name, component: Component, options }) => {
        const header = typeof options.header === 'function' ? options.header() : options.header;
        return (
          <div testID={`screen-${name.toLowerCase()}`}>
            <div testID="header-container">{header}</div>
            <Component />
          </div>
        );
      },
    }),
  };
});

jest.mock('../../shared/Header', () => {
  return function MockHeader({ navigation, title }) {
    return (
      <div testID="header" data-navigation={!!navigation} data-title={title} />
    );
  };
});

jest.mock('../../screens/newScreen/Profil', () => {
  return function MockProfil() {
    return <div testID="profil-component" />;
  };
});

describe('ProfilStackNavigation Component', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rendre le composant avec la configuration initiale', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfilStackNavigation navigation={mockNavigation} />
      </NavigationContainer>
    );

    const navigator = getByTestId('stack-navigator');
    expect(navigator).toBeTruthy();
    expect(navigator.getAttribute('data-initial-route')).toBe('Profil');
  });

  it('devrait rendre l\'écran Profil avec le bon header', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfilStackNavigation navigation={mockNavigation} />
      </NavigationContainer>
    );

    const profilScreen = getByTestId('screen-profil');
    expect(profilScreen).toBeTruthy();

    const header = getByTestId('header');
    expect(header).toBeTruthy();
    expect(header.getAttribute('data-title')).toBe('Mon profil');
    expect(header.getAttribute('data-navigation')).toBe('true');
  });

  it('devrait rendre le composant Profil', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfilStackNavigation navigation={mockNavigation} />
      </NavigationContainer>
    );

    const profilComponent = getByTestId('profil-component');
    expect(profilComponent).toBeTruthy();
  });

  it('devrait passer les props de navigation au Header', () => {
    const customNavigation = {
      ...mockNavigation,
      customProp: 'test'
    };

    const { getByTestId } = render(
      <NavigationContainer>
        <ProfilStackNavigation navigation={customNavigation} />
      </NavigationContainer>
    );

    const header = getByTestId('header');
    expect(header.getAttribute('data-navigation')).toBe('true');
  });

  it('devrait gérer le cycle de vie du composant', () => {
    const { unmount, getByTestId } = render(
      <NavigationContainer>
        <ProfilStackNavigation navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId('stack-navigator')).toBeTruthy();
    expect(getByTestId('screen-profil')).toBeTruthy();
    expect(getByTestId('header')).toBeTruthy();

    expect(() => unmount()).not.toThrow();
  });

  it('devrait gérer les props correctement', () => {
    const props = {
      navigation: mockNavigation,
      additionalProp: 'test'
    };

    const { rerender, getByTestId } = render(
      <NavigationContainer>
        <ProfilStackNavigation {...props} />
      </NavigationContainer>
    );

    expect(getByTestId('header').getAttribute('data-navigation')).toBe('true');

    const newProps = {
      ...props,
      additionalProp: 'updated'
    };

    rerender(
      <NavigationContainer>
        <ProfilStackNavigation {...newProps} />
      </NavigationContainer>
    );

    expect(getByTestId('header').getAttribute('data-navigation')).toBe('true');
  });
});
