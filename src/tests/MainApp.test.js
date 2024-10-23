import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../MainApp'; 

describe('App', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<App />);
    
    const appContainer = getByTestId('app-container');
    expect(appContainer).toBeTruthy();

    const toast = getByTestId('toast');
    expect(toast).toBeTruthy();
    
  });
});
