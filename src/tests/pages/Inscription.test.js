import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Inscription from '../../pages/Inscription'; 
import { register } from '../../api/auth';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('../../api/auth'); 

const mockStore = configureStore([]);

describe('Inscription', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}> {/* Ajoutez le Provider ici */}
        <NavigationContainer>
          <Inscription />
        </NavigationContainer>
      </Provider>
    );
  };

  it('affiche des erreurs de validation lorsque les champs obligatoires sont vides', async () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    fireEvent.press(getByText("Créer un compte")); 

    await waitFor(() => {
      expect(getByPlaceholderText("Prénom")).toBeTruthy(); 
      expect(getByPlaceholderText("Nom")).toBeTruthy(); 
      expect(getByPlaceholderText("Votre Adresse")).toBeTruthy(); 
      expect(getByPlaceholderText("Mot de passe")).toBeTruthy(); 
      expect(getByPlaceholderText("Confirmer mot de passe")).toBeTruthy(); 
    });
  });

  it('appelle la fonction register lorsque le formulaire est soumis avec des données valides', async () => {
    register.mockResolvedValueOnce({ user: { id: 10, email: 'test@example.com' }, token: { access: 'fake-token' } });

    const { getByPlaceholderText, getByText } = renderComponent();

    // Remplir le formulaire
    fireEvent.changeText(getByPlaceholderText("Prénom"), "John");
    fireEvent.changeText(getByPlaceholderText("Nom"), "Doe");
    fireEvent.changeText(getByPlaceholderText("N° de téléphone"), "1234567890");
    fireEvent.changeText(getByPlaceholderText("Adresse mail"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Mot de passe"), "password");
    fireEvent.changeText(getByPlaceholderText("Confirmer mot de passe"), "password");

    fireEvent.press(getByText("Créer un compte")); 

    await waitFor(() => {
      expect(register).toHaveBeenCalledTimes(1); 
    });
  });
});
