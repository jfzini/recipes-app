export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const saveFavoriteRecipe = (favoriteRecipe) => {
  const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
  if (favoriteRecipes) {
    localStorage.setItem(
      'favoriteRecipes',
      JSON.stringify([...favoriteRecipes, favoriteRecipe]),
    );
  } else {
    localStorage.setItem(
      'favoriteRecipes',
      JSON.stringify([favoriteRecipe]),
    );
  }
};
