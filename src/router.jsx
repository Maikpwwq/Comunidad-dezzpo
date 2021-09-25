import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'

//Paginas
import App from './app/App'
import PrivateApp from './private-app/Private-App'

class Rutas extends React.Component {
    render() {
        return (
            <>
                <Router>
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route path="/app" component={PrivateApp} />
                        <Redirect to="/" />
                    </Switch>
                </Router>
            </>
        )
    }
}

export default Rutas
