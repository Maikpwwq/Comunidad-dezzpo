import React from 'react'
import { Routes, Route } from 'react-router-dom'

//Paginas
import App from './app/App'
import PrivateApp from './private-app/Private-App'

class Rutas extends React.Component {
    render() {
        return (
            <>
                <Routes>
                    <Route path="/app" element={<PrivateApp />} />
                    <Route path="*" element={<App />} />
                </Routes>
            </>
        )
    }
}

export default Rutas
