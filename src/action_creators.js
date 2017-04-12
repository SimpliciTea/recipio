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

/*
 *  Process Actions
 */

export function editStep(recipeId, stepId) {
  return {
    type: 'EDIT_STEP',
    recipeId,
    stepId
  }
}

export function deleteStep(recipeId, stepId) {
  return {
    type: 'SCHEDULE_DELETE_STEP',
    recipeId,
    stepId
  }
}

export function doneEditingStep(recipeId, stepId, nextState) {
  return {
    type: 'DONE_EDITING_STEP',
    recipeId,
    stepId,
    nextState
  }
}

export function addStep(recipeId) {
  return {
    type: 'ADD_STEP',
    recipeId
  }
}

export function cancelDeletingStep(recipeId, stepId) {
  return {
    type: 'DESCHEDULE_DELETE_STEP',
    recipeId,
    stepId
  }
}

export function cancelEditingStep(recipeId, stepId) {
  return {
    type: 'CANCEL_EDITING_STEP',
    recipeId,
    stepId
  }
}


// delete recipe
// create recipe
