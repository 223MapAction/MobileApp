import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import Accueil from '../../slides/Acceuil'; 
import AppIntroSlider from 'react-native-app-intro-slider';
import Accueil from '../../slides/Acceuil';
jest.mock('react-native-app-intro-slider', () => {
  return jest.fn().mockImplementation(() => {
    return null;
  });
});

describe('Accueil Component', () => {
    it('renders correctly', () => {
        const { debug } = render(<Accueil navigation={createNavigationProp()} />);
        
        // Utilise debug pour inspecter la structure rendue
        debug();
    });
  const mockedNavigate = jest.fn();

  const createNavigationProp = () => ({
    replace: mockedNavigate,
    push: mockedNavigate,
  });

  
  it('renders correctly', async () => {
    const { getByTestId, getByText } = render(<Accueil navigation={createNavigationProp()} />);
    await waitFor(() => expect(getByTestId('inscrit')).toBeTruthy());
    await waitFor(() => expect(getByTestId('nextButton')).toBeTruthy());
    await waitFor(() => expect(getByTestId('doneButton')).toBeTruthy());
  });

  it('navigates to login on button press', () => {
    const { getByText } = render(<Accueil navigation={createNavigationProp()} />);
    
    fireEvent.press(getByText('Se connecter'));
    
    expect(mockedNavigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to cgu on done', () => {
    const { getByText, getByTestId } = render(<Accueil navigation={createNavigationProp()} />);
    
    fireEvent.press(getByTestId('doneButton'));
    
    expect(mockedNavigate).toHaveBeenCalledWith('cgu');
  });
});
