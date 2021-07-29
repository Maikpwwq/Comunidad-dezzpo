import React from 'react'
import Rutas from './routes/rutas'
// import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'

class App extends React.Component {
    render() {
        // const { name } = this.props;
        return (
            <>
                {/* <Rutas  name = {name}></Rutas> */}
                <Rutas></Rutas>
            </>
        )
    }
}

export default App
