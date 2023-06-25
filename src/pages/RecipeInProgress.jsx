import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchMealByID } from '../services/theMealApi';
import { fetchDrinkByID } from '../services/theCocktailApi';
import { saveFavoriteRecipe } from '../services/storage';
import RecipeData from '../components/RecipeData';
import './css/RecipeInProgress.css';

export default function RecipeInProgress() {
  const [recipe, setRecipe] = useState(null);
  const [favorite, setFavorite] = useState(false);
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
      favoriteRecipes.forEach((favoriteRecipe) => {
        if (pathname.includes(favoriteRecipe.id)) {
          setFavorite(false);
          const removedFavorite = favoriteRecipes.filter(
            (filterRecipe) => filterRecipe.id !== favoriteRecipe.id,
          );
          localStorage.setItem('favoriteRecipes', JSON.stringify(removedFavorite));
        }
      });
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

  const finishRecipe = (doneRecipe) => {
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
      <RecipeData
        recipe={ recipe }
        id={ id }
        favorite={ favorite }
        handleFavorites={ handleFavorites }
        type={ pathname.includes('in-progress') ? 'progress' : 'details' }
        finishRecipe={ finishRecipe }
        usedIngredients={ usedIngredients }
        handleUsedIngredients={ handleUsedIngredients }
      />
    </div>
  );
}
