import React, { useContext } from 'react';
import RecipesContext from '../context/Context';

export default function SearchBar() {
  const {
    searchQuery,
    setSearchMethod,
    setSearchQuery,
    handleSearch,
  } = useContext(RecipesContext);

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
        onClick={ handleSearch }
      >
        Search
      </button>
    </div>
  );
}
