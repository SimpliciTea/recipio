/*
 *  Recipe Actions
 */

export function editRecipe(recipeId) {
  return {
    type: 'EDIT_RECIPE',
    recipeId
  }
}

export function saveRecipe(recipeId) {
  return {
    type: 'SAVE_RECIPE',
    recipeId
  }
}

export function cancelEditingRecipe(recipeId) {
  return {
    type: 'CANCEL_EDITING_RECIPE',
    recipeId
  }
}

export function doneEditingRecipe(recipeId) {
  return {
    type: 'DONE_EDITING_RECIPE',
    recipeId
  }
}


/*
 *  Ingredient Actions
 */

export function editIngredient(recipeId, ingredientId) {
  return {
    type: 'EDIT_INGREDIENT',
    recipeId,
    ingredientId
  }
}

export function deleteIngredient(recipeId, ingredientId) {
  return {
    type: 'SCHEDULE_DELETE_INGREDIENT',
    recipeId,
    ingredientId
  }
}

export function doneEditingIngredient(recipeId, ingredientId, nextState) {
  return {
    type: 'DONE_EDITING_INGREDIENT',
    recipeId,
    ingredientId,
    nextState
  }
}

export function addIngredient(recipeId) {
  return {
    type: 'ADD_INGREDIENT',
    recipeId
  }
}

export function cancelDeletingIngredient(recipeId, ingredientId) {
  return {
    type: 'DESCHEDULE_DELETE_INGREDIENT',
    recipeId,
    ingredientId
  }
}

export function cancelEditingIngredient(recipeId, ingredientId) {
  return {
    type: 'CANCEL_EDITING_INGREDIENT',
    recipeId,
    ingredientId
  }
}

// add ingredient

// delete recipe
// create recipe
