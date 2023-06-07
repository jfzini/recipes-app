import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouter';
import App from '../App';

describe('Test if Login page if working correctly', () => {
  it('should render all the header elements', async () => {
    const { history } = renderWithRouterAndContext(<App />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-submit-btn');
    const pageTitleID = 'page-title';

    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, '1234567');
    userEvent.click(loginButton);

    // rendering Recipes page

    const searchButton = screen.getByTestId('search-top-btn');
    expect(screen.getByTestId(pageTitleID)).toHaveTextContent('Meals');
    expect(searchButton).toBeInTheDocument();
    expect(screen.getByTestId('profile-top-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();

    userEvent.click(searchButton);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();

    await waitFor(() => {
      history.push('/drinks');
      expect(screen.getByTestId(pageTitleID)).toHaveTextContent('Drinks');
    });

    await waitFor(() => {
      history.push('/profile');
      expect(screen.getByTestId(pageTitleID)).toHaveTextContent('Profile');
    });

    await waitFor(() => {
      history.push('/done-recipes');
      expect(screen.getByTestId(pageTitleID)).toHaveTextContent('Done Recipes');
    });

    await waitFor(() => {
      history.push('/favorite-recipes');
      expect(screen.getByTestId(pageTitleID)).toHaveTextContent('Favorite Recipes');
    });

    userEvent.click(screen.getByTestId('profile-top-btn'));
    expect(history.location.pathname).toBe('/profile');
  });
});
