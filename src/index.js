import React from 'react'
import ReactDOM from 'react-dom'
import Rutas from './router'
import 'firebase/auth'
// import "./styles.styl";
// import * as serviceWorker from './serviceWorker';

// var mountNode = document.getElementById("app");
ReactDOM.render(<Rutas />, document.getElementById('app'))

// serviceWorker.unregister();
