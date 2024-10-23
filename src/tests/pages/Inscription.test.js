import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Inscription from '../../pages/Inscription'; 
import { register } from '../../api/auth';

jest.mock('../../api/auth'); 

describe('Inscription', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche des erreurs de validation lorsque les champs obligatoires sont vides', async () => {
    const { getByPlaceholderText, getByText } = render(<Inscription />);

    fireEvent.press(getByText("Créer un compte")); 

    await waitFor(() => {
      expect(getByText("Prénom est requis")).toBeTruthy(); 
      expect(getByText("Nom est requis")).toBeTruthy(); 
      expect(getByText("Adresse Mail est requis")).toBeTruthy(); 
      expect(getByText("Mot De Passe est requis")).toBeTruthy(); 
      expect(getByText("Confirmer mot de passe est requis")).toBeTruthy(); 
    });
  });

  it('appelle la fonction register lorsque le formulaire est soumis avec des données valides', async () => {
    register.mockResolvedValueOnce({ user: { id: 1, email: 'test@example.com' }, token: { access: 'fake-token' } });

    const { getByPlaceholderText, getByText } = render(<Inscription />);

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
