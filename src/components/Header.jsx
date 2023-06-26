import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SearchBar from './SearchBar';
import searchIcon from '../images/searchIcon.svg';
import profileIcon from '../images/profileIcon.svg';
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
          <img src={profileIcon} alt="profile-icon" data-testid="profile-top-btn" />
        </button>
        <h1 data-testid="page-title" className="header-title">
          {headerData.title}
        </h1>
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
            <img src={searchIcon} alt="search-icon" data-testid="search-top-btn" />
          </button>
        )}
      </div>
      {headerData.showSearchBar && <SearchBar />}
    </div>
  );
}
