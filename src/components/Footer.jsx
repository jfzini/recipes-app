import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';
import './Footer.css';

export default function Footer() {
  const history = useHistory();

  return (
    <div data-testid="footer" className='footer-menu'>
      <button
        type="button"
        onClick={ () => history.push('/drinks') }
      >
        <img
          src={ drinkIcon }
          alt="drink page"
          data-testid="drinks-bottom-btn"
        />
      </button>
      <button
        type="button"
        onClick={ () => history.push('/meals') }
      >
        <img
          src={ mealIcon }
          alt="meal page"
          data-testid="meals-bottom-btn"
        />
      </button>
    </div>
  );
}
