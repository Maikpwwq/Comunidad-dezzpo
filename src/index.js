import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
// Create browser history, for navigation a la single page apps
import { createBrowserHistory } from 'history'

import Rutas from './router'
import 'firebase/auth'
// import "./styles.styl";
// import * as serviceWorker from './serviceWorker';

// Create a browser history
const history = createBrowserHistory()
print(history)

ReactDOM.render(
    <Router>
        {/* history={history} */}
        <Rutas />
    </Router>,
    document.getElementById('app')
)

// serviceWorker.unregister();
