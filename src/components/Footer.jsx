import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import drinkIcon from '../images/drinkIcon.png';
import mealIcon from '../images/mealIcon.png';
import './css/Footer.css';

export default function Footer() {
  const history = useHistory();

  return (
    <div data-testid="footer" className="footer-container">
      <button
        type="button"
        className='footer-btn'
        onClick={ () => history.push('/drinks') }
      >
        <img
          src={ drinkIcon }
          alt="drink page"
          data-testid="drinks-bottom-btn"
          className='footer-img'
        />
      </button>
      <button
        type="button"
        onClick={ () => history.push('/meals') }
        className='footer-btn'
      >
        <img
          src={ mealIcon }
          alt="meal page"
          data-testid="meals-bottom-btn"
          className='footer-img'
        />
      </button>
    </div>
  );
}
