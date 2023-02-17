import React from 'react'
import { createRoot } from 'react-dom/client'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import { hydrateRoot } from 'react-dom/client' // SSR
// import ReactDOM from 'react-dom' // Deprecated V18
import { BrowserRouter as Router } from 'react-router-dom'
// Create browser history, for navigation a la single page apps
import { createBrowserHistory } from 'history'
// import ScrollToTop from './app/components/ScrollToTop'
import Rutas from './router'
import './index.scss'
// import '../public/assets/css/icomoon/style.css'
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

const containerReactApp = document.getElementById('app')
const root = createRoot(containerReactApp)
root.render(
    <React.StrictMode>
        <Router history={history}>
            {/* <ScrollToTop /> */}
            <Rutas />
        </Router>
    </React.StrictMode>
)

// SSR
// const root = hydrateRoot(
//     containerReactApp,
//     <Router history={history}>
//         <Rutas />
//     </Router>
// )

// Deprecated V18
// ReactDOM.render(
//     <Router history={history}>
//         <Rutas />
//     </Router>,
//     document.getElementById('app')
// )

// serviceWorker.unregister();
