import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../components/Header';
import RecipesContext from '../context/Context';
import Footer from '../components/Footer';
import './css/Recipes.css';

export default function Recipes() {
  const {
    recipes,
    renderInitialRecipes,
    filters,
    renderFilters,
    renderFilteredRecipes,
  } = useContext(RecipesContext);
  const [activeFilter, setActiveFilter] = useState('');
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

  const checkFilters = (filter=null) => {
    if (filter === activeFilter) {
      return 'filter-button active-filter';
    }
    if (activeFilter === '') {
      return 'filter-button';
    }
    if (filter !== activeFilter) {
      return 'filter-button inactive-filter';
    }
    return 'filter-button';
  };

  return (
    <div className='recipe-page-container'>
      <Header />
      <div className='filters-container'>
        <button
          type="button"
          data-testid="All-category-filter"
          onClick={ () => {
            renderInitialRecipes(pathname)
            setActiveFilter('');
          } }
          className={checkFilters()}
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
                  className={checkFilters(filter.strCategory)}
                  data-testid={ `${filter.strCategory}-category-filter` }
                  onClick={ () => {
                    if (activeFilter === filter.strCategory) {
                      renderInitialRecipes(pathname);
                      setActiveFilter('');
                    } else {
                      renderFilteredRecipes(pathname, filter.strCategory);
                      setActiveFilter(filter.strCategory);
                    }
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
                    data-testid={ `${index}-recipe-button` }
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
