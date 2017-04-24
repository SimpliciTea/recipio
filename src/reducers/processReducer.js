import {List, Map} from 'immutable';

import { 
  findItemIndex,
  cancelPendingCollectionUpdates,
  commitPendingCollectionUpdates
} from './reducerUtilities.js';


/* PROCESS REDUCER */
export default function (state = List(), action) {
  switch (action.type) {
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
    default:
      return state;
  }
}


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
