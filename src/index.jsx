import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import {Provider} from 'react-redux';
import {RecipioAppContainer} from './components/RecipioAppContainer';

ReactDOM.render(
  <Provider store={store}>
    <RecipioAppContainer />
  </Provider>,
  document.getElementById('app')
);
