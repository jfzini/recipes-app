import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import Header from '../components/Header';
import blackFavoriteIcon from '../images/blackHeartIcon.svg';
import './DoneRecipes.css';

export default function FavoriteRecipes() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [linksCopied, setLinksCopied] = useState('');
  const history = useHistory();

  const removeFavorite = (id) => {
    const favoriteRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const filteredRecipes = favoriteRecipesStorage.filter((recipe) => recipe.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(filteredRecipes));
    setFavoriteRecipes(filteredRecipes);
  };

  const clipboardUrl = (type, id) => {
    if (type === 'meal') {
      copy(`http://localhost:3000/meals/${id}`);
    } else {
      copy(`http://localhost:3000/drinks/${id}`);
    }
    setLinksCopied(id);
  };

  const handleFilter = (filter) => {
    if (filter === 'all') {
      const doneRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
      setFavoriteRecipes(doneRecipesStorage);
    } else {
      const doneRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
      const filteredRecipes = doneRecipesStorage
        .filter((recipe) => recipe.type === filter);
      setFavoriteRecipes(filteredRecipes);
    }
  };

  useEffect(() => {
    const favoriteRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    setFavoriteRecipes(favoriteRecipesStorage);
  }, []);

  return (
    <div>
      <Header />
      <section>
        <button
          data-testid="filter-by-all-btn"
          onClick={ () => handleFilter('all') }
        >
          All
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => handleFilter('meal') }
        >
          Meals
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => handleFilter('drink') }
        >
          Drinks
        </button>

        {favoriteRecipes && favoriteRecipes.map((recipe, index) => (
          <div key={ index }>
            <button onClick={ () => history.push(`/${recipe.type}s/${recipe.id}`) }>
              <img
                className="done-recipe-image"
                data-testid={ `${index}-horizontal-image` }
                src={ recipe.image }
                alt={ recipe.name }
              />
            </button>
            <p data-testid={ `${index}-horizontal-top-text` }>
              {recipe.type === 'meal'
                ? `${recipe.nationality} - ${recipe.category}`
                : recipe.alcoholicOrNot}
            </p>
            <button onClick={ () => history.push(`/${recipe.type}s/${recipe.id}`) }>
              <p
                data-testid={ `${index}-horizontal-name` }
              >
                {recipe.name}
              </p>

            </button>
            <p data-testid={ `${index}-horizontal-done-date` }>{recipe.doneDate}</p>

            <button
              data-testid={ `${index}-horizontal-share-btn` }
              onClick={ () => clipboardUrl(recipe.type, recipe.id) }
              src={ shareIcon }
            >
              <img src={ shareIcon } alt="share" />
            </button>
            <button onClick={ () => removeFavorite(recipe.id) }>
              <img
                src={ blackFavoriteIcon }
                alt="favorite icon"
                data-testid={ `${index}-horizontal-favorite-btn` }
              />
            </button>
            {linksCopied === recipe.id && <span>Link copied!</span>}
          </div>
        ))}

      </section>
    </div>
  );
}
