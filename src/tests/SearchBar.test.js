import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/renderWithRouter';
import { mockMealIngredientFilter, mockMealSingleRecipe } from './mocks/mockMeals';
import { mockDrinkCategory, mockDrinkIngredientFilter, mockDrinkSingleRecipe } from './mocks/mockDrinks';

describe('Test if SearchBar component is working correctly', () => {
  const searchIconID = 'search-top-btn';
  const profileBtnID = 'profile-top-btn';
  const searchInputID = 'search-input';
  const nameRadioID = 'name-search-radio';
  const searchBtnID = 'exec-search-btn';
  const firstRecipeID = '0-recipe-button';

  it('should work correctly on meals page', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockMealIngredientFilter),
    });

    const { history } = renderWithRouterAndContext(<App />, '/meals');

    expect(screen.getByTestId(searchIconID)).toBeInTheDocument();
    expect(screen.getByTestId(profileBtnID)).toBeInTheDocument();
    expect(screen.queryByTestId(searchInputID)).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId(searchIconID));
    const searchInput = screen.getByTestId(searchInputID);
    const ingredientSearchRadio = screen.getByTestId('ingredient-search-radio');
    const nameSearchRadio = screen.getByTestId(nameRadioID);
    const firstLetterSearchRadio = screen.getByTestId('first-letter-search-radio');
    const execSearchBtn = screen.getByTestId(searchBtnID);

    userEvent.type(searchInput, 'lemon');
    userEvent.click(nameSearchRadio);
    expect(nameSearchRadio).toBeChecked();
    userEvent.click(firstLetterSearchRadio);
    expect(firstLetterSearchRadio).toBeChecked();
    userEvent.click(ingredientSearchRadio);
    expect(ingredientSearchRadio).toBeChecked();

    userEvent.click(execSearchBtn);

    await waitFor(() => {
      const firstMealCard = screen.getByTestId(firstRecipeID);
      userEvent.click(firstMealCard);
      expect(history.location.pathname).toBe('/meals/52959');
    });
  });

  it('should work correctly on drinks page', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockDrinkIngredientFilter),
    });

    const { history } = renderWithRouterAndContext(<App />, '/drinks');

    expect(screen.getByTestId(searchIconID)).toBeInTheDocument();
    expect(screen.getByTestId(profileBtnID)).toBeInTheDocument();
    expect(screen.queryByTestId(searchInputID)).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId(searchIconID));
    const searchInput = screen.getByTestId(searchInputID);
    const ingredientSearchRadio = screen.getByTestId('ingredient-search-radio');
    const nameSearchRadio = screen.getByTestId(nameRadioID);
    const firstLetterSearchRadio = screen.getByTestId('first-letter-search-radio');
    const execSearchBtn = screen.getByTestId(searchBtnID);

    userEvent.click(screen.getByRole('button', { name: /all/i }));
    userEvent.type(searchInput, 'lemon');
    userEvent.click(nameSearchRadio);
    expect(nameSearchRadio).toBeChecked();
    userEvent.click(firstLetterSearchRadio);
    expect(firstLetterSearchRadio).toBeChecked();
    userEvent.click(ingredientSearchRadio);
    expect(ingredientSearchRadio).toBeChecked();

    userEvent.click(execSearchBtn);

    await waitFor(() => {
      const firstDrinkCard = screen.getByTestId(firstRecipeID);
      userEvent.click(firstDrinkCard);
      expect(history.location.pathname).toBe('/drinks/17005');
    });
  });

  it('should go to the details page if only 1 recipe is found in meals page', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockMealSingleRecipe),
    });

    const { history } = renderWithRouterAndContext(<App />, '/meals');

    userEvent.click(screen.getByTestId(searchIconID));

    const searchInput = screen.getByTestId(searchInputID);
    const nameSearchRadio = screen.getByTestId(nameRadioID);
    const execSearchBtn = screen.getByTestId(searchBtnID);

    userEvent.type(searchInput, 'lemon');
    userEvent.click(nameSearchRadio);
    userEvent.click(execSearchBtn);

    await waitFor(() => {
      expect(history.location.pathname).toBe('/meals/52959');
    });
  });

  it('should go to the details page if only 1 recipe is found in drinks page', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockDrinkSingleRecipe),
    });

    const { history } = renderWithRouterAndContext(<App />, '/drinks');

    userEvent.click(screen.getByTestId(searchIconID));

    const searchInput = screen.getByTestId(searchInputID);
    const nameSearchRadio = screen.getByTestId(nameRadioID);
    const execSearchBtn = screen.getByTestId(searchBtnID);

    userEvent.type(searchInput, 'lemon');
    userEvent.click(nameSearchRadio);
    userEvent.click(execSearchBtn);

    await waitFor(() => {
      expect(history.location.pathname).toBe('/drinks/17005');
    });
  });

  it('should render filtered results when a category is selected', async () => {
    jest.restoreAllMocks();

    const { history } = renderWithRouterAndContext(<App />, '/drinks');

    await waitFor(() => {
      userEvent.click(screen.queryByRole('button', { name: /shake/i }));
    });

    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockDrinkCategory),
    });

    await waitFor(() => {
      const firstDrinkCard = screen.getByTestId(firstRecipeID);
      userEvent.click(firstDrinkCard);
      expect(history.location.pathname).toBe('/drinks/14588');
    });
  });
});
