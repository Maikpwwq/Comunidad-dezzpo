import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// 
import App from '../App';

/*
import { Router, Route, browserHistory } from 'react-router';
<Router history={browserHistory}>
  <Route path="/(:filter)" component={App} />
</Router>
*/

const Rutas = props => {

    return (
        <BrowserRouter>                
            <Switch>
                <Route exact path="/" component={App} data={data.data} />
                <Route exact path="/inicio/" component={Inicio} data={data.data} />
            </Switch>
        </BrowserRouter>                
    )
};

Rutas.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Rutas;
    
