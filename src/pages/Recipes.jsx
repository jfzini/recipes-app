import React, { useContext } from 'react';
import Header from '../components/Header';
import RecipesContext from '../context/Context';

export default function Recipes() {
  const { recipes } = useContext(RecipesContext);
  const RECIPES_LIMIT = 11;

  return (
    <div>
      <Header />
      <div>
        {recipes && recipes.length > 1
          ? (recipes.map((recipe, index) => {
            if (index <= RECIPES_LIMIT) {
              return (
                <div
                  data-testid={ `${index}-recipe-card` }
                  key={ recipe.idDrink || recipe.idMeal }
                >
                  <img
                    src={ recipe.strDrinkThumb || recipe.strMealThumb }
                    alt=""
                    data-testid={ `${index}-card-img` }
                  />
                  <p
                    data-testid={ `${index}-card-name` }
                  >
                    {recipe.strDrink || recipe.strMeal}
                  </p>
                </div>
              );
            }
            return '';
          }))
          : ''}
      </div>
    </div>
  );
}
