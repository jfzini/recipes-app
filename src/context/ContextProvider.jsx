import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import RecipesContext from './Context';
import {
  fetchMealByIngredient,
  fetchMealByFirstLetter,
  fetchMealByName,
} from '../services/theMealApi';
import {
  fetchDrinkByFirstLetter,
  fetchDrinkByIngredient,
  fetchDrinkByName,
} from '../services/theCocktailApi';

function ContextProvider({ children }) {
  const [searchMethod, setSearchMethod] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const searchMeals = async () => {
    if (searchMethod === 'ingredient') {
      const ingredientResults = await fetchMealByIngredient(searchQuery);
      setRecipes(ingredientResults);
    } else if (searchMethod === 'name') {
      const nameResults = await fetchMealByName(searchQuery);
      setRecipes(nameResults);
    } else if (searchMethod === 'firstLetter' && searchQuery.length === 1) {
      const letterResults = await fetchMealByFirstLetter(searchQuery);
      setRecipes(letterResults);
    } else {
      global.alert('Your search must have only 1 (one) character');
    }
    if (recipes.length === 0) {
      global.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
  };

  const searchDrinks = async () => {
    if (searchMethod === 'ingredient') {
      const ingredientResults = await fetchDrinkByIngredient(searchQuery);
      setRecipes(ingredientResults);
    } else if (searchMethod === 'name') {
      const nameResults = await fetchDrinkByName(searchQuery);
      setRecipes(nameResults);
    } else if (searchMethod === 'firstLetter' && searchQuery.length === 1) {
      const letterResults = await fetchDrinkByFirstLetter(searchQuery);
      setRecipes(letterResults);
    } else {
      global.alert('Your search must have only 1 (one) character');
    }
    if (recipes.length === 0) {
      global.alert('Sorry, we haven\'t found any recipes for these filters.');
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
      handleSearch,
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
