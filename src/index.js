/* - Componente principal que renderiza el contenido en el Dom-  */
import React from 'react';
import ReactDOM from 'react-dom';
import "core-js";
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk';
import reducers from './reducers/todoApp';
import App from './App';
// import Message from './js/Message'; <Message />
//import _ from 'lodash';

const initialState = window.__INITIAL_STATE__;
let store = createStore(reducers, initialState, applyMiddleware(reduxThunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>        
        <App />
    </Provider>   
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
