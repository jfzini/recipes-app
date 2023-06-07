import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import { fetchMealByID, fetchMealByName } from '../services/theMealApi';
import { fetchDrinkByID, fetchDrinkByName } from '../services/theCocktailApi';
import shareIcon from '../images/shareIcon.svg';
import favoriteIcon from '../images/blackHeartIcon.svg';
// import Slider  from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import './RecipeDetails.css';

export default function RecipeDetails() {
  const history = useHistory();
  const { pathname } = history.location;
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const CAROUSEL_LIMIT = 5;

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 2,
  //   slidesToScroll: 1,
  // };

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

  const handleFavorites = () => {
    if (pathname.includes('meals')) {
      console.log(recipe);
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
      const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
      if (favoriteRecipes) {
        localStorage.setItem(
          'favoriteRecipes',
          JSON.stringify([...favoriteRecipes, favoriteRecipe]),
        );
      } else {
        localStorage.setItem(
          'favoriteRecipes',
          JSON.stringify([favoriteRecipe]),
        );
      }
    }
    if (pathname.includes('drinks')) {
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
      const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
      if (favoriteRecipes) {
        localStorage.setItem(
          'favoriteRecipes',
          JSON.stringify([...favoriteRecipes, favoriteRecipe]),
        );
      } else {
        localStorage.setItem('favoriteRecipes', JSON.stringify([favoriteRecipe]));
      }
    }
  };

  useEffect(() => {
    fetchRecipe();
    fetchSuggestions();
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
            <button data-testid="favorite-btn" onClick={ handleFavorites }>
              <img src={ favoriteIcon } alt="favorite icon" />
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
                title={ receipt.strMeal || receipt.strDrink }
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
        onClick={ () => history.push(`${pathname}/in-progress`) }
      >
        Start Recipe
      </button>
    </div>
  );
}
