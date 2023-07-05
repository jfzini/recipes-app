import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import Carousel from './Carousel';
import filledCopyIcon from '../images/filledCopyIcon.png';
import emptyCopyIcon from '../images/emptyCopyIcon.png';
import filledFavoriteIcon from '../images/filledFavoriteIcon.png';
import emptyFavoriteIcon from '../images/emptyFavoriteIcon.png';
import './css/RecipeData.css';

export default function RecipeData({
  recipe,
  id,
  favorite,
  handleFavorites,
  type,
  suggestions,
  startRecipe,
  finishRecipe,
  inProgress,
  usedIngredients,
  handleUsedIngredients,
}) {
  const [linkCopied, setLinkCopied] = useState('');
  const history = useHistory();
  const { pathname } = history.location;
  const CAROUSEL_LIMIT = 5;

  const handleCopy = (path, recipeID) => {
    const filteredPathname = path.includes('in-progress') ? path.replace('/in-progress', '') : path;
    copy(`http://localhost:3000${filteredPathname}`);
    setLinkCopied(recipeID);
    setTimeout(() => {
      setLinkCopied('');
    }, 10000);
  };

  return (
    <div className="detail-page-container">
      {recipe
        && recipe.map((recipeData) => (
          <div key={ id }>
            <div className="detail-hero">
              <h2 data-testid="recipe-title" className="detail-title">
                {recipeData.strMeal || recipeData.strDrink}
              </h2>
              <img
                src={ recipeData.strMealThumb || recipeData.strDrinkThumb }
                alt={ recipeData.strMeal || recipeData.strDrink }
                data-testid="recipe-photo"
                className="detail-img"
              />
              <p data-testid="recipe-category" className="recipe-category">
                {pathname.includes('/meals') ? recipeData.strCategory : recipeData.strAlcoholic}
              </p>
            </div>
            <button
              data-testid="share-btn"
              onClick={ () => handleCopy(pathname, id) }
              className="share-btn"
            >
              <img
                src={ linkCopied === id ? filledCopyIcon : emptyCopyIcon }
                alt="share icon"
                className="detail-icons"
              />
            </button>
            <button onClick={ handleFavorites } className="favorite-btn">
              {favorite ? (
                <img
                  src={ filledFavoriteIcon }
                  alt="favorite icon"
                  data-testid="favorite-btn"
                  className="detail-icons"
                />
              ) : (
                <img
                  src={ emptyFavoriteIcon }
                  alt="favorite icon"
                  data-testid="favorite-btn"
                  className="detail-icons"
                />
              )}
            </button>
            <ul className="ingredients-list">
              <h3 className="subtitle">Ingredients</h3>
              {Object.keys(recipeData)
                .filter((key) => key.includes('strIngredient') && recipeData[key])
                .map((ingredient, index) => {
                  if (type === 'progress') {
                    return (
                      <div key={ index }>
                        <label
                          htmlFor={ `${index}-ingredient-checkbox` }
                          data-testid={ `${index}-ingredient-step` }
                          className={
                            usedIngredients.includes(recipeData[ingredient])
                              ? 'checked-ingredient'
                              : ''
                          }
                        >
                          {recipeData[ingredient]}
                          {' - '}
                          {recipeData[ingredient.replace('strIngredient', 'strMeasure')]}
                          <input
                            type="checkbox"
                            id={ `${index}-ingredient-checkbox` }
                            onChange={ () => handleUsedIngredients(recipeData[ingredient]) }
                            checked={ usedIngredients.includes(recipeData[ingredient]) }
                          />
                        </label>
                      </div>
                    );
                  }
                  return (
                    <li data-testid={ `${index}-ingredient-name-and-measure` } key={ `${index}-li` }>
                      {recipeData[ingredient]}
                      {' - '}
                      {recipeData[ingredient.replace('strIngredient', 'strMeasure')]}
                    </li>
                  );
                })}
            </ul>
            <div className="instructions">
              <h3 className="subtitle">Instructions</h3>
              <p data-testid="instructions" className="instructions-body">
                {recipeData.strInstructions}
              </p>
            </div>
            {pathname.includes('meals') && (
              <div className="video-container">
                <h3 className="subtitle">Tutorial</h3>
                <iframe
                  title={ recipeData.strMeal }
                  src={ recipeData.strYoutube && recipeData.strYoutube.replace('watch?v=', 'embed/') }
                  data-testid="video"
                  className="video"
                />
              </div>
            )}
            {type === 'progress' && (
              <div className="finish-recipe-btn-container">
                <button
                  data-testid="finish-recipe-btn"
                  disabled={
                    Object.keys(recipeData).filter(
                      (key) => key.includes('strIngredient') && recipeData[key],
                    ).length !== usedIngredients.length
                  }
                  onClick={ () => finishRecipe(recipeData) }
                  className="finish-recipe-btn"
                >
                  Finish Recipe
                </button>
              </div>
            )}
          </div>
        ))}
      {type === 'details' ? (
        <>
          <h3 className="suggestion-subtitle">
            Suggested
            {' '}
            {pathname.includes('meals') ? 'drinks' : 'meals'}
          </h3>
          <Carousel suggestions={ suggestions } CAROUSEL_LIMIT={ CAROUSEL_LIMIT } />
          <button
            type="button"
            data-testid="start-recipe-btn"
            className="start-recipe-btn"
            onClick={ () => {
              startRecipe();
              history.push(`${pathname}/in-progress`);
            } }
          >
            {inProgress ? 'Continue Recipe' : 'Start Recipe'}
          </button>
        </>
      ) : ''}
    </div>
  );
}

RecipeData.propTypes = {
  favorite: PropTypes.bool,
  finishRecipe: PropTypes.func,
  handleFavorites: PropTypes.func,
  handleUsedIngredients: PropTypes.func,
  id: PropTypes.string,
  inProgress: PropTypes.bool,
  recipe: PropTypes.shape({
    map: PropTypes.func,
  }),
  startRecipe: PropTypes.func,
  suggestions: PropTypes.shape({
    map: PropTypes.func,
  }),
  type: PropTypes.string,
  usedIngredients: PropTypes.shape({
    includes: PropTypes.func,
    length: PropTypes.func,
  }),
}.isRequired;
