import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import RecipesContext from './Context';
import {
  fetchMealByIngredient,
  fetchMealByFirstLetter,
  fetchMealByName,
  fetchMealsList,
  fetchFilteredMeals,
} from '../services/theMealApi';
import {
  fetchDrinkByFirstLetter,
  fetchDrinkByIngredient,
  fetchDrinkByName,
  fetchDrinksList,
  fetchFilteredDrinks,
} from '../services/theCocktailApi';

function ContextProvider({ children }) {
  const [searchMethod, setSearchMethod] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState([]);

  const renderFilters = async (pathname) => {
    if (pathname === '/meals') {
      const mealsList = await fetchMealsList();
      setFilters(mealsList);
    }
    if (pathname === '/drinks') {
      const drinksList = await fetchDrinksList();
      setFilters(drinksList);
    }
  };

  const renderFilteredRecipes = async (pathname, filter) => {
    if (pathname === '/meals') {
      const filteredMeals = await fetchFilteredMeals(filter);
      setRecipes(filteredMeals);
    }
    if (pathname === '/drinks') {
      const filteredDrinks = await fetchFilteredDrinks(filter);
      setRecipes(filteredDrinks);
    }
  };

  const renderInitialRecipes = async (pathname) => {
    if (pathname === '/meals') {
      const initialMeals = await fetchMealByName();
      setRecipes(initialMeals);
    }
    if (pathname === '/drinks') {
      const initialDrinks = await fetchDrinkByName();
      setRecipes(initialDrinks);
    }
  };

  const searchMeals = async () => {
    const noRecipeError = 'Sorry, we haven\'t found any recipes for these filters.';
    if (searchMethod === 'ingredient') {
      const ingredientResults = await fetchMealByIngredient(searchQuery);
      if (!ingredientResults) { global.alert(noRecipeError); }
      setRecipes(ingredientResults);
    } else if (searchMethod === 'name') {
      const nameResults = await fetchMealByName(searchQuery);
      if (!nameResults) { global.alert(noRecipeError); }
      setRecipes(nameResults);
    } else if (searchMethod === 'firstLetter' && searchQuery.length === 1) {
      const letterResults = await fetchMealByFirstLetter(searchQuery);
      if (!letterResults) { global.alert(noRecipeError); }
      setRecipes(letterResults);
    } else if (searchMethod === 'firstLetter' && searchQuery.length > 1) {
      global.alert('Your search must have only 1 (one) character');
    }
  };

  const searchDrinks = async () => {
    const noRecipeError = 'Sorry, we haven\'t found any recipes for these filters.';
    if (searchMethod === 'ingredient') {
      const ingredientResults = await fetchDrinkByIngredient(searchQuery);
      if (!ingredientResults) { global.alert(noRecipeError); }
      setRecipes(ingredientResults);
    } else if (searchMethod === 'name') {
      const nameResults = await fetchDrinkByName(searchQuery);
      if (!nameResults) { global.alert(noRecipeError); }
      setRecipes(nameResults);
    } else if (searchMethod === 'firstLetter' && searchQuery.length === 1) {
      const letterResults = await fetchDrinkByFirstLetter(searchQuery);
      if (!letterResults) { global.alert(noRecipeError); }
      setRecipes(letterResults);
    } else if (searchMethod === 'firstLetter' && searchQuery.length > 1) {
      global.alert('Your search must have only 1 (one) character');
    }
  };

  const handleSearch = async (pathname) => {
    if (pathname === '/meals') {
      await searchMeals();
    }
    if (pathname === '/drinks') {
      await searchDrinks();
    }
  };

  const contextValue = useMemo(
    () => ({
      searchMethod,
      searchQuery,
      setSearchMethod,
      setSearchQuery,
      recipes,
      renderInitialRecipes,
      handleSearch,
      filters,
      renderFilters,
      renderFilteredRecipes,
    }),
    [searchMethod, searchQuery, recipes],
  );

  return (
    <RecipesContext.Provider value={ contextValue }>
      {children}
    </RecipesContext.Provider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.element,
}.isRequired;

export default ContextProvider;
