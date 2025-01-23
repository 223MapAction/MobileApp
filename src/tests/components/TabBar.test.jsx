import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TabBar from '../../components/TabBar';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';

// Mock des dépendances
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient'
}));

jest.mock('react-native-elements', () => ({
  Icon: 'Icon'
}));

describe('TabBar Component', () => {
  const mockNavigation = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rendre correctement le composant', () => {
    const { getByTestId } = render(<TabBar navigation={mockNavigation} />);
    expect(getByTestId('tab-bar-button')).toBeTruthy();
  });

  it('devrait avoir le bon style pour LinearGradient', () => {
    const { UNSAFE_getByType } = render(<TabBar navigation={mockNavigation} />);
    const gradient = UNSAFE_getByType(LinearGradient);
    
    expect(gradient.props.colors).toEqual(['#4CF284', '#09AB3F']);
    expect(gradient.props.style).toEqual({
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      width: 60,
      height: 60,
      marginTop: -20,
    });
  });

  it('devrait avoir la bonne configuration pour l\'icône', () => {
    const { UNSAFE_getByType } = render(<TabBar navigation={mockNavigation} />);
    const icon = UNSAFE_getByType(Icon);
    
    expect(icon.props).toEqual({
      name: 'camera',
      type: 'feather',
      size: 25,
      color: '#FFF'
    });
  });

  it('devrait naviguer vers Picture lors du clic', () => {
    const { getByTestId } = render(<TabBar navigation={mockNavigation} />);
    
    fireEvent.press(getByTestId('tab-bar-button'));
    expect(mockNavigation.push).toHaveBeenCalledWith('Picture');
  });
});
