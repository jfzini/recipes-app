import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/renderWithRouter';
import { fetch } from './mocks/mockImplementation';

describe('Test if RecipeDone page is working correctly', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(fetch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const drinkPathname = '/drinks/15997';
  const mealPathname = '/meals/52977';
  const firstRecipeBtnID = '0-recipe-button';
  const whiteHeartIcon = 'http://localhost/whiteHeartIcon.svg';
  const blackHeartIcon = 'http://localhost/blackHeartIcon.svg';

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
      expect(screen.getByRole('heading', { name: /corba/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /corba/i })).toHaveProperty('src', 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg');
      expect(screen.getByRole('button', { name: /share icon/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /favorite icon/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /favorite icon/i })).toHaveProperty('src', whiteHeartIcon);
      expect(screen.getByTestId('recipe-category')).toHaveTextContent('Side');
      expect(screen.getByText(/lentils - 1 cup/i)).toBeInTheDocument();
      const firstIngredientCheckbox = screen.getByRole('checkbox', { name: /lentils - 1 cup/i });
      expect(firstIngredientCheckbox).not.toBeChecked();
      userEvent.click(firstIngredientCheckbox);
      expect(firstIngredientCheckbox).toBeChecked();
      userEvent.click(firstIngredientCheckbox);
      expect(screen.getByTestId('instructions')).toBeInTheDocument();
      expect(screen.getByTestId(/finish-recipe-btn/)).toBeDisabled();
    });

    // tests if favorite button works
    await waitFor(() => {
      const favoriteBtn = screen.getByRole('button', { name: /favorite icon/i });
      const favoriteIcon = screen.getByRole('img', { name: /favorite icon/i });
      expect(favoriteIcon).toHaveProperty('src', whiteHeartIcon);
      userEvent.click(favoriteBtn);
      expect(favoriteIcon).toHaveProperty('src', blackHeartIcon);
    });
  });

  it('ready to drink drinks should work properly', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/drinks');

    await waitFor(() => {
      const firstRecipeButton = screen.getByTestId(firstRecipeBtnID);
      userEvent.click(firstRecipeButton);
    });

    expect(history.location.pathname).toBe(drinkPathname);

    await waitFor(() => {
      const startBtn = screen.getByRole('button', { name: /start recipe/i });
      userEvent.click(startBtn);
    });

    expect(history.location.pathname).toBe('/drinks/15997/in-progress');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /gg/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /gg/i })).toHaveProperty('src', 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg');
      expect(screen.getByRole('button', { name: /share icon/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /favorite icon/i })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /favorite icon/i })).toHaveProperty('src', whiteHeartIcon);
      expect(screen.getByTestId('recipe-category')).toHaveTextContent('Optional alcohol');
      expect(screen.getByText(/galliano - 2 1\/2 shots/i)).toBeInTheDocument();
      const firstIngredientCheckbox = screen.getByRole('checkbox', { name: /galliano - 2 1\/2 shots/i });
      expect(firstIngredientCheckbox).not.toBeChecked();
      userEvent.click(firstIngredientCheckbox);
      expect(firstIngredientCheckbox).toBeChecked();
      userEvent.click(firstIngredientCheckbox);
      expect(screen.getByTestId('instructions')).toBeInTheDocument();
      expect(screen.getByTestId(/finish-recipe-btn/)).toBeDisabled();
    });

    // tests if favorite button works
    await waitFor(() => {
      const favoriteBtn = screen.getByRole('button', { name: /favorite icon/i });
      screen.getByRole('button', { name: /share icon/i });
      const favoriteIcon = screen.getByRole('img', { name: /favorite icon/i });
      expect(favoriteIcon).toHaveProperty('src', whiteHeartIcon);
      userEvent.click(favoriteBtn);
      expect(favoriteIcon).toHaveProperty('src', blackHeartIcon);
    });
  });
});
