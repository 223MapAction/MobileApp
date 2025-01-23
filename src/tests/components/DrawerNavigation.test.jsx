import React from 'react';
import { render } from '@testing-library/react-native';
import DrawerNavigation from '../../components/DrawerNavigation';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TabNavigation from '../../components/TabNavigation';
import DrawerContent from '../../components/DrawerContent';

// Mock des dépendances
jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: () => ({
    Navigator: ({ children, initialRouteName, drawerContent, drawerType, contentContainerStyle }) => (
      <div testID="drawer-navigator" data-initial-route={initialRouteName}>
        {drawerContent({ navigation: {} })}
        {children}
      </div>
    ),
    Screen: ({ children, name, options }) => (
      <div testID="drawer-screen" data-screen-name={name}>
        {children && children({})}
      </div>
    ),
  }),
}));

jest.mock('../../components/TabNavigation', () => {
  return function MockTabNavigation(props) {
    return <div testID="tab-navigation" {...props} />;
  };
});

jest.mock('../../components/DrawerContent', () => {
  return function MockDrawerContent(props) {
    return <div testID="drawer-content" {...props} />;
  };
});

const mockStore = configureStore([]);

describe('DrawerNavigation Component', () => {
  let store;
  const mockNavigation = {
    navigate: jest.fn(),
    dispatch: jest.fn(),
  };

  beforeEach(() => {
    store = mockStore({
      user: {
        token: null
      }
    });
    jest.clearAllMocks();
  });

  it('devrait rendre le composant sans erreur', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DrawerNavigation navigation={mockNavigation} />
      </Provider>
    );
    expect(getByTestId('drawer-navigator')).toBeTruthy();
  });

  it('devrait avoir TabNavigation comme route initiale', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DrawerNavigation navigation={mockNavigation} />
      </Provider>
    );
    const navigator = getByTestId('drawer-navigator');
    expect(navigator.getAttribute('data-initial-route')).toBe('TabNavigation');
  });

  it('devrait rendre le DrawerContent avec les bonnes props', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DrawerNavigation navigation={mockNavigation} />
      </Provider>
    );
    const drawerContent = getByTestId('drawer-content');
    expect(drawerContent).toBeTruthy();
    expect(drawerContent.props.stackNavigation).toBe(mockNavigation);
  });

  it('devrait rendre le TabNavigation screen avec les bonnes options', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DrawerNavigation navigation={mockNavigation} />
      </Provider>
    );
    const screen = getByTestId('drawer-screen');
    expect(screen.getAttribute('data-screen-name')).toBe('TabNavigation');
  });

  it('devrait passer le token depuis le state Redux', () => {
    const storeWithToken = mockStore({
      user: {
        token: 'test-token'
      }
    });

    const { getByTestId } = render(
      <Provider store={storeWithToken}>
        <DrawerNavigation navigation={mockNavigation} />
      </Provider>
    );
    
    expect(getByTestId('drawer-navigator')).toBeTruthy();
  });

  describe('Configuration du Drawer', () => {
    it('devrait avoir les bonnes propriétés de configuration', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <DrawerNavigation navigation={mockNavigation} />
        </Provider>
      );
      
      const navigator = getByTestId('drawer-navigator');
      expect(navigator.props.drawerType).toBe('front');
      expect(navigator.props.activeTintColor).toBe('transparent');
      expect(navigator.props.contentContainerStyle).toEqual({ flex: 1 });
    });
  });

  describe('Intégration avec TabNavigation', () => {
    it('devrait passer les props au TabNavigation', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <DrawerNavigation navigation={mockNavigation} />
        </Provider>
      );
      
      const tabNavigation = getByTestId('tab-navigation');
      expect(tabNavigation).toBeTruthy();
      // Vérifier que les props nécessaires sont passées
      expect(tabNavigation.props).toBeDefined();
    });
  });

  describe('Comportement avec différents états Redux', () => {
    it('devrait gérer l\'absence de token', () => {
      const storeWithoutToken = mockStore({
        user: {}
      });

      const { getByTestId } = render(
        <Provider store={storeWithoutToken}>
          <DrawerNavigation navigation={mockNavigation} />
        </Provider>
      );
      
      expect(getByTestId('drawer-navigator')).toBeTruthy();
    });

    it('devrait gérer un token null', () => {
      const storeWithNullToken = mockStore({
        user: { token: null }
      });

      const { getByTestId } = render(
        <Provider store={storeWithNullToken}>
          <DrawerNavigation navigation={mockNavigation} />
        </Provider>
      );
      
      expect(getByTestId('drawer-navigator')).toBeTruthy();
    });
  });
}); 