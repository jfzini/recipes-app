import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards } from 'swiper';

export default function Carousel({ suggestions, CAROUSEL_LIMIT }) {
  const history = useHistory();

  return (
    <Swiper
      effect="cards"
      grabCursor
      modules={ [EffectCards] }
      className="mySwiper"
    >
      {suggestions
        && suggestions.map((suggestion, index) => {
          if (index <= CAROUSEL_LIMIT) {
            return (
              <SwiperSlide>
                <div
                  key={ index }
                  data-testid={ `${index}-recommendation-card` }
                  onClick={ () => history.push(`/${suggestion.idMeal ? 'meals' : 'drinks'}/${suggestion.idMeal || suggestion.idDrink}`) }
                >
                  <img
                    src={ suggestion.strMealThumb || suggestion.strDrinkThumb }
                    alt={ suggestion.strMeal || suggestion.strDrink }
                    className="carousel-img"
                  />
                  <p data-testid={ `${index}-recommendation-title` } className="carousel-title">
                    {suggestion.strMeal || suggestion.strDrink}
                  </p>
                </div>
              </SwiperSlide>
            );
          }
          return null;
        })}
    </Swiper>
  );
}
