import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SearchBar from './SearchBar';
import searchIcon from '../images/searchIcon.png';
import profileIcon from '../images/profileIcon.png';
import './css/Header.css';

export default function Header() {
  const history = useHistory();
  const [headerData, setHeaderData] = useState({
    title: '',
    renderSearchIcon: true,
    showSearchBar: false,
  });

  const { pathname } = history.location;

  useEffect(() => {
    switch (pathname) {
      case '/drinks':
        setHeaderData({ ...headerData, title: 'Drinks' });
        break;
      case '/profile':
        setHeaderData({ ...headerData, title: 'Profile', renderSearchIcon: false });
        break;
      case '/done-recipes':
        setHeaderData({ ...headerData, title: 'Done Recipes', renderSearchIcon: false });
        break;
      case '/favorite-recipes':
        setHeaderData({
          ...headerData,
          title: 'Favorite Recipes',
          renderSearchIcon: false,
        });
        break;
      default:
        setHeaderData({ ...headerData, title: 'Meals' });
        break;
    }
  }, [pathname]);

  return (
    <div className='header-container'>
      <div className="icons-container">
        <button onClick={() => history.push('/profile')}>
          <img
            src={profileIcon}
            alt="profile-icon"
            data-testid="profile-top-btn"
            className='header-img'
          />
        </button>
        <h1
          data-testid="page-title"
          className={headerData.title === "Done Recipes" 
            || headerData.title === "Favorite Recipes"
              ? "header-title done-recipes-title"
              : "header-title"}
        >
          {headerData.title}
        </h1>
        <div>
          {headerData.renderSearchIcon && (
            <button
              type="button"
              className={headerData.showSearchBar ? 'search-icon' : ''}
              onClick={() =>
                setHeaderData({
                  ...headerData,
                  showSearchBar: !headerData.showSearchBar,
                })
              }
            >
              <img
                src={searchIcon}
                alt="search-icon"
                data-testid="search-top-btn"
                className='header-img'
              />
            </button>
          )}
        </div>
      </div>
      {headerData.showSearchBar && <SearchBar />}
    </div>
  );
}
