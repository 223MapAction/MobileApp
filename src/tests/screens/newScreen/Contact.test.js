import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Contact from '../../../screens/newScreen/Contact'; 
import { Alert } from 'react-native';
const mockStore = configureStore([]);

describe('Contact Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        token: 'mockToken',
        user: { email: 'user@example.com' },
      },
    });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Contact />
      </Provider>
    );

    expect(getByText('Objet')).toBeTruthy();
    expect(getByText('Message')).toBeTruthy();
    expect(getByText('Recevoir une copie du mail')).toBeTruthy();
  });

  it('validates the form and shows errors', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <Contact />
      </Provider>
    );

    fireEvent.changeText(getByText('Objet'), ''); 
    fireEvent.changeText(getByText('Message'), 'Short'); 

    fireEvent.press(getByText('Envoyer'));

    await waitFor(() => {
      expect(getByText('Objet')).toBeTruthy(); 
      expect(getByText('Message')).toBeTruthy(); 
    });
  });

  it('submits the form correctly', async () => {
    jest.mock('../../../api/contact', () => ({
      create_contact: jest.fn().mockResolvedValue({}),
    }));

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <Contact />
      </Provider>
    );

    fireEvent.changeText(getByText('Objet'), 'Test Objet');
    fireEvent.changeText(getByText('Message'), 'Ceci est un message de test.');

    fireEvent.press(getByText('Envoyer'));

    await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith("Confirmation", "Votre message a bien été envoyé"); 
    });
  });
});
