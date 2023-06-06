import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import RecipesContext from './Context';
import {
  fetchMealByIngredient,
  fetchMealByFirstLetter,
  fetchMealByName,
} from '../services/theMealApi';

function ContextProvider({ children }) {
  const [searchMethod, setSearchMethod] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async () => {
    if (searchMethod === 'ingredient') {
      const ingredientResults = await fetchMealByIngredient(searchQuery);
      console.log(ingredientResults);
      setRecipes(ingredientResults);
    } else if (searchMethod === 'name') {
      const nameResults = await fetchMealByName(searchQuery);
      console.log(nameResults);
      setRecipes(nameResults);
    } else if (searchMethod === 'firstLetter') {
      const letterResults = await fetchMealByFirstLetter(searchQuery);
      console.log(letterResults);
      setRecipes(letterResults);
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
