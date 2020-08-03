/* - Componente plantilla carga el contenido del Menu, Rutas y Footer -  */
import React from 'react';
//Importar componentes
import FooterComunidad from './components/footer/footer';
import MenuComunidad from './components/menu/menu';
import Rutas from './routes/rutas';
import List from './components/List';

const App = ({}) => {
    return (      
      <React.Fragment className="App">
            <MenuComunidad></MenuComunidad>
            <Rutas></Rutas>
            <FooterComunidad></FooterComunidad>
            <List/>
      </React.Fragment>
  );
}

export default App;