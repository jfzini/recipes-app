import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/renderWithRouter';
import { fetch } from './mocks/mockImplementation';

describe('Test if RecipeDone page is working correctly', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(fetch);
    navigator.clipboard = {
      writeText: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const favoriteURL = '/favorite-recipes';

  it('ready meal should work correctly', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/meals');

    // adding favorite recipes to localStorage
    localStorage.setItem('favoriteRecipes', JSON.stringify([
      {
        id: '52977',
        type: 'meal',
        nationality: 'Turkish',
        category: 'Side',
        alcoholicOrNot: '',
        name: 'Corba',
        image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
      },
      {
        id: '15997',
        type: 'drink',
        nationality: '',
        category: 'Ordinary Drink',
        alcoholicOrNot: 'Optional alcohol',
        name: 'GG',
        image: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg',
      },
    ]));

    history.push(favoriteURL);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /favorite recipes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /profile-icon/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /meals/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /drinks/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /corba/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /GG/i })).toBeInTheDocument();
      expect(screen.getByText(/turkish - side/i)).toBeInTheDocument();
      expect(screen.getByText(/corba/i)).toBeInTheDocument();
      expect(screen.getByText(/optional alcohol/i)).toBeInTheDocument();
      expect(screen.getByText(/gg/i)).toBeInTheDocument();
      const shareBtns = screen.getAllByRole('button', { name: /share/i });
      expect(shareBtns).toHaveLength(2);
      const favoriteBtns = screen.getAllByRole('button', { name: /favorite icon/i });
      expect(favoriteBtns).toHaveLength(2);
      const favoriteIcons = screen.getAllByRole('img', { name: /favorite/i });
      expect(favoriteIcons).toHaveLength(2);
      favoriteIcons.forEach((icon) => {
        expect(icon.src).toContain('blackHeartIcon');
      });
    });

    // testing clipboard

    const shareBtnDrink = screen.getAllByRole('button', { name: /share/i })[0];
    userEvent.click(shareBtnDrink);
    expect(screen.getByText(/link copied!/i)).toBeInTheDocument();

    const shareBtnMeal = screen.getAllByRole('button', { name: /share/i })[1];
    userEvent.click(shareBtnMeal);
    expect(screen.getByText(/link copied!/i)).toBeInTheDocument();

    // testing filters

    userEvent.click(screen.getByRole('button', { name: /meals/i }));
    expect(screen.getByRole('img', { name: /corba/i })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /GG/i })).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /drinks/i }));
    expect(screen.queryByRole('img', { name: /corba/i })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: /GG/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /all/i }));
    expect(screen.getByRole('img', { name: /corba/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /GG/i })).toBeInTheDocument();

    // testing redirect

    const mealRedirectButtons = screen.getAllByRole('button', { name: /corba/i });
    expect(mealRedirectButtons).toHaveLength(2);

    userEvent.click(mealRedirectButtons[0]);
    expect(history.location.pathname).toBe('/meals/52977');

    history.push(favoriteURL);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('0-horizontal-name-button'));
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe('/meals/52977');
    });

    history.push(favoriteURL);

    await waitFor(() => {
      const drinkRedirectButtons = screen.getAllByRole('button', { name: /gg/i });
      expect(drinkRedirectButtons).toHaveLength(2);
      userEvent.click(drinkRedirectButtons[0]);
      expect(history.location.pathname).toBe('/drinks/15997');
    });

    history.push(favoriteURL);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('1-horizontal-name-button'));
      expect(history.location.pathname).toBe('/drinks/15997');
    });

    // testing favorite button

    history.push(favoriteURL);

    await waitFor(() => {
      const favoriteBtns = screen.getAllByRole('button', { name: /favorite icon/i });
      userEvent.click(favoriteBtns[0]);
      expect(screen.queryByRole('img', { name: /corba/i })).not.toBeInTheDocument();
    });

    // testing profile button

    userEvent.click(screen.getByRole('button', { name: /profile-icon/i }));
    expect(history.location.pathname).toBe('/profile');
  });
});
