import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import { fetchMealByID, fetchMealByName } from '../services/theMealApi';
import { fetchDrinkByID, fetchDrinkByName } from '../services/theCocktailApi';
import { saveFavoriteRecipe } from '../services/storage';
import shareIcon from '../images/shareIcon.svg';
import blackFavoriteIcon from '../images/blackHeartIcon.svg';
import whiteFavoriteIcon from '../images/whiteHeartIcon.svg';
import './RecipeDetails.css';

export default function RecipeDetails() {
  const history = useHistory();
  const { pathname } = history.location;
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const CAROUSEL_LIMIT = 5;

  const fetchRecipe = async () => {
    if (pathname.includes('meals')) {
      const fetchedMeal = await fetchMealByID(id);
      setRecipe(fetchedMeal);
    }
    if (pathname.includes('drinks')) {
      const fetchedDrink = await fetchDrinkByID(id);
      setRecipe(fetchedDrink);
    }
  };

  const fetchSuggestions = async () => {
    if (pathname.includes('meals')) {
      const fetchedDrinks = await fetchDrinkByName();
      setSuggestions(fetchedDrinks);
    }
    if (pathname.includes('drinks')) {
      const fetchedMeals = await fetchMealByName();
      setSuggestions(fetchedMeals);
    }
  };

  const handleCopy = () => {
    copy(`http://localhost:3000${pathname}`);
    setLinkCopied(true);
  };

  const addFavoriteMeal = () => {
    const { idMeal, strMeal, strCategory, strArea, strMealThumb } = recipe[0];
    const favoriteRecipe = {
      id: idMeal,
      type: 'meal',
      nationality: strArea,
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
    };
    saveFavoriteRecipe(favoriteRecipe);
    setFavorite(true);
  };

  const addFavoriteDrink = () => {
    const { idDrink, strDrink, strAlcoholic, strCategory, strDrinkThumb } = recipe[0];
    const favoriteRecipe = {
      id: idDrink,
      type: 'drink',
      nationality: '',
      category: strCategory,
      alcoholicOrNot: strAlcoholic,
      name: strDrink,
      image: strDrinkThumb,
    };
    saveFavoriteRecipe(favoriteRecipe);
    setFavorite(true);
  };

  const handleFavorites = () => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favorite && favoriteRecipes) {
      favoriteRecipes
        .forEach((favoriteRecipe) => {
          if (pathname.includes(favoriteRecipe.id)) {
            setFavorite(false);
            const removedFavorite = favoriteRecipes
              .filter((filterRecipe) => filterRecipe.id !== favoriteRecipe.id);
            localStorage.setItem('favoriteRecipes', JSON.stringify(removedFavorite));
          }
        });
    } else {
      if (pathname.includes('meals')) { addFavoriteMeal(); }
      if (pathname.includes('drinks')) { addFavoriteDrink(); }
    }
  };

  const checkFavorite = () => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes) {
      favoriteRecipes
        .forEach((favoriteRecipe) => pathname
          .includes(favoriteRecipe.id) && setFavorite(true));
    }
  };

  const checkInProgress = () => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (inProgressRecipes) {
      const { meals, drinks } = inProgressRecipes;
      if (pathname.includes('meals') && meals[id]) { setInProgress(true); }
      if (pathname.includes('drinks') && drinks[id]) { setInProgress(true); }
    }
  };

  const startRecipe = () => {
    const pattern = { drinks: {}, meals: {} };
    if (pathname.includes('meals')) {
      const recipeInProgress = { ...pattern, meals: { [id]: [] } };
      localStorage.setItem('inProgressRecipes', JSON.stringify(recipeInProgress));
    }
    if (pathname.includes('drinks')) {
      const recipeInProgress = { ...pattern, drinks: { [id]: [] } };
      localStorage.setItem('inProgressRecipes', JSON.stringify(recipeInProgress));
    }
  };

  useEffect(() => {
    fetchRecipe();
    fetchSuggestions();
    checkFavorite();
    checkInProgress();
  }, []);

  return (
    <div>
      {recipe
        && recipe.map((receipt) => (
          <div key={ id }>
            <h4 data-testid="recipe-title">{receipt.strMeal || receipt.strDrink}</h4>
            <img
              src={ receipt.strDrinkThumb || receipt.strMealThumb }
              alt={ receipt.strMeal || receipt.strDrink }
              data-testid="recipe-photo"
            />
            <button data-testid="share-btn" onClick={ handleCopy }>
              <img src={ shareIcon } alt="share icon" />
            </button>
            <button onClick={ handleFavorites }>
              {favorite
                ? (
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
            {linkCopied && <span>Link copied!</span>}
            <p data-testid="recipe-category">
              { pathname.includes('/meals')
                ? receipt.strCategory
                : receipt.strAlcoholic}
            </p>
            <ul>
              {Object.keys(receipt)
                .filter((key) => key.includes('strIngredient') && receipt[key])
                .map((ingredient, index) => (
                  <li
                    data-testid={ `${index}-ingredient-name-and-measure` }
                    key={ index }
                  >
                    {receipt[ingredient]}
                    {' - '}
                    {receipt[ingredient.replace('strIngredient', 'strMeasure')]}
                  </li>
                ))}
            </ul>
            <p data-testid="instructions">{receipt.strInstructions}</p>
            {pathname.includes('meals') && (
              <iframe
                title={ receipt.strMeal }
                width="420"
                height="315"
                src={ receipt.strYoutube.replace('watch?v=', 'embed/') }
                data-testid="video"
              />
            )}
          </div>
        ))}
      <div className="carousel-container">
        {suggestions
            && suggestions.map((suggestion, index) => {
              if (index <= CAROUSEL_LIMIT) {
                return (
                  <div
                    key={ index }
                    data-testid={ `${index}-recommendation-card` }
                  >
                    <img
                      src={ suggestion.strMealThumb || suggestion.strDrinkThumb }
                      alt={ suggestion.strMeal || suggestion.strDrink }
                      className="carousel-img"
                    />
                    <p data-testid={ `${index}-recommendation-title` }>
                      { suggestion.strMeal || suggestion.strDrink }
                    </p>
                  </div>
                );
              }
              return null;
            })}
      </div>
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
      </button>
    </div>
  );
}
