import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/Profile.css';

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
    <div className="detail-page-container">
      <Header />
      { email
        && <p
          data-testid="profile-email"
          className="user-email"
        >
          {email}
           </p>}
      <section className="profile-link-container">
        <button
          data-testid="profile-done-btn"
          className="filter-button"
          onClick={ () => history.push('/done-recipes') }
        >
          Done Recipes
        </button>
        <button
          data-testid="profile-favorite-btn"
          className="filter-button"
          onClick={ () => history.push('/favorite-recipes') }
        >
          Favorite Recipes
        </button>
        <button
          data-testid="profile-logout-btn"
          className="filter-button active-filter"
          onClick={ () => clearLocalStorage() }
        >
          Logout
        </button>
      </section>
      <Footer />
    </div>
  );
}
