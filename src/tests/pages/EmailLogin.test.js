import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import EmailLogin from '../../pages/EmailLogin'; 
import { login } from '../../api/auth'; 
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../../api/auth'); 

describe('EmailLogin Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <NavigationContainer>
                <EmailLogin />
            </NavigationContainer>
        );
    };

    it('should render correctly', () => {
        renderComponent(); 

        expect(screen.getByTestId('login-button')).toBeTruthy();
        expect(screen.getByPlaceholderText('Email')).toBeTruthy();
        expect(screen.getByPlaceholderText('Mot de passe')).toBeTruthy();
        expect(screen.getByText("S'inscrire")).toBeTruthy();
    });

    it('should handle email and password input', () => {
        renderComponent(); 

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Mot de passe');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password123');

        expect(emailInput.props.value).toBe('test@example.com');
        expect(passwordInput.props.value).toBe('password123');
    });

    it('should show error message on invalid form submission', async () => {
        renderComponent(); 

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Mot de passe');
        const submitButton = screen.getByTestId('login-button');

        fireEvent.changeText(emailInput, 'invalid-email');
        fireEvent.changeText(passwordInput, '123');

        fireEvent.press(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Erreur')).toBeTruthy(); 
        });
    });

    it('should call login function on valid form submission', async () => {
        login.mockResolvedValueOnce({ status: 200 }); 
    
        renderComponent(); 
    
        fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(screen.getByPlaceholderText('Mot de passe'), 'password123');
    
        const submitButton = screen.getByTestId('login-button');
    
        fireEvent.press(submitButton);
    
        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });
});
