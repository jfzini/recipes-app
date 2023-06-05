import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Header() {
  const history = useHistory();
  const [headerData, setHeaderData] = useState({
    title: '',
    renderSearchIcon: true,
    showSearchBar: false,
  });
  // const [search, setSearch] = useState({
  //   search: '',
  // });

  const { pathname } = history.location;

  useEffect(() => {
    switch (pathname) {
    case '/meals':
      setHeaderData({ ...headerData, title: 'Meals' });
      break;
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
    }
  }, [pathname]);

  return (
    <div>
      <h1 data-testid="page-title">{headerData.title}</h1>

      {headerData.renderSearchIcon
        && (
          <button
            onClick={ () => setHeaderData({ ...headerData, showSearchBar: !headerData.showSearchBar }) }
          >
            <img
              src="src/images/searchIcon.svg"
              alt="search-icon"
              data-testid="search-top-btn"
            />
          </button>
        )}
      <button
        onClick={ () => history.push('/profile') }
      >
        <img
          src="src/images/profileIcon.svg"
          alt="profile-icon"
          data-testid="profile-top-btn"
        />
      </button>
      {headerData.showSearchBar && <SearchBar />}
    </div>
  );
}
