import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Profile() {
  const [email, setEmail] = useState();
  const history = useHistory();

  const clearLocalStorage = () => {
    history.push('/');
    localStorage.removeItem('user');
    localStorage.removeItem('favoriteRecipes');
    localStorage.removeItem('doneRecipes');
    localStorage.removeItem('inProgressRecipes');
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const userEmail = user.email;
      setEmail(userEmail);
    }
  });

  return (
    <div>
      <Header />
      { email && <p data-testid="profile-email">{email}</p> }
      <button
        data-testid="profile-done-btn"
        onClick={ () => history.push('/done-recipes') }
      >
        Done Recipes
      </button>
      <button
        data-testid="profile-favorite-btn"
        onClick={ () => history.push('/favorite-recipes') }
      >
        Favorite Recipes
      </button>
      <button
        data-testid="profile-logout-btn"
        onClick={ () => clearLocalStorage() }
      >
        Logout
      </button>
      <Footer />
    </div>
  );
}
