const nameURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const ingredientURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';
const firstLetterURL = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';

export async function fetchMealByName(name) {
  try {
    const response = await fetch(`${nameURL}${name}`);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.log(error.message);
  }
}

export async function fetchMealByIngredient(ingredient) {
  try {
    const response = await fetch(`${ingredientURL}${ingredient}`);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.log(error.message);
  }
}

export async function fetchMealByFirstLetter(firstLetter) {
  try {
    const response = await fetch(`${firstLetterURL}${firstLetter}`);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.log(error.message);
  }
}
