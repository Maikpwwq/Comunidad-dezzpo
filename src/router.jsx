import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'

//Paginas
import App from './app/App'
import PrivateApp from './private-app/Private-App'

class Rutas extends React.Component {
    render() {
        return (
            <>
                {/* <Router> */}
                <Routes>
                    <Route exact path="/" element={<App />} />
                    <Route exact path="/app" element={<PrivateApp />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                {/* </Router> */}
            </>
        )
    }
}

export default Rutas
