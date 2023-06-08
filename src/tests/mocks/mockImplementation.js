// const drinkNameURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
// const drinkIngredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
// const drinkFirstLetterURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';
// const drinksListURL = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
// const drinkCategoryURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=';
// const drinkDetailsURL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';
// const mealNameURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
// const mealIngredientURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';
// const mealFirstLetterURL = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';
// const mealsListURL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
// const mealCategoryURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';
// const mealDetailsURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

// const mockFetch = (url) => {
//   if (url === 'https://api.mercadolibre.com/sites/MLB/categories') {
//     return Promise.resolve({
//       json: () => Promise.resolve(categories),
//     });
//   }

//   if (url.includes('https://api.mercadolibre.com/sites/MLB/search?category=') && url.includes('&q=')) {
//     return Promise.resolve({
//       json: () => Promise.resolve(query),
//     });
//   }

//   if (url.includes('https://api.mercadolibre.com/sites/MLB/search?q=')) {
//     return Promise.resolve({
//       json: () => Promise.resolve(searchQuery),
//     });
//   }

//   if (url.includes('https://api.mercadolibre.com/sites/MLB/search?category=')) {
//     return Promise.resolve({
//       json: () => Promise.resolve(query),
//     });
//   }

//   if (url.includes('https://api.mercadolibre.com/items/')) {
//     return Promise.resolve({
//       json: () => Promise.resolve(details),
//     });
//   }

//   return Promise.reject('Houve algo de errado com o endpoint, verifique se ele está correto');
// };

// module.exports = mockFetch;
