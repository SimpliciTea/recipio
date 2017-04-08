import React from 'react';
import ReactDOM from 'react-dom';
import {List, Map} from 'immutable';
import {compose, createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import {RecipioAppContainer} from './components/RecipioAppContainer';

const createStoreDevTools = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreDevTools(reducer);

store.dispatch({
  type: 'SET_STATE',
  state: {
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
          {id: 1, text: 'Boil Macaroni'},
          {id: 2, text: 'Stir In Cheese'}
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
          {id: 1, text: 'Boil Macaroni'},
          {id: 2, text: 'Stir In Cheese'},
          {id: 3, text: 'serve with Pico'}
        ],
        isEditing: false,
        hasPendingUpdate: false
      }
    ],
    hasActiveRecipe: false,
    activeRecipeId: 0
  }
});

ReactDOM.render(
  <Provider store={store}>
    <RecipioAppContainer />
  </Provider>,
  document.getElementById('app')
);
