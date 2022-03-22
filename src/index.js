import 'dotenv/config'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
// Create browser history, for navigation a la single page apps
import { createBrowserHistory } from 'history'

import Rutas from './router'
import './index.scss'

// import "./styles.styl";
// import * as serviceWorker from './serviceWorker';

// Create a browser
let history = createBrowserHistory()
history.listen((location, action) => {
    // this is called whenever new locations come in
    // the action is POP, PUSH, or REPLACE
    // print(action)
    console.log(action)
})

ReactDOM.render(
    <Router history={history}>
        <Rutas />
    </Router>,
    document.getElementById('app')
)

// serviceWorker.unregister();
