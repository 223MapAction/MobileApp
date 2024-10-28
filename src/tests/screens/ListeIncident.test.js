import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ListIncident from '../../screens/ListeIncident';
import { NavigationContainer } from '@react-navigation/native';
import { useRoute, useNavigation } from '@react-navigation/native';

const mockStore = configureStore([]);
jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn(),
    useNavigation: jest.fn(),
}));
describe('ListIncident', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      incidents: [
        {
          id: '1',
          title: 'Woulouloudji',
          zone: 'Sabalibougou Courani',
          photo: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
          created_at: new Date().toISOString(),
          user_id: '123',
          etat: 'resolved',
        },
      ],
    });
    useNavigation.mockReturnValue({ navigate: jest.fn() });
  });
  const navigation = useNavigation();

  it('affiche le message de chargement lorsque la liste est vide', () => {
    store = mockStore({ incidents: [] });
    const { getByTestId } = render(
      <Provider store={store}>
        <ListIncident />
      </Provider>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('affiche les incidents et leurs détails', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ListIncident />
        </NavigationContainer>
      </Provider>
    );

    expect(getByText('Woulouloudji')).toBeTruthy();
    expect(getByText('Sabalibougou Courani')).toBeTruthy();
    expect(getByText('Résolu')).toBeTruthy();
  });

  it('navigue vers le détail d\'un incident au clic', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ListIncident />
        </NavigationContainer>
      </Provider>
    );

    fireEvent.press(getByText('Woulouloudji'));

    expect(navigation.navigate).toHaveBeenCalledWith('DetailIncident', { incident: store.incidents[0] });
  });

  it('ajoute un nouvel incident lorsque le bouton est cliqué', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ListIncident />
        </NavigationContainer>
      </Provider>
    );

    fireEvent.press(getByText('Nouvel Incident'));

    expect(navigation.navigate).toHaveBeenCalledWith('Picture');
  });
});
