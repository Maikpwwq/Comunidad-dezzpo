/* - Componente plantilla carga el contenido del Menu, Rutas y Footer -  */
import React from 'react';
import { Provider } from 'react-redux';

//Importar componentes
import FooterComunidad from './components/footer/footer';
import MenuComunidad from './components/menu/menu';
import Rutas from './routes/rutas';

const App = ({}) => {
    return (
      <Provider store={store}>
          <div className="App">
            <MenuComunidad></MenuComunidad>
            <Rutas></Rutas>
            <FooterComunidad></FooterComunidad>
          </div>
      </Provider>
  );
}

export default App;