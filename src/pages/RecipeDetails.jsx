import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchMealByID, fetchMealByName } from '../services/theMealApi';
import { fetchDrinkByID, fetchDrinkByName } from '../services/theCocktailApi';

export default function RecipeDetails() {
  const history = useHistory();
  const { pathname } = history.location;
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

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
      {suggestions
        && suggestions.map((suggestion, index) => (
          <div key={ index }>
            {suggestion.idDrink || suggestion.idMeal}
          </div>))}
    </div>
  );
}
