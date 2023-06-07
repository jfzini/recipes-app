import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/renderWithRouter';

describe('Test if Footer component is working correctly', () => {
  it('should work correctly on meals page', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/meals');

    expect(history.location.pathname).toBe('/meals');
    const drinkBtn = screen.getByRole('img', { name: /drink page/i });
    const mealBtn = screen.getByRole('img', { name: /meal page/i });

    userEvent.click(drinkBtn);
    expect(history.location.pathname).toBe('/drinks');
    userEvent.click(mealBtn);
    expect(history.location.pathname).toBe('/meals');
  });
});
