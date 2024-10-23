import React from 'react';
import { render } from '@testing-library/react-native';
import Politique from '../../screens/politique'; 
import PolitiqueText from '../../screens/newScreen/PolitiqueText';
import { Text } from 'react-native'; 

jest.mock('react-native-markdown-display', () => {
  return ({ children }) => <>{children}</>; 
});

describe('Politique Component', () => {
  it('should render correctly and display the PolitiqueText', () => {
    const { getByText } = render(<Text>{PolitiqueText}</Text>);
    
  });
  
});
