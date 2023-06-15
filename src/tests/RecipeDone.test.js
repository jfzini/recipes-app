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

  // const drinkPathname = '/drinks/15997';
  const mealPathname = '/meals/52977';
  const firstRecipeBtnID = '0-recipe-button';
  // const whiteHeartIcon = 'http://localhost/whiteHeartIcon.svg';
  // const blackHeartIcon = 'http://localhost/blackHeartIcon.svg';

  it('ready meal should work correctly', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/meals');
    await waitFor(() => {
      const firstRecipeButton = screen.getByTestId(firstRecipeBtnID);
      userEvent.click(firstRecipeButton);
    });
    expect(history.location.pathname).toBe(mealPathname);
    await waitFor(() => {
      const startBtn = screen.getByRole('button', { name: /start recipe/i });
      userEvent.click(startBtn);
    });
    expect(history.location.pathname).toBe('/meals/52977/in-progress');
    await waitFor(() => {
      const checkBoxes = screen.getAllByRole('checkbox');
      expect(checkBoxes.length).toBe(13);
      checkBoxes.forEach((checkBox) => {
        userEvent.click(checkBox);
      });
    });
    const finishBtn = screen.getByTestId(/finish-recipe-btn/);

    // adding a drink to doneRecipes
    localStorage.setItem('doneRecipes', JSON.stringify([{
      id: '15997',
      type: 'drink',
      nationality: '',
      category: 'Ordinary Drink',
      alcoholicOrNot: 'Optional alcohol',
      name: 'GG',
      image: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg',
      doneDate: '2023-06-15T22:36:53.190Z',
      tags: [],
    }]));

    userEvent.click(finishBtn);
    expect(history.location.pathname).toBe('/done-recipes');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /done recipes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /profile-icon/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /meals/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /drinks/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /corba/i })).toBeInTheDocument();
      expect(screen.getByText(/turkish - side/i)).toBeInTheDocument();
      expect(screen.getByText(/corba/i)).toBeInTheDocument();
      const storage = JSON.parse(localStorage.getItem('doneRecipes'));
      const { doneDate } = storage[0];
      expect(screen.getByText(doneDate)).toBeInTheDocument();
      expect(screen.getByText(/soup/i)).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /share/i })).toHaveLength(2);
    });

    // testing clipboard

    const shareBtnDrink = screen.getAllByRole('button', { name: /share/i })[0];
    userEvent.click(shareBtnDrink);
    expect(screen.getByText(/link copied!/i)).toBeInTheDocument();

    const shareBtnMeal = screen.getAllByRole('button', { name: /share/i })[1];
    userEvent.click(shareBtnMeal);
    expect(screen.getByText(/link copied!/i)).toBeInTheDocument();

    // testing filters
    userEvent.click(screen.getByRole('button', { name: /drinks/i }));

    await waitFor(() => {
      expect(screen.queryByRole('img', { name: /corba/i })).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /meals/i }));

    await waitFor(() => {
      expect(screen.queryByRole('img', { name: /corba/i })).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /all/i }));

    await waitFor(() => {
      expect(screen.queryByRole('img', { name: /corba/i })).toBeInTheDocument();
    });

    // testing redirects

    const mealRedirectButtons = screen.getAllByRole('button', { name: /corba/i });
    expect(mealRedirectButtons).toHaveLength(2);

    userEvent.click(mealRedirectButtons[0]);
    expect(history.location.pathname).toBe('/meals/52977');

    history.push('/done-recipes');

    await waitFor(() => {
      userEvent.click(screen.getByTestId('0-horizontal-name-button'));
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe('/drinks/15997');
    });
  });
});
