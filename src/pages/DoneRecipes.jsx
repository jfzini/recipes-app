import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import Header from '../components/Header';
import './DoneRecipes.css';

export default function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState([]);
  const [linkCopied, setLinkCopied] = useState('');
  const history = useHistory();

  useEffect(() => {
    const doneRecipesStorage = JSON.parse(localStorage.getItem('doneRecipes'));
    setDoneRecipes(doneRecipesStorage);
  }, []);

  const clipboardUrl = (type, id) => {
    if (type === 'meal') {
      copy(`http://localhost:3000/meals/${id}`);
    } else {
      copy(`http://localhost:3000/drinks/${id}`);
    }
    setLinkCopied(id);
  };

  const handleFilter = (filter) => {
    if (filter === 'all') {
      const doneRecipesStorage = JSON.parse(localStorage.getItem('doneRecipes'));
      setDoneRecipes(doneRecipesStorage);
    } else {
      const doneRecipesStorage = JSON.parse(localStorage.getItem('doneRecipes'));
      const filteredRecipes = doneRecipesStorage
        .filter((recipe) => recipe.type === filter);
      setDoneRecipes(filteredRecipes);
    }
  };

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
        {doneRecipes && doneRecipes.map((recipe, index) => (
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
            <button
              data-testid={ `${index}-horizontal-name-button` }
              onClick={ () => history.push(`/${recipe.type}s/${recipe.id}`) }
            >
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
            {linkCopied === recipe.id && <span>Link copied!</span>}
            {recipe.tags.map((tag, indexTag) => (
              <span key={ indexTag } data-testid={ `${index}-${tag}-horizontal-tag` }>
                {tag}
              </span>
            ))}
          </div>
        ))}

      </section>
    </div>
  );
}
