const nameURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const ingredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
const firstLetterURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';
const drinksListURL = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
const filteredDrinksURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=';

export async function fetchDrinkByName(name = '') {
  try {
    const response = await fetch(`${nameURL}${name}`);
    const data = await response.json();
    return data.drinks;
  } catch (error) {
    console.log(error.message);
  }
}

export async function fetchDrinkByIngredient(ingredient) {
  try {
    const response = await fetch(`${ingredientURL}${ingredient}`);
    const data = await response.json();
    return data.drinks;
  } catch (error) {
    console.log(error.message);
  }
}

export async function fetchDrinkByFirstLetter(firstLetter) {
  try {
    const response = await fetch(`${firstLetterURL}${firstLetter}`);
    const data = await response.json();
    return data.drinks;
  } catch (error) {
    console.log(error.message);
  }
}

export async function fetchDrinksList() {
  try {
    const response = await fetch(`${drinksListURL}`);
    const data = await response.json();
    return data.drinks;
  } catch (error) {
    console.log(error.message);
  }
}

export async function fetchFilteredDrinks(category) {
  try {
    const response = await fetch(`${filteredDrinksURL}${category}`);
    const data = await response.json();
    return data.drinks;
  } catch (error) {
    console.log(error.message);
  }
}
