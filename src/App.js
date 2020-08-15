/* - Componente plantilla carga el contenido del Menu, Rutas y Footer -  */
import React from 'react';
//Importar componentes
import Rutas from './routes/rutas';
//import List from './components/List'; <List/>

const App = ({}) => {
    return (      
      <React.Fragment>            
            <Rutas></Rutas>            
      </React.Fragment>
  );
}

export default App;