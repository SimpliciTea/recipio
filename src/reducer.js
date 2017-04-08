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


/* RECIPE REDUCERS */
function editRecipe(state, recipeId) {
  const recipeIndex = findItemIndex(state.get('recipes'), recipeId);

  const updatedItem = state.get('recipes')
    .get(recipeIndex)
    .set('isEditing', true);

  return state.update('recipes', recipes => recipes.set(recipeIndex, updatedItem));
}

function cancelEditingRecipe(state, recipeId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // update ingredients
  // - filter out ingredients with null ingredient.text
  // - set all ingredient.isEditing to false
  // - set all ingredient.hasPendingUpdate to false
  // - set all ingredient.hasPendingDeletion to false
  // - set all ingredient.pendingUpdate to null
  const updatedIngredients = recipes.get(recipeIndex)
    .get('ingredients')
    .filter( ingredient => ingredient.get('text') )
    .map( ingredient => ingredient.merge({
      isEditing: false,
      hasPendingUpdate: false,
      hasPendingDeletion: false,
      pendingUpdate: null
    }));

  // update recipe
  // - set isEditing to false
  // - set hasPendingUpdate to false
  // - merge in updatedIngredients
  const updatedRecipe = recipes.get(recipeIndex)
    .merge({
      isEditing: false,
      hasPendingUpdate: false,
      ingredients: updatedIngredients
    });

  return state.update('recipes', recipes => recipes.set(recipeIndex, updatedRecipe)); 
}

function doneEditingRecipe(state, recipeId) {
  // get recipeIndex
  const recipes = state.get('recipes');
  const recipeIndex = findItemIndex(recipes, recipeId);

  // update ingredients
  // - filter out ingredients where ingredient.hasPendingDeletion === true
  // - set all ingredient.text to value stored in ingredient.pendingUpdate
  // - set all ingredient.hasPendingUpdate to false
  // - set all ingredient.pendingUpdate to null
  // - set all ingredient.isEditing to false
  const updatedIngredients = recipes.get(recipeIndex)
    .get('ingredients')
    .filter( ingredient => !ingredient.get('hasPendingDeletion') ) 
    .map( ingredient => ingredient.merge({
      isEditing: false,
      hasPendingUpdate: false,
      text: ingredient.get('pendingUpdate') || ingredient.get('text'),
      pendingUpdate: null
    }));

  // update recipe
  // - set isEditing to false
  // - set hasPendingUpdate to false
  // - merge in updatedIngredients
  const updatedRecipe = recipes.get(recipeIndex)
    .merge({
      ingredients: updatedIngredients,
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
      return descheduleDeleteIngredient(state, action.recipeId, action.ingredientId);
  }

  return state;
}
