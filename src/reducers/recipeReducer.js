import {List} from 'immutable';

import {
  findItemIndex,
  cancelPendingCollectionUpdates,
  commitPendingCollectionUpdates
} from './reducerUtilities.js';


/* RECIPE REDUCER */
export default function (state = List(), action) {
  switch (action.type) {
    case 'EDIT_RECIPE':
      return editRecipe(state, action.recipeId);
    case 'CANCEL_EDITING_RECIPE':
      return cancelEditingRecipe(state, action.recipeId);
    case 'DONE_EDITING_RECIPE':
      return doneEditingRecipe(state, action.recipeId);
    default:
      return state;
  }
}

/* RECIPE REDUCERS */
function editRecipe(state, recipeId) {
  const recipeIndex = findItemIndex(state.get('recipes'), recipeId);

  const updatedItem = state.get('recipes')
    .get(recipeIndex)
    .set('isEditing', true);

  return state.update('recipes', recipes => recipes.set(recipeIndex, updatedItem));
}

function cancelEditingRecipe(state, recipeId) {
  // get recipeIndex, recipe
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);
  const recipe = recipes.get(recipeIndex);

  // update ingredients
  const ingredients = recipe.get('ingredients');
  const updatedIngredients = cancelPendingCollectionUpdates(ingredients);

  // update process
  const recipeProcess = recipe.get('process');
  const updatedProcess = cancelPendingCollectionUpdates(recipeProcess);

  // update recipe
  // - set isEditing to false
  // - set hasPendingUpdate to false
  // - merge in updatedIngredients
  // - merge in updatedProcess
  const updatedRecipe = recipes.get(recipeIndex)
    .merge({
      isEditing: false,
      hasPendingUpdate: false,
      ingredients: updatedIngredients,
      process: updatedProcess
    });

  return state.update('recipes', recipes => recipes.set(recipeIndex, updatedRecipe)); 
}

function doneEditingRecipe(state, recipeId) {
  // get recipeIndex, recipe
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);
  const recipe = recipes.get(recipeIndex);

  // update ingredients
  const ingredients = recipe.get('ingredients');
  const updatedIngredients = commitPendingCollectionUpdates(ingredients);

  // update process
  const recipeProcess = recipe.get('process');
  const updatedProcess = commitPendingCollectionUpdates(recipeProcess);

  // update recipe
  // - set isEditing to false
  // - set hasPendingUpdate to false
  // - merge in updatedIngredients
  // - merge in updatedProcess
  const updatedRecipe = recipes.get(recipeIndex)
    .merge({
      ingredients: updatedIngredients,
      process: updatedProcess,
      isEditing: false,
      hasPendingUpdate: false
    });

  // dispatch new state
  return state.update('recipes', recipes => recipes.set(recipeIndex, updatedRecipe));
}
