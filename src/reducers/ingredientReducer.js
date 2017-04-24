import {List, Map} from 'immutable';
import {
  findItemIndex,
  cancelPendingCollectionUpdates,
  commitPendingCollectionUpdates
} from './reducerUtilities.js';


/* INGREDIENT REDUCER */
export default function (state = List(), action) {
  switch (action.type) {
    case 'EDIT_INGREDIENT':
      return editIngredient(state, action.recipeId, action.ingredientId);
    case 'CANCEL_EDITING_INGREDIENT':
      return cancelEditingIngredient(state, action.recipeId, action.ingredientId);
    case 'DONE_EDITING_INGREDIENT':
      return doneEditingIngredient(state, action.recipeId, action.ingredientId, action.nextState);
    case 'ADD_INGREDIENT':
      return addIngredient(state, action.recipeId);
    case 'SCHEDULE_DELETE_INGREDIENT':
      return scheduleDeleteIngredient(state, action.recipeId, action.ingredientId);
    case 'DESCHEDULE_DELETE_INGREDIENT':
      return descheduleDeleteStep(state, action.recipeId, action.ingredientId);
    default:
      return state;
  }
}


function editIngredient(state, recipeId, ingredientId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get ingredientIndex
  const ingredients = recipes.get(recipeIndex)
    .get('ingredients');
  const ingredientIndex = findItemIndex(ingredients, ingredientId);

  // update ingredient
  // - set isEditing to true
  const updatedIngredient = ingredients.get(ingredientIndex)
    .set('isEditing', true);


  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'ingredients', ingredientIndex], updatedIngredient));
}

function cancelEditingIngredient(state, recipeId, ingredientId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get ingredientIndex
  const ingredients = recipes.get(recipeIndex)
    .get('ingredients');
  const ingredientIndex = findItemIndex(ingredients, ingredientId);

  // if ingredient text has never been set
  // e.g. new ingredient created but canceled with no input,
  // delete ingredient
  if (ingredients.get(ingredientIndex).get('text') === null) {
    return deleteIngredient(state, recipeIndex, ingredientIndex);
  }

  // update ingredient
  // - set isEditing to false
  const updatedIngredient = ingredients.get(ingredientIndex)
    .set('isEditing', false);

  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'ingredients', ingredientIndex], updatedIngredient));
}

function doneEditingIngredient(state, recipeId, ingredientId, nextState) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get ingredientIndex
  const ingredients = recipes.get(recipeIndex)
    .get('ingredients');
  const ingredientIndex = findItemIndex(ingredients, ingredientId);

  // if nextState is a blank string,
  // delete ingredient
  if (nextState === '')
    return deleteIngredient(state, recipeIndex, ingredientIndex);

  // update recipe, ingredient
  // - set recipe.hasPendingUpdate to true
  // - set ingredient.hasPendingUpdate to true
  // - set ingredient.pendingUpdate to nextState
  // - set ingredient.isEditing to false
  const updatedRecipe = recipes.get(recipeIndex)
    .set('hasPendingUpdate', true)
    .mergeIn(['ingredients', ingredientIndex], {
      isEditing: false,
      hasPendingUpdate: true,
      pendingUpdate: nextState
    });


  // dispatch new state
  return state.update('recipes', recipes => recipes.set(recipeIndex, updatedRecipe));
}

function addIngredient(state, recipeId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get nextIngredientId
  const nextIngredientId = recipes.get(recipeIndex)
    .get('ingredients')
    .reduce( (maxId, ingredient) => Math.max(maxId, ingredient.get('id')), 0) + 1;

  // create newIngredient
  const newIngredient = Map({
    id: nextIngredientId,
    text: null,
    isEditing: true,
    hasUpdatePending: false,
    hasPendingDeletion: false,
    pendingUpdate: null
  })

  // push newIngredient to recipe.ingredientsList
  const updatedIngredients = recipes.get(recipeIndex)
    .get('ingredients')
    .push(newIngredient);

  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'ingredients'], updatedIngredients));
}

function deleteIngredient(state, recipeIndex, ingredientIndex) {
  return state.update('recipes', recipes => recipes.deleteIn([recipeIndex, 'ingredients', ingredientIndex]));
}

function scheduleDeleteIngredient(state, recipeId, ingredientId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get ingredientIndex
  const ingredients = recipes.get(recipeIndex)
    .get('ingredients');
  const ingredientIndex = findItemIndex(ingredients, ingredientId);

  // update ingredient
  // - set hasPendingDeletion to true
  const updatedIngredient = ingredients.get(ingredientIndex)
    .set('hasPendingDeletion', true);

  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'ingredients', ingredientIndex], updatedIngredient));
}

function descheduleDeleteIngredient(state, recipeId, ingredientId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get ingredientIndex
  const ingredients = recipes.get(recipeIndex)
    .get('ingredients');
  const ingredientIndex = findItemIndex(ingredients, ingredientId);

  // update ingredient
  // - set hasPendingDeletion to false
  const updatedIngredient = ingredients.get(ingredientIndex)
    .set('hasPendingDeletion', false);

  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'ingredients', ingredientIndex], updatedIngredient));
}
