import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import emptyCopyIcon from '../images/emptyCopyIcon.png';
import filledCopyIcon from '../images/filledCopyIcon.png';
import Header from '../components/Header';
import './css/DoneRecipes.css';
import Footer from '../components/Footer';

export default function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState([]);
  const [linkCopied, setLinkCopied] = useState('all');
  const [activeFilter, setActiveFilter] = useState('');
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
    setActiveFilter(filter);
  };

  const setButtonClass = (type) => {
    if (activeFilter === type) {
      return 'filter-button active-filter';
    }
    return 'filter-button inactive-filter';
  };

  return (
    <div className="detail-page-container">
      <Header />
      <section className="filters-container">
        <button
          data-testid="filter-by-all-btn"
          className={ setButtonClass('all') }
          onClick={ () => handleFilter('all') }
        >
          All
        </button>
        <button
          data-testid="filter-by-meal-btn"
          className={ setButtonClass('meal') }
          onClick={ () => handleFilter('meal') }
        >
          Meals
        </button>
        <button
          data-testid="filter-by-drink-btn"
          className={ setButtonClass('drink') }
          onClick={ () => handleFilter('drink') }
        >
          Drinks
        </button>
      </section>
      <section className="recipes-container">
        {doneRecipes
          && doneRecipes.map((recipe, index) => (
            <div className="done-recipe-container" key={ `done-recipe-${index}` }>
              <div key={ index } className="recipe-card">
                <button
                  data-testid={ `${index}-horizontal-share-btn` }
                  onClick={ () => clipboardUrl(recipe.type, recipe.id) }
                  className="done-share-btn"
                >
                  <img
                    src={ recipe.id === linkCopied ? filledCopyIcon : emptyCopyIcon }
                    alt="share"
                    className="detail-icons"
                  />
                </button>
                <button
                  onClick={ () => history.push(`/${recipe.type}s/${recipe.id}`) }
                  className="recipe-image-container"
                >
                  <img
                    className="recipe-image"
                    data-testid={ `${index}-horizontal-image` }
                    src={ recipe.image }
                    alt={ recipe.name }
                  />
                </button>
                <p data-testid={ `${index}-horizontal-top-text` } className="recipe-name">
                  {recipe.name}
                </p>
              </div>
              <div className="done-recipe-data">
                <p
                  data-testid={ `${index}-horizontal-done-date` }
                  className="done-recipe-info"
                >
                  Recipe done in:
                  {' '}
                  {recipe.doneDate}
                </p>
                <p className="done-recipe-info">
                  Category:
                  {' '}
                  {recipe.category}
                </p>
              </div>
            </div>
          ))}
      </section>
      <Footer />
    </div>
  );
}
