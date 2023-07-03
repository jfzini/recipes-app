import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import emptyCopyIcon from '../images/emptyCopyIcon.png';
import filledCopyIcon from '../images/filledCopyIcon.png';
import Header from '../components/Header';
import filledFavoriteIcon from '../images/filledFavoriteIcon.png';
import './css/DoneRecipes.css';
import './css/FavoriteRecipes.css'
import Footer from '../components/Footer';

export default function FavoriteRecipes() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [linksCopied, setLinksCopied] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
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
      const filteredRecipes = doneRecipesStorage.filter((recipe) => recipe.type === filter);
      setFavoriteRecipes(filteredRecipes);
    }
    setActiveFilter(filter);
  };

  useEffect(() => {
    const favoriteRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    setFavoriteRecipes(favoriteRecipesStorage);
  }, []);

  return (
    <div className="detail-page-container">
      <Header />
      <section className="filters-container">
        <button
          data-testid="filter-by-all-btn"
          onClick={() => handleFilter('all')}
          className={
            activeFilter === 'all' || activeFilter === ''
              ? 'filter-button active-filter'
              : 'filter-button inactive-filter'
          }
        >
          All
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={() => handleFilter('meal')}
          className={
            activeFilter === 'meal'
              ? 'filter-button active-filter'
              : 'filter-button inactive-filter'
          }
        >
          Meals
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={() => handleFilter('drink')}
          className={
            activeFilter === 'drink'
              ? 'filter-button active-filter'
              : 'filter-button inactive-filter'
          }
        >
          Drinks
        </button>
      </section>
      <section className="recipes-container">
        {favoriteRecipes &&
          favoriteRecipes.map((recipe, index) => (
            <div className='favorite-container'>
              <div className="recipe-card" key={index}>
                <div
                  onClick={() => history.push(`/${recipe.type}s/${recipe.id}`)}
                  className="recipe-image-container"
                >
                  <img
                    className="recipe-image"
                    data-testid={`${index}-horizontal-image`}
                    src={recipe.image}
                    alt={recipe.name}
                  />
                </div>
                <p data-testid={`${index}-horizontal-top-text`} className="recipe-name">
                  {recipe.name}
                </p>
              </div>
              <div>
                <button
                  data-testid={`${index}-horizontal-share-btn`}
                  onClick={() => clipboardUrl(recipe.type, recipe.id)}
                  className='done-share-btn'
                >
                  <img
                    src={linksCopied === recipe.id ? filledCopyIcon : emptyCopyIcon}
                    alt="share"
                    className='detail-icons'
                  />
                </button>
                <button
                  onClick={() => removeFavorite(recipe.id)}
                  className='favorite-btn'
                >
                  <img
                    src={filledFavoriteIcon}
                    alt="favorite icon"
                    className='detail-icons'
                    data-testid={`${index}-horizontal-favorite-btn`}
                  />
                </button>
              </div>
            </div>
          ))}
          <Footer />
      </section>
    </div>
  );
}
