import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DrawerContent, { DrawerRoute, DrawerGri, DrawerDeconnexion } from '../../components/DrawerContent';

// Mocks
jest.mock('@react-navigation/native', () => ({
  DrawerActions: {
    closeDrawer: jest.fn()
  }
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn()
}));

const mockStore = configureStore([]);

describe('DrawerContent Component', () => {
  let store;
  const mockNavigation = {
    dispatch: jest.fn(),
    navigate: jest.fn()
  };
  const mockState = { index: 0 };

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({
      user: {
        token: null
      }
    });
    console.log = jest.fn();
  });

  describe('Navigation et Rendu', () => {
    it('devrait naviguer vers une route et fermer le drawer', () => {
      const { getByText } = render(
        <Provider store={store}>
          <DrawerContent navigation={mockNavigation} state={mockState} />
        </Provider>
      );

      fireEvent.press(getByText('Nous contacter'));

      expect(mockNavigation.dispatch).toHaveBeenCalledWith(DrawerActions.closeDrawer());
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Contact', {});
    });

    it('devrait afficher le menu correctement', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <DrawerContent navigation={mockNavigation} state={mockState} />
        </Provider>
      );

      expect(getByTestId('menu')).toBeTruthy();
    });

    it('devrait afficher différents éléments selon le token', () => {
      store = mockStore({
        user: {
          token: 'test-token'
        }
      });

      const { getByText, queryByText } = render(
        <Provider store={store}>
          <DrawerContent navigation={mockNavigation} state={mockState} />
        </Provider>
      );

      expect(getByText('Déconnexion')).toBeTruthy();
      expect(getByText('Mes Incidents Signalés')).toBeTruthy();
      expect(queryByText('Se Connecter')).toBeNull();
    });
  });

  describe('Composants Drawer', () => {
    it('devrait rendre DrawerRoute correctement', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <DrawerRoute
          title="Test Route"
          icon="test-icon"
          onPress={onPress}
        />
      );

      const routeText = getByText('Test Route');
      fireEvent.press(routeText);

      expect(routeText).toBeTruthy();
      expect(onPress).toHaveBeenCalled();
    });

    it('devrait rendre DrawerGri correctement', () => {
      const { getByText } = render(
        <DrawerGri
          title="Test Grisé"
          icon="test-icon"
        />
      );

      expect(getByText('Test Grisé')).toBeTruthy();
    });

    it('devrait rendre DrawerDeconnexion correctement', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <DrawerDeconnexion
          title="Test Déconnexion"
          onPress={onPress}
        />
      );

      const decoText = getByText('Test Déconnexion');
      fireEvent.press(decoText);

      expect(decoText).toBeTruthy();
      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('devrait afficher l\'alerte de déconnexion', () => {
      store = mockStore({
        user: {
          token: 'test-token'
        }
      });

      const { getByText } = render(
        <Provider store={store}>
          <DrawerContent navigation={mockNavigation} state={mockState} />
        </Provider>
      );

      fireEvent.press(getByText('Déconnexion'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Confirmation',
        'Voulez-vous vraiment vous déconnecter ? ',
        expect.any(Array)
      );
    });

    it('devrait gérer la confirmation de déconnexion', () => {
      store = mockStore({
        user: {
          token: 'test-token'
        }
      });

      const { getByText } = render(
        <Provider store={store}>
          <DrawerContent navigation={mockNavigation} state={mockState} />
        </Provider>
      );

      fireEvent.press(getByText('Déconnexion'));
      
      // Simuler le clic sur "oui"
      Alert.alert.mock.calls[0][2][0].onPress();

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Logout');
    });

    it('devrait gérer l\'annulation de déconnexion', () => {
      store = mockStore({
        user: {
          token: 'test-token'
        }
      });

      const { getByText } = render(
        <Provider store={store}>
          <DrawerContent navigation={mockNavigation} state={mockState} />
        </Provider>
      );

      fireEvent.press(getByText('Déconnexion'));
      
      // Simuler le clic sur "Non"
      Alert.alert.mock.calls[0][2][1].onPress?.();

      expect(mockNavigation.navigate).not.toHaveBeenCalledWith('Logout');
    });
  });

  describe('Style et Mise en page', () => {
    it('devrait avoir les bons styles', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <DrawerContent navigation={mockNavigation} state={mockState} />
        </Provider>
      );

      const menu = getByTestId('menu');
      expect(menu.props.style).toMatchObject({
        color: '#38A3D0',
        fontSize: 20,
        marginLeft: 20
      });
    });
  });
});
