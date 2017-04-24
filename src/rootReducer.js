import {Map} from 'immutable';
import {
  findItemIndex,
  cancelPendingCollectionUpdates,
  commitPendingCollectionUpdates
} from './reducers/reducerUtilities';

import recipeReducer from './reducers/recipeReducer';
import ingredientReducer from './reducers/ingredientReducer';
import processReducer from './reducers/processReducer';


/* ROOT REDUCER */
export default function (state = Map(), action) {
  switch (action.type) {
    case 'EDIT_RECIPE':
    case 'CANCEL_EDITING_RECIPE':
    case 'DONE_EDITING_RECIPE':
      return recipeReducer(state, action);
    case 'EDIT_INGREDIENT':
    case 'CANCEL_EDITING_INGREDIENT':
    case 'DONE_EDITING_INGREDIENT':
    case 'ADD_INGREDIENT':
    case 'SCHEDULE_DELETE_INGREDIENT':
    case 'DESCHEDULE_DELETE_INGREDIENT':
      return ingredientReducer(state, action);
    case 'EDIT_STEP':
    case 'CANCEL_EDITING_STEP':
    case 'DONE_EDITING_STEP':
    case 'ADD_STEP':
    case 'SCHEDULE_DELETE_STEP':
    case 'DESCHEDULE_DELETE_STEP':
      return processReducer(state, action);
  }

  return state;
}
