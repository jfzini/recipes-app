import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../components/Header';
import RecipesContext from '../context/Context';
import Footer from '../components/Footer';
import './css/Recipes.css';
import { PropagateLoader } from 'react-spinners';

export default function Recipes() {
  const { recipes, renderInitialRecipes, filters, renderFilters, renderFilteredRecipes } =
    useContext(RecipesContext);
  const [activeFilter, setActiveFilter] = useState('');
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const history = useHistory();
  const { pathname } = history.location;
  const RECIPES_LIMIT = 11;
  const FILTERS_LIMIT = 4;

  useEffect(() => {
    async function fetchUpdatedFilters() {
      setLoadingFilters(true);
      await renderFilters(pathname);
      setTimeout(() => {
        setLoadingFilters(false);
      }, 300);
    }
    fetchUpdatedFilters();
  }, [pathname]);

  useEffect(() => {
    async function fetchUpdatedRecipes() {
      setLoadingRecipes(true);
      await renderInitialRecipes(pathname);
      setLoadingRecipes(false);
    }
    fetchUpdatedRecipes();
  }, [pathname]);

  useEffect(() => {
    async function fetchInitialData() {
      setLoadingRecipes(true);
      await renderInitialRecipes(pathname);
      await renderFilters(pathname);
      setLoadingRecipes(false);
    }
    fetchInitialData();
  }, []);

  const handleDetail = (id) => {
    history.push(`${pathname}/${id}`);
  };

  const checkFilters = (filter = null) => {
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
    <div className="recipe-page-container">
      <Header />
      {loadingFilters ? (
        <PropagateLoader 
          color="rgba(252, 59, 0, 0.425)"
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className="filters-container">
          <button
            type="button"
            data-testid="All-category-filter"
            onClick={() => {
              renderInitialRecipes(pathname);
              setActiveFilter('');
            }}
            className={ activeFilter === ''
              ? 'filter-button active-filter'
              : 'filter-button inactive-filter'
            }
          >
            All
          </button>
          {filters && filters.length > 1
            ? filters.map((filter, index) => {
                if (index <= FILTERS_LIMIT) {
                  return (
                    <button
                      type="button"
                      key={index}
                      className={checkFilters(filter.strCategory)}
                      data-testid={`${filter.strCategory}-category-filter`}
                      onClick={async () => {
                        if (activeFilter === filter.strCategory) {
                          setActiveFilter('');
                          setLoadingRecipes(true);
                          await renderInitialRecipes(pathname);
                          setLoadingRecipes(false);
                        } else {
                          setActiveFilter(filter.strCategory);
                          setLoadingRecipes(true);
                          await renderFilteredRecipes(pathname, filter.strCategory);
                          setLoadingRecipes(false);
                        }
                      }}
                    >
                      {filter.strCategory}
                    </button>
                  );
                }
                return '';
              })
            : ''}
        </div>
      )}
      {loadingRecipes ? <PropagateLoader 
          color="rgba(252, 59, 0, 0.425)"
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        /> : 
      <div className='recipes-container'>
        {recipes && recipes.length >= 1
          ? recipes.map((recipe, index) => {
              if (index <= RECIPES_LIMIT) {
                return (
                  <div
                    data-testid={`${index}-recipe-card`}
                    key={recipe.idDrink || recipe.idMeal}
                    className="recipe-card"
                    onClick={() => {
                      if (recipe.idDrink) {
                        handleDetail(recipe.idDrink);
                      }
                      if (recipe.idMeal) {
                        handleDetail(recipe.idMeal);
                      }
                    }}
                  >
                    <div
                      data-testid={`${index}-recipe-button`}
                      className='recipe-image-container'
                    >
                      <img
                        src={recipe.strDrinkThumb || recipe.strMealThumb}
                        alt={recipe.strDrink || recipe.strMeal}
                        data-testid={`${index}-card-img`}
                        className='recipe-image'
                      />
                    </div>
                    <p
                      data-testid={`${index}-card-name`}
                      className='recipe-name'
                    >
                      {(recipe.strDrink || recipe.strMeal).slice(0, 24)}
                    </p>
                  </div>
                );
              }
              return '';
            })
          : ''}
      </div>
      }
      {loadingFilters && loadingRecipes ? '' : <Footer />}
    </div>
  );
}
