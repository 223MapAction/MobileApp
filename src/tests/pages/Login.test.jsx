import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../../pages/Login';

// Mock de useNavigation
const mockPush = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    push: mockPush,
  }),
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('devrait rendre correctement tous les éléments', () => {
    const { getByText, getByTestId } = render(<Login />);
    
    // Vérifier les textes
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Se connecter avec')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Numéro de Téléphone')).toBeTruthy();
    expect(getByText('Réseaux sociaux')).toBeTruthy();
    expect(getByText("Je n'ai pas de compte")).toBeTruthy();
    expect(getByText("S'inscrire")).toBeTruthy();
  });

  it('devrait naviguer vers la page email lors du clic sur le bouton Email', () => {
    const { getByText } = render(<Login />);
    const emailButton = getByText('Email');
    
    fireEvent.press(emailButton);
    expect(mockPush).toHaveBeenCalledWith('email');
  });

  it('devrait naviguer vers la page phone lors du clic sur le bouton Numéro de Téléphone', () => {
    const { getByText } = render(<Login />);
    const phoneButton = getByText('Numéro de Téléphone');
    
    fireEvent.press(phoneButton);
    expect(mockPush).toHaveBeenCalledWith('phone');
  });

  it('devrait naviguer vers la page social_login lors du clic sur le bouton Réseaux sociaux', () => {
    const { getByText } = render(<Login />);
    const socialButton = getByText('Réseaux sociaux');
    
    fireEvent.press(socialButton);
    expect(mockPush).toHaveBeenCalledWith('social_login');
  });

  it('devrait naviguer vers la page Inscription lors du clic sur le lien S\'inscrire', () => {
    const { getByText } = render(<Login />);
    const registerLink = getByText("S'inscrire");
    
    fireEvent.press(registerLink);
    expect(mockPush).toHaveBeenCalledWith('Inscription');
  });

  it('devrait avoir les styles corrects pour les boutons', () => {
    const { getAllByText } = render(<Login />);
    const buttons = getAllByText(/(Email|Numéro de Téléphone|Réseaux sociaux)/);
    
    buttons.forEach(button => {
      const buttonStyle = button.parent.props.style;
      expect(buttonStyle).toMatchObject({
        backgroundColor: '#38A0DB',
        borderRadius: 20,
      });
    });
  });

  it('devrait avoir le logo avec les bonnes dimensions', () => {
    const { UNSAFE_getByProps } = render(<Login />);
    const logo = UNSAFE_getByProps({ 
      source: require('../../../assets/images/logo.webp') 
    });
    
    expect(logo.props.style).toMatchObject({
      width: 110,
      height: 45,
    });
  });

  it('devrait avoir le rectangle décoratif avec la bonne rotation', () => {
    const { getByTestId } = render(<Login />);
    const rectangle = getByTestId('rectangle-decoratif');
    
    expect(rectangle.props.style).toMatchObject({
      backgroundColor: '#38A0DB',
      transform: [{ rotate: '54deg' }],
    });
  });
}); 