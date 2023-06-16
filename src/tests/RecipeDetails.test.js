import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/renderWithRouter';
import { fetch } from './mocks/mockImplementation';

describe('Test if RecipeDetails page is working correctly', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(fetch);
    navigator.clipboard = {
      writeText: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const drinkPathname = '/drinks/15997';
  const mealPathname = '/meals/52977';
  const firstRecipeBtnID = '0-recipe-button';
  const whiteHeartIcon = 'http://localhost/whiteHeartIcon.svg';
  const blackHeartIcon = 'http://localhost/blackHeartIcon.svg';

  it('should render initial meals', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/meals');

    await waitFor(() => {
      const firstRecipeButton = screen.getByTestId(firstRecipeBtnID);
      userEvent.click(firstRecipeButton);
    });

    expect(history.location.pathname).toBe(mealPathname);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /corba/i })).toBeInTheDocument();
    });

    const beefAsadoImg = screen.getByRole('img', { name: /corba/i });
    expect(beefAsadoImg).toHaveProperty('src', 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg');
    expect(screen.getByRole('img', { name: /share icon/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /favorite icon/i })).toBeInTheDocument();
    expect(screen.getByTestId('0-ingredient-name-and-measure')).toBeInTheDocument();
    expect(screen.getByTestId('2-ingredient-name-and-measure')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
    expect(screen.getByTestId('video')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /gg/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start recipe/i })).toBeInTheDocument();
  });

  it('meals detail page should work correctly', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/meals');

    await waitFor(() => {
      const firstRecipeButton = screen.getByTestId(firstRecipeBtnID);
      userEvent.click(firstRecipeButton);
    });

    expect(history.location.pathname).toBe(mealPathname);

    await waitFor(() => {
      const favoriteBtn = screen.getByRole('button', { name: /favorite icon/i });
      const shareBtn = screen.getByRole('button', { name: /share icon/i });
      expect(shareBtn).toBeInTheDocument();

      userEvent.click(shareBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(3);
      const favoriteIcon = screen.getByRole('img', { name: /favorite icon/i });
      expect(favoriteIcon).toHaveProperty('src', whiteHeartIcon);
      userEvent.click(favoriteBtn);
      expect(favoriteIcon).toHaveProperty('src', blackHeartIcon);
    });

    const startRecipeBtn = screen.getByRole('button', { name: /start recipe/i });
    userEvent.click(startRecipeBtn);
    expect(history.location.pathname).toBe('/meals/52977/in-progress');
    history.push(mealPathname);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue recipe/i })).toBeInTheDocument();
    });
  });

  it('should render initial drinks', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/drinks');

    await waitFor(() => {
      const firstRecipeButton = screen.getByTestId(firstRecipeBtnID);
      userEvent.click(firstRecipeButton);
    });

    expect(history.location.pathname).toBe(drinkPathname);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /gg/i })).toBeInTheDocument();
    });

    const belmontImg = screen.getByRole('img', { name: /gg/i });
    expect(belmontImg).toHaveProperty('src', 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg');
    expect(screen.getByRole('img', { name: /share icon/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /favorite icon/i })).toBeInTheDocument();
    expect(screen.getByTestId('0-ingredient-name-and-measure')).toBeInTheDocument();
    expect(screen.getByTestId('2-ingredient-name-and-measure')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /corba/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start recipe/i })).toBeInTheDocument();
  });

  it('drinks detail page should work correctly', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/drinks');

    await waitFor(() => {
      const firstRecipeButton = screen.getByTestId(firstRecipeBtnID);
      userEvent.click(firstRecipeButton);
    });

    expect(history.location.pathname).toBe(drinkPathname);

    await waitFor(() => {
      const favoriteBtn = screen.getByRole('button', { name: /favorite icon/i });
      const shareBtn = screen.getByRole('button', { name: /share icon/i });
      expect(shareBtn).toBeInTheDocument();
      const favoriteIcon = screen.getByRole('img', { name: /favorite icon/i });
      expect(favoriteIcon).toHaveProperty('src', whiteHeartIcon);
      userEvent.click(favoriteBtn);
      expect(favoriteIcon).toHaveProperty('src', blackHeartIcon);
    });

    const startRecipeBtn = screen.getByRole('button', { name: /start recipe/i });
    userEvent.click(startRecipeBtn);
    expect(history.location.pathname).toBe('/drinks/15997/in-progress');

    history.push('/drinks/15997');
    await waitFor(() => {
      const favoriteIcon = screen.getByRole('img', { name: /favorite icon/i });
      const favoriteBtn = screen.getByRole('button', { name: /favorite icon/i });
      expect(favoriteIcon).toHaveProperty('src', blackHeartIcon);
      userEvent.click(favoriteBtn);
      expect(favoriteIcon).toHaveProperty('src', whiteHeartIcon);
    });
  });
});
