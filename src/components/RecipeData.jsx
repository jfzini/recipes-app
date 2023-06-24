import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import blackFavoriteIcon from '../images/blackHeartIcon.svg';
import whiteFavoriteIcon from '../images/whiteHeartIcon.svg';

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
    const filteredPathname = path.includes('in-progress')
      ? path.replace('/in-progress', '')
      : path;
    copy(`http://localhost:3000${filteredPathname}`);
    setLinkCopied(recipeID);
  };

  return (
    <div>
      {recipe && recipe.map((recipeData) => (
        <div key={ id }>
          <h4 data-testid="recipe-title">{recipeData.strMeal || recipeData.strDrink}</h4>
          <img
            src={ recipeData.strMealThumb || recipeData.strDrinkThumb }
            alt={ recipeData.strMeal || recipeData.strDrink }
            data-testid="recipe-photo"
          />
          <button data-testid="share-btn" onClick={ () => handleCopy(pathname, id) }>
            <img src={ shareIcon } alt="share icon" />
          </button>
          {linkCopied === id && <span>Link copied!</span>}
          <button onClick={ handleFavorites }>
            {favorite ? (
              <img
                src={ blackFavoriteIcon }
                alt="favorite icon"
                data-testid="favorite-btn"
              />
            ) : (
              <img
                src={ whiteFavoriteIcon }
                alt="favorite icon"
                data-testid="favorite-btn"
              />
            )}
          </button>
          <p data-testid="recipe-category">
            {pathname.includes('/meals')
              ? recipeData.strCategory
              : recipeData.strAlcoholic}
          </p>
          <ul>
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
                  <li
                    data-testid={ `${index}-ingredient-name-and-measure` }
                    key={ `${index}-li` }
                  >
                    {recipeData[ingredient]}
                    {' - '}
                    {recipeData[ingredient.replace('strIngredient', 'strMeasure')]}
                  </li>
                );
              })}
          </ul>
          <p data-testid="instructions">{recipeData.strInstructions}</p>
          {pathname.includes('meals') && (
            <iframe
              title={ recipeData.strMeal }
              width="420"
              height="315"
              src={ recipeData.strYoutube.replace('watch?v=', 'embed/') }
              data-testid="video"
            />
          )}
          {type === 'progress' && (
            <button
              data-testid="finish-recipe-btn"
              disabled={
                Object.keys(recipeData).filter(
                  (key) => key.includes('strIngredient') && recipeData[key],
                ).length !== usedIngredients.length
              }
              onClick={ () => finishRecipe(recipeData) }
            >
              Finalizar receita
            </button>
          )}
        </div>
      ))}
      <div className="carousel-container">
        {suggestions
          && suggestions.map((suggestion, index) => {
            if (index <= CAROUSEL_LIMIT) {
              return (
                <div key={ index } data-testid={ `${index}-recommendation-card` }>
                  <img
                    src={ suggestion.strMealThumb || suggestion.strDrinkThumb }
                    alt={ suggestion.strMeal || suggestion.strDrink }
                    className="carousel-img"
                  />
                  <p data-testid={ `${index}-recommendation-title` }>
                    {suggestion.strMeal || suggestion.strDrink}
                  </p>
                </div>
              );
            }
            return null;
          })}
      </div>
      {type === 'details'
      && (
        <button
          type="button"
          data-testid="start-recipe-btn"
          className="start-recipe-btn"
          onClick={ () => {
            startRecipe();
            history.push(`${pathname}/in-progress`);
          } }
        >
          { inProgress ? 'Continue Recipe' : 'Start Recipe'}
        </button>)}
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
