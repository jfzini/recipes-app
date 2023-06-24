import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchMealByID, fetchMealByName } from '../services/theMealApi';
import { fetchDrinkByID, fetchDrinkByName } from '../services/theCocktailApi';
import { saveFavoriteRecipe } from '../services/storage';
import './RecipeDetails.css';
import RecipeData from '../components/RecipeData';

export default function RecipeDetails() {
  const history = useHistory();
  const { pathname } = history.location;
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [inProgress, setInProgress] = useState(false);

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

  const checkInProgress = () => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (inProgressRecipes) {
      const { meals, drinks } = inProgressRecipes;
      if (pathname.includes('meals') && meals[id]) {
        setInProgress(true);
      }
      if (pathname.includes('drinks') && drinks[id]) {
        setInProgress(true);
      }
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
      <RecipeData
        recipe={ recipe }
        id={ id }
        favorite={ favorite }
        handleFavorites={ handleFavorites }
        type={ pathname.includes('in-progress') ? 'progress' : 'details' }
        suggestions={ suggestions }
        startRecipe={ startRecipe }
        inProgress={ inProgress }
      />
    </div>
  );
}
