import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cgu from '../../screens/cgu';

// Mocks
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('react-native-markdown-display', () => 'Markdown');
jest.mock('../../screens/newScreen/cguText', () => 'Test CGU Content');

describe('Cgu Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe('useEffect et checkCgu', () => {
    it('devrait rediriger vers DrawerNavigation si les CGU sont déjà acceptées', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('true');
      
      await act(async () => {
        render(<Cgu />);
      });

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('acceptedCgu');
      expect(mockNavigate).toHaveBeenCalledWith('DrawerNavigation');
    });

    it('devrait afficher le loader pendant la vérification', async () => {
      AsyncStorage.getItem.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      const { getByTestId } = render(<Cgu />);
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('devrait gérer les erreurs de AsyncStorage', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage Error'));
      
      await act(async () => {
        render(<Cgu />);
      });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('handleAccept', () => {
    it('devrait enregistrer l\'acceptation et naviguer', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      const { getByText } = render(<Cgu />);

      await act(async () => {
        fireEvent.press(getByText('Accepter'));
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('acceptedCgu', 'true');
      expect(mockNavigate).toHaveBeenCalledWith('DrawerNavigation');
    });

    it('devrait gérer les erreurs lors de l\'acceptation', async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Save Error'));
      const { getByText } = render(<Cgu />);

      await act(async () => {
        fireEvent.press(getByText('Accepter'));
      });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('handleDecline', () => {
    it('devrait naviguer vers Welcome', () => {
      const { getByText } = render(<Cgu />);
      
      fireEvent.press(getByText('Refuser'));
      
      expect(mockNavigate).toHaveBeenCalledWith('Welcome');
    });
  });

  describe('Rendu du composant', () => {
    it('devrait rendre le contenu Markdown', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const { getByTestId } = await act(async () => {
        return render(<Cgu />);
      });

      expect(getByTestId('cgu-markdown')).toBeTruthy();
    });

    it('devrait avoir les bons styles', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const { getByTestId } = await act(async () => {
        return render(<Cgu />);
      });

      const container = getByTestId('cgu-container');
      expect(container.props.style).toMatchObject({
        flex: 1,
        backgroundColor: '#fff'
      });
    });
  });
});