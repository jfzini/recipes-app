import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import ContextProvider from './context/ContextProvider';
import Login from './pages/Login';
import Recipes from './pages/Recipes';
import RecipeInProgress from './pages/RecipeInProgress';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/Profile';
import DoneRecipes from './pages/DoneRecipes';
import FavoriteRecipes from './pages/FavoriteRecipes';

function App() {
  return (
    <ContextProvider>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route path="/meals" component={ Recipes } />
        <Route path="/drinks" component={ Recipes } />
        <Route path="/drinks/:id-da-receita" component={ RecipeDetails } />
        <Route path="/meals/:id-da-receita" component={ RecipeDetails } />
        <Route path="/meals/:id-da-receita/in-progress" component={ RecipeInProgress } />
        <Route path="/drinks/:id-da-receita/in-progress" component={ RecipeInProgress } />
        <Route path="/profile" component={ Profile } />
        <Route path="/done-recipes" component={ DoneRecipes } />
        <Route path="/favorite-recipes" component={ FavoriteRecipes } />
      </Switch>
    </ContextProvider>
  );
}

export default App;
