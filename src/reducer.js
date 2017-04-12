import {Map} from 'immutable';


/* UTILITY FUNCTIONS */
function findItemIndex(collection, itemId) {
  return collection.findIndex(
    (item) => item.get('id') === itemId
  );
}

function setState(state, newState) {
  return state.merge(newState);
}

function cancelPendingCollectionUpdates(collection) {
  // update collection
  // - filter out items where (saved text) item.text === null
  // - set item.isEditing to false
  // - set item.hasPendingUpdate to false
  // - set item.hasPendingDeletion to false
  // - set item.pendingUpdate to null
  return collection.filter( item => item.get('text') )
    .map( item => item.merge({
      isEditing: false,
      hasPendingUpdate: false,
      hasPendingDeletion: false,
      pendingUpdate: null
    }));
}

function commitPendingCollectionUpdates(collection) {
  // update collection
  // - filter out items where item.hasPendingDeletion === true
  // - set all item.text to value stored in item.pendingUpdate
  // - set all item.hasPendingUpdate to false
  // - set all item.pendingUpdate to null
  // - set all item.isEditing to false
  return collection.filter( item => !item.get('hasPendingDeletion') ) 
    .map( item => item.merge({
      isEditing: false,
      hasPendingUpdate: false,
      text: item.get('pendingUpdate') || item.get('text'),
      pendingUpdate: null
    }));
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


/* INGREDIENT REDUCERS */
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


/* PROCESS REDUCERS */
function editStep(state, recipeId, stepId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get stepIndex
  const recipeProcess = recipes.get(recipeIndex)
    .get('process');
  const stepIndex = findItemIndex(recipeProcess, stepId);

  // update step
  // - set isEditing to true
  const updatedStep = recipeProcess.get(stepIndex)
    .set('isEditing', true);


  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'process', stepIndex], updatedStep));
}

function cancelEditingStep(state, recipeId, stepId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get stepIndex
  const recipeProcess = recipes.get(recipeIndex)
    .get('process');
  const stepIndex = findItemIndex(recipeProcess, stepId);

  // if step text has never been set
  // e.g. new step created but canceled with no input,
  // delete step
  if (recipeProcess.get(stepIndex).get('text') === null) {
    return deleteStep(state, recipeIndex, stepIndex);
  }

  // update step
  // - set isEditing to false
  const updatedStep = recipeProcess.get(stepIndex)
    .set('isEditing', false);

  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'process', stepIndex], updatedStep));
}

function doneEditingStep(state, recipeId, stepId, nextState) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get stepIndex
  const recipeProcess = recipes.get(recipeIndex)
    .get('process');
  const stepIndex = findItemIndex(recipeProcess, stepId);

  // if nextState is a blank string,
  // delete step
  if (nextState === '')
    return deleteStep(state, recipeIndex, stepIndex);

  // update recipe, step
  // - set recipe.hasPendingUpdate to true
  // - set step.hasPendingUpdate to true
  // - set step.pendingUpdate to nextState
  // - set step.isEditing to false
  const updatedRecipe = recipes.get(recipeIndex)
    .set('hasPendingUpdate', true)
    .mergeIn(['process', stepIndex], {
      isEditing: false,
      hasPendingUpdate: true,
      pendingUpdate: nextState
    });


  // dispatch new state
  return state.update('recipes', recipes => recipes.set(recipeIndex, updatedRecipe));
}

function addStep(state, recipeId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get nextStepId
  const nextStepId = recipes.get(recipeIndex)
    .get('process')
    .reduce( (maxId, step) => Math.max(maxId, step.get('id')), 0) + 1;

  // create newStep
  const newStep = Map({
    id: nextStepId,
    text: null,
    isEditing: true,
    hasUpdatePending: false,
    hasPendingDeletion: false,
    pendingUpdate: null
  })

  // push newStep to recipe.recipeProcessList
  const updatedSteps = recipes.get(recipeIndex)
    .get('process')
    .push(newStep);

  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'process'], updatedSteps));
}

function deleteStep(state, recipeIndex, stepIndex) {
  return state.update('recipes', recipes => recipes.deleteIn([recipeIndex, 'process', stepIndex]));
}

function scheduleDeleteStep(state, recipeId, stepId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get stepIndex
  const recipeProcess = recipes.get(recipeIndex)
    .get('process');
  const stepIndex = findItemIndex(recipeProcess, stepId);

  // update step
  // - set hasPendingDeletion to true
  const updatedStep = recipeProcess.get(stepIndex)
    .set('hasPendingDeletion', true);

  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'process', stepIndex], updatedStep));
}

function descheduleDeleteStep(state, recipeId, stepId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // get stepIndex
  const recipeProcess = recipes.get(recipeIndex)
    .get('process');
  const stepIndex = findItemIndex(recipeProcess, stepId);

  // update step
  // - set hasPendingDeletion to false
  const updatedStep = recipeProcess.get(stepIndex)
    .set('hasPendingDeletion', false);

  // dispatch new state
  return state.update('recipes', recipes => recipes.setIn([recipeIndex, 'process', stepIndex], updatedStep));
}


export default function (state = Map(), action) {
  switch (action.type) {
    case 'SET_STATE':
      return setState(state, action.state);
    case 'EDIT_RECIPE':
      return editRecipe(state, action.recipeId);
    case 'CANCEL_EDITING_RECIPE':
      return cancelEditingRecipe(state, action.recipeId);
    case 'DONE_EDITING_RECIPE':
      return doneEditingRecipe(state, action.recipeId);
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
    case 'EDIT_STEP':
      return editStep(state, action.recipeId, action.stepId);
    case 'CANCEL_EDITING_STEP':
      return cancelEditingStep(state, action.recipeId, action.stepId);
    case 'DONE_EDITING_STEP':
      return doneEditingStep(state, action.recipeId, action.stepId, action.nextState);
    case 'ADD_STEP':
      return addStep(state, action.recipeId);
    case 'SCHEDULE_DELETE_STEP':
      return scheduleDeleteStep(state, action.recipeId, action.stepId);
    case 'DESCHEDULE_DELETE_STEP':
      return descheduleDeleteStep(state, action.recipeId, action.stepId);
  }

  return state;
}
