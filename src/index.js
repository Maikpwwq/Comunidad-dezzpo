/* - Componente principal que renderiza el contenido en el Dom-  */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk';
import reducers from './reducers/todoApp';
import App from './App';
//import Inicio from '../components/inicio/inicio.html';

//
import Message from './js/Message';

let store = createStore(reducers, {}, applyMiddleware(reduxThunk));

//var async = require('neo-async');
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <Message />
        <App />
    </Provider>   
  </React.StrictMode>,
  document.getElementById('root')
);

if(module.hot) // eslint-disable-line no-undef  
  module.hot.accept() // eslint-disable-line no-undef  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
