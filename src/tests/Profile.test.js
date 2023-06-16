import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/renderWithRouter';

describe('Test if Login page is working correctly', () => {
  it('should render all the elements', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-submit-btn');

    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, '1234567');

    userEvent.click(loginButton);

    const { pathname } = history.location;
    expect(pathname).toBe('/meals');

    userEvent.click(screen.getByTestId('profile-top-btn'));
    expect(history.location.pathname).toBe('/profile');

    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByTestId('profile-email')).toHaveTextContent('test@test.com');

    userEvent.click(screen.getByTestId('profile-done-btn'));
    expect(history.location.pathname).toBe('/done-recipes');

    history.push('/profile');
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
    });

    await waitFor(() => {
      userEvent.click(screen.getByTestId('profile-favorite-btn'));
      expect(history.location.pathname).toBe('/favorite-recipes');
    });

    history.push('/profile');

    await waitFor(() => {
      userEvent.click(screen.getByTestId('profile-logout-btn'));
      expect(history.location.pathname).toBe('/');
    });
  });
});
