import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../App';

//Importar componentes

class Rutas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            
        };
    };

    render() {
        
        return (
            <Provider store={store}>
                <BrowserRouter>                
                        <Switch>
                            <Route exact path="/" component={App} data={data.data} />
                            <Route exact path="/inicio/" component={Inicio} data={data.data} />
                        </Switch>
                </BrowserRouter>
            </Provider>
        )
    };
};

Rutas.propTypes = {
    store: PropTypes.object.isRequired,
};
/*
import { Router, Route, browserHistory } from 'react-router';
<Router history={browserHistory}>
  <Route path="/(:filter)" component={App} />
</Router>
*/

export default Rutas;
    
