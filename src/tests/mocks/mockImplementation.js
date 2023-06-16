import { allDrinksMock } from './allDrinks';
import { allMealsMock } from './allMeals';
import { drinkByIngredientMock } from './drinkByIngredient'; // filters by lemon
import { drinkDetailsMock } from './drinkDetails'; // mocks 155 Belmont
import { drinksByCategoryMock } from './drinksByCategory';
import { drinksListMock } from './drinksList';
import { firstLetterJDrinks } from './firstLetterDrinks'; // filters letter J
import { firstLetterMealMock } from './firstLetterMeal';
import { mealByIngredientMock } from './mealByIngredient';
import { mealDetailsMock } from './mealDetails';
import { mealsByCategoryMock } from './mealsByCategory';
import { mealsListMock } from './mealsList';
import { nameFilterDrinksMock } from './nameFilterDrinks'; // filters 'GG'
import { nameFilterMealsMock } from './nameFilterMeals';

const fetchDrinks = (url) => Promise.resolve({
  status: 200,
  ok: true,
  json: () => {
    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=xablau') return Promise.reject(new Error('No drinks found'));
    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=') return Promise.resolve(allDrinksMock);
    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=xablau') return Promise.reject(new Error('No drinks found'));
    if (url.includes('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=')
          || url === 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=155') return Promise.resolve(drinkDetailsMock);
    if ((/https:\/\/www\.thecocktaildb\.com\/api\/json\/v1\/1\/search\.php\?s=\w+/).test(url)) return Promise.resolve(nameFilterDrinksMock);
    if (url.includes('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=')) return Promise.resolve(firstLetterJDrinks);
    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list') return Promise.resolve(drinksListMock);
    if (url.includes('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=')) return Promise.resolve(drinksByCategoryMock);
    if (url.includes('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=')) return Promise.resolve(drinkByIngredientMock);
    return Promise.reject(new Error('Invalid url'));
  },
});

const fetchMeals = (url) => Promise.resolve({
  status: 200,
  ok: true,
  json: () => {
    if (url === 'https://www.themealdb.com/api/json/v1/1/filter.php?i=xablau') return Promise.reject(new Error('No meals found'));
    if (url === 'https://www.themealdb.com/api/json/v1/1/search.php?s=') return Promise.resolve(allMealsMock);
    if (url === 'https://www.themealdb.com/api/json/v1/1/search.php?s=xablau') return Promise.reject(new Error('No meals found'));
    if (url.includes('https://www.themealdb.com/api/json/v1/1/lookup.php?i=')
          || url.includes('https://www.themealdb.com/api/json/v1/1/search.php?s=beef')) return Promise.resolve(mealDetailsMock);
    if ((/https:\/\/www\.themealdb\.com\/api\/json\/v1\/1\/search\.php\?s=\w+/).test(url)) return Promise.resolve(nameFilterMealsMock);
    if (url.includes('https://www.themealdb.com/api/json/v1/1/search.php?f=')) return Promise.resolve(firstLetterMealMock);
    if (url === 'https://www.themealdb.com/api/json/v1/1/list.php?c=list') return Promise.resolve(mealsListMock);
    if (url.includes('https://www.themealdb.com/api/json/v1/1/filter.php?c=')) return Promise.resolve(mealsByCategoryMock);
    if (url.includes('https://www.themealdb.com/api/json/v1/1/filter.php?i=')) return Promise.resolve(mealByIngredientMock);
    return Promise.reject(new Error('Invalid url'));
  },
});

export const fetch = (url) => {
  if (url.includes('thecocktaildb')) {
    return fetchDrinks(url);
  }
  if (url.includes('themealdb')) {
    return fetchMeals(url);
  }
};
