import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import RecipesContext from '../context/Context';

export default function SearchBar() {
  const {
    searchQuery,
    setSearchMethod,
    setSearchQuery,
    handleSearch,
    recipes,
  } = useContext(RecipesContext);

  const [filters, setFilters] = useState({
    input: '',
    filter: '',
  });
  const history = useHistory();

  const checkFilters = () => {
    const { input, filter } = filters;
    if (filter === 'firstLetter' && input.length > 1) {
      return true;
    }
    if (input && filter) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (recipes && recipes.length === 1 && history.location.pathname === '/meals') {
      const id = recipes[0].idMeal;
      history.push(`/meals/${id}`);
    }
    if (recipes && recipes.length === 1 && history.location.pathname === '/drinks') {
      const id = recipes[0].idDrink;
      history.push(`/drinks/${id}`);
    }
  }, [recipes]);

  return (
    <div className="searchbar-container">
      <input
        data-testid="search-input"
        type="text"
        name="searchInput"
        value={ searchQuery }
        className="search-input"
        onChange={ ({ target }) => {
          setSearchQuery(target.value);
          setFilters({ ...filters, input: target.value });
        } }
      />
      <div className="radio-container">
        <label htmlFor="ingredient-radio" className="input-label">
          <input
            type="radio"
            name="search"
            onChange={ () => {
              setSearchMethod('ingredient');
              setFilters({ ...filters, filter: 'ingredient' });
            } }
            id="ingredient-radio"
            data-testid="ingredient-search-radio"
            className="radio-input"
          />
          Ingredient
        </label>
        <label htmlFor="name-radio" className="input-label">
          <input
            type="radio"
            name="search"
            onChange={ () => {
              setSearchMethod('name');
              setFilters({ ...filters, filter: 'name' });
            } }
            id="name-radio"
            data-testid="name-search-radio"
            className="radio-input"
          />
          Name
        </label>
        <label htmlFor="letter-radio" className="input-label">
          <input
            type="radio"
            name="search"
            onChange={ () => {
              setSearchMethod('firstLetter');
              setFilters({ ...filters, filter: 'firstLetter' });
            } }
            id="letter-radio"
            data-testid="first-letter-search-radio"
            className="radio-input"
          />
          First Letter
        </label>
      </div>
      <button
        type="button"
        data-testid="exec-search-btn"
        onClick={ () => handleSearch(history.location.pathname) }
        className="search-btn"
        disabled={ checkFilters() }
      >
        Search
      </button>
    </div>
  );
}
