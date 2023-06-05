import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

describe('Test if Login page if working correctly', () => {
  it('should render all the elements', async () => {
    const { history } = renderWithRouter(<App />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-submit-btn');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeDisabled();

    userEvent.type(emailInput, 'testdeemailinvalido');
    userEvent.type(passwordInput, '1234567');
    expect(loginButton).toBeDisabled();

    userEvent.clear(emailInput);
    userEvent.clear(passwordInput);

    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, '123456');
    expect(loginButton).toBeDisabled();

    userEvent.clear(emailInput);
    userEvent.clear(passwordInput);

    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, '1234567');
    expect(loginButton).toBeEnabled();

    userEvent.click(loginButton);

    const { pathname } = history.location;
    expect(pathname).toBe('/meals');
  });
});
