import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../components/Header';
import RecipesContext from '../context/Context';
import Footer from '../components/Footer';

export default function Recipes() {
  const {
    recipes,
    renderInitialRecipes,
    filters,
    renderFilters,
    renderFilteredRecipes,
  } = useContext(RecipesContext);
  const [activeFilter, setActiveFilter] = useState(false);
  const history = useHistory();
  const { pathname } = history.location;
  const RECIPES_LIMIT = 11;
  const FILTERS_LIMIT = 4;

  useEffect(() => {
    renderFilters(pathname);
  }, [pathname, filters]);

  useEffect(() => {
    renderInitialRecipes(pathname);
  }, [pathname]);

  useEffect(() => {
    renderInitialRecipes(pathname);
    renderFilters(pathname);
  }, []);

  const handleDetail = (id) => {
    history.push(`${pathname}/${id}`);
  };

  return (
    <div>
      <Header />
      <div>
        <button
          type="button"
          data-testid="All-category-filter"
          onClick={ () => renderInitialRecipes(pathname) }
        >
          All
        </button>
        {filters && filters.length > 1
          ? filters.map((filter, index) => {
            if (index <= FILTERS_LIMIT) {
              return (
                <button
                  type="button"
                  key={ index }
                  data-testid={ `${filter.strCategory}-category-filter` }
                  onClick={ () => {
                    if (activeFilter) {
                      renderInitialRecipes(pathname);
                    } else {
                      renderFilteredRecipes(pathname, filter.strCategory);
                    }
                    setActiveFilter(!activeFilter);
                  } }
                >
                  {filter.strCategory}
                </button>
              );
            }
            return '';
          })
          : ''}
      </div>
      <div>
        {recipes && recipes.length >= 1
          ? recipes.map((recipe, index) => {
            if (index <= RECIPES_LIMIT) {
              return (
                <div
                  data-testid={ `${index}-recipe-card` }
                  key={ recipe.idDrink || recipe.idMeal }
                >
                  <button
                    type="button"
                    onClick={ () => {
                      if (recipe.idDrink) {
                        handleDetail(recipe.idDrink);
                      }
                      if (recipe.idMeal) {
                        handleDetail(recipe.idMeal);
                      }
                    } }
                  >
                    <img
                      src={ recipe.strDrinkThumb || recipe.strMealThumb }
                      alt=""
                      data-testid={ `${index}-card-img` }
                    />
                  </button>
                  <p
                    data-testid={ `${index}-card-name` }
                  >
                    {recipe.strDrink || recipe.strMeal}
                  </p>
                </div>
              );
            }
            return '';
          })
          : ''}
      </div>
      <Footer />
    </div>
  );
}
