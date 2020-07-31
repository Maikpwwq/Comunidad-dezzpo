import React from 'react';
import { Provider } from 'react-redux';

//Importar componentes
import Footer from './components/footer/footer'
import Menu from './components/menu/menu'
import Rutas from './routes/rutas'

const App = ({}) => {
    return (
      <Provider store={store}>
          <div className="App">
            <Menu></Menu>
            <Rutas></Rutas>
            <Footer></Footer>
          </div>
      </Provider>
  );
}

export default App;