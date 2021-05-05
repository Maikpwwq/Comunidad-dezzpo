import React from "react";
import Rutas from './routes/rutas';

class App extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <>        
        <Rutas name = {name} ></Rutas>
      </>
    );
  }
}

export default App;