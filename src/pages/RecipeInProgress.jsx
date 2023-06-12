import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import copy from 'clipboard-copy';
import { fetchMealByID } from '../services/theMealApi';
import { fetchDrinkByID } from '../services/theCocktailApi';
import { saveFavoriteRecipe } from '../services/storage';
import shareIcon from '../images/shareIcon.svg';
import blackFavoriteIcon from '../images/blackHeartIcon.svg';
import whiteFavoriteIcon from '../images/whiteHeartIcon.svg';
import './RecipeInProgress.css';

export default function RecipeInProgress() {
  const [recipe, setRecipe] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { id } = useParams();
  const [usedIngredients, setUsedIngredients] = useState([]);
  const history = useHistory();
  const { pathname } = history.location;

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

  const handleCopy = () => {
    const filteredPathname = pathname.replace('/in-progress', '');
    copy(`http://localhost:3000${filteredPathname}`);
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
    if (favorite) {
      const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
      if (favoriteRecipes) {
        favoriteRecipes.forEach((favoriteRecipe) => {
          if (pathname.includes(favoriteRecipe.id)) {
            setFavorite(false);
            const removedFavorite = favoriteRecipes.filter(
              (filterRecipe) => filterRecipe.id !== favoriteRecipe.id,
            );
            localStorage.setItem('favoriteRecipes', JSON.stringify(removedFavorite));
          }
        });
      }
    } else {
      if (pathname.includes('meals')) {
        addFavoriteMeal();
      }
      if (pathname.includes('drinks')) {
        addFavoriteDrink();
      }
    }
  };

  const checkFavorite = () => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes) {
      favoriteRecipes.forEach(
        (favoriteRecipe) => pathname.includes(favoriteRecipe.id) && setFavorite(true),
      );
    }
  };

  const saveRecipe = (ingredients) => {
    const pattern = { drinks: {}, meals: {} };
    if (pathname.includes('meals')) {
      const recipeInProgress = { ...pattern, meals: { [id]: ingredients } };
      localStorage.setItem('inProgressRecipes', JSON.stringify(recipeInProgress));
    }
    if (pathname.includes('drinks')) {
      const recipeInProgress = { ...pattern, drinks: { [id]: ingredients } };
      localStorage.setItem('inProgressRecipes', JSON.stringify(recipeInProgress));
    }
  };

  const handleUsedIngredients = (ingredient) => {
    if (usedIngredients.includes(ingredient)) {
      const removedIngredient = usedIngredients
        .filter((usedIngredient) => usedIngredient !== ingredient);
      setUsedIngredients(removedIngredient);
      saveRecipe(removedIngredient);
    } else {
      setUsedIngredients([...usedIngredients, ingredient]);
      saveRecipe([...usedIngredients, ingredient]);
    }
  };

  const checkUsedIngredients = () => {
    const recipeInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (recipeInProgress) {
      if (pathname.includes('meals')) {
        const ingredientsUsed = Object.values(recipeInProgress.meals[id]);
        setUsedIngredients(ingredientsUsed);
      }
      if (pathname.includes('drinks')) {
        const ingredientsUsed = Object.values(recipeInProgress.drinks[id]);
        setUsedIngredients(ingredientsUsed);
      }
    }
  };

  const handleFinishRecipe = (doneRecipe) => {
    history.push('/done-recipes');
    const doneRecipeData = {
      id,
      type: pathname.includes('meals') ? 'meal' : 'drink',
      nationality: doneRecipe.strArea || '',
      category: doneRecipe.strCategory,
      alcoholicOrNot: doneRecipe.strAlcoholic || '',
      name: doneRecipe.strMeal || doneRecipe.strDrink,
      image: doneRecipe.strMealThumb || doneRecipe.strDrinkThumb,
      doneDate: new Date(),
      tags: doneRecipe.strTags ? doneRecipe.strTags.split(',') : [],
    };
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    if (doneRecipes) {
      localStorage
        .setItem('doneRecipes', JSON.stringify([...doneRecipes, doneRecipeData]));
    } else {
      localStorage
        .setItem('doneRecipes', JSON.stringify([doneRecipeData]));
    }
  };

  useEffect(() => {
    fetchRecipe();
    checkFavorite();
    checkUsedIngredients();
  }, []);

  return (
    <div>
      {recipe
        && recipe.map((receipt) => (
          <div key={ id }>
            <h4 data-testid="recipe-title">{receipt.strMeal || receipt.strDrink}</h4>
            <img
              src={ receipt.strMealThumb || receipt.strDrinkThumb }
              alt={ receipt.strMeal || receipt.strDrink }
              data-testid="recipe-photo"
            />
            <button data-testid="share-btn" onClick={ handleCopy }>
              <img src={ shareIcon } alt="share icon" />
            </button>
            {linkCopied && <span>Link copied!</span>}
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
              {pathname.includes('/meals') ? receipt.strCategory : receipt.strAlcoholic}
            </p>
            <ul>
              {Object.keys(receipt)
                .filter((key) => key.includes('strIngredient') && receipt[key])
                .map((ingredient, index) => (
                  <div key={ index }>
                    <label
                      htmlFor={ `${index}-ingredient-checkbox` }
                      data-testid={ `${index}-ingredient-step` }
                      className={ usedIngredients.includes(receipt[ingredient])
                        ? 'checked-ingredient'
                        : '' }
                    >
                      {receipt[ingredient]}
                      {' - '}
                      {receipt[ingredient.replace('strIngredient', 'strMeasure')]}
                      <input
                        type="checkbox"
                        id={ `${index}-ingredient-checkbox` }
                        onClick={ () => handleUsedIngredients(receipt[ingredient]) }
                        checked={ usedIngredients.includes(receipt[ingredient]) }
                      />
                    </label>
                  </div>
                ))}
            </ul>
            <p data-testid="instructions">{receipt.strInstructions}</p>
            <button
              data-testid="finish-recipe-btn"
              disabled={
                Object.keys(receipt)
                  .filter((key) => key
                    .includes('strIngredient') && receipt[key]).length
                  !== usedIngredients.length
              }
              onClick={ () => handleFinishRecipe(receipt) }
            >
              Finalizar receita
            </button>
          </div>
        ))}
    </div>
  );
}
