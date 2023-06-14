import React, { useContext, useEffect } from 'react';
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

  const history = useHistory();

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
    <div>
      <input
        data-testid="search-input"
        type="text"
        name="searchInput"
        value={ searchQuery }
        onChange={ ({ target }) => setSearchQuery(target.value) }
      />
      <input
        type="radio"
        name="search"
        onChange={ () => setSearchMethod('ingredient') }
        id="ingredient-radio"
        data-testid="ingredient-search-radio"
      />
      <label htmlFor="ingredient-radio">Ingredient</label>
      <input
        type="radio"
        name="search"
        onChange={ () => setSearchMethod('name') }
        id="name-radio"
        data-testid="name-search-radio"
      />
      <label htmlFor="name-radio">Name</label>
      <input
        type="radio"
        name="search"
        onChange={ () => setSearchMethod('firstLetter') }
        id="letter-radio"
        data-testid="first-letter-search-radio"
      />
      <label htmlFor="letter-radio">First Letter</label>
      <button
        type="button"
        data-testid="exec-search-btn"
        onClick={ () => handleSearch(history.location.pathname) }
      >
        Search
      </button>
    </div>
  );
}
