import { compose, applyMiddleware, createStore } from 'redux';
import Immutable from 'immutable';
import rootReducer from './rootReducer';


const createStoreDevTools = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const initialState = Immutable.fromJS({
  recipes: [
    {
      id: 1,
      title: 'Macaroni',
      ingredients: [
        {
          id: 1, 
          text: 'Noodles',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false, 
          pendingUpdate: null
        }, 
        {
          id: 2,
          text: 'Cheese',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false,
          pendingUpdate: null
        }
      ],
      process: [
        {
          id: 1, 
          text: 'Boil Macaroni',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false,
          pendingUpdate: null
        },
        {
          id: 2, 
          text: 'Stir in cheese',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false,
          pendingUpdate: null
        }
      ],
      isEditing: false,
      hasPendingUpdate: false
    },
    {
      id: 2,
      title: 'Macaroni El Cabroni',
      ingredients: [
        {
          id: 1, 
          text: 'Noodles',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false,
          pendingUpdate: null
        },
        {
          id: 2, 
          text: 'Cheese',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false,
          pendingUpdate: null
        },
        {
          id: 3, 
          text: 'Pico',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false,
          pendingUpdate: null
        }
      ],
      process: [
        {
          id: 1, 
          text: 'Boil Macaroni',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false,
          pendingUpdate: null
        },
        {
          id: 2, 
          text: 'Stir In Cheese',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false,
          pendingUpdate: null
        },
        {
          id: 3, 
          text: 'Serve with Pico',
          isEditing: false,
          hasUpdatePending: false,
          hasPendingDeletion: false,
          pendingUpdate: null
        }
      ],
      isEditing: false,
      hasPendingUpdate: false
    }
  ],
  hasActiveRecipe: false,
  activeRecipeId: 0
});

const store = createStoreDevTools(rootReducer, initialState);


export default store;
