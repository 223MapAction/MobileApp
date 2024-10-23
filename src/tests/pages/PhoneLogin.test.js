import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PhoneLogin from '../../pages/PhoneLogin'; 

describe('PhoneLogin Component', () => {
    test('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<PhoneLogin />);
        
        expect(getByText('Login')).toBeTruthy();
        
        expect(getByPlaceholderText('Numéro de téléphone')).toBeTruthy();
        
        expect(getByText('Se connecter')).toBeTruthy();
    });

    test('updates number input value', () => {
        const { getByPlaceholderText } = render(<PhoneLogin />);
        
        const input = getByPlaceholderText('Numéro de téléphone');

        fireEvent.changeText(input, '123456789');

        expect(input.props.value).toBe('123456789');
    });
});
