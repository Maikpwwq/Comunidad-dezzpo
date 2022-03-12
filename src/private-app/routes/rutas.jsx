/* - Componente importancion de las paginas y distribucion de las rutas -  */
import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Navigate,
    Route,
} from 'react-router-dom'

//Paginas
import Ajustes from '../pages/ajustes/Ajustes'
import Biblioteca from '../pages/biblioteca/Biblioteca'
import Cambiar_Clave from '../pages/cambiar-clave/Cambiar_Clave'
import Certificaciones from '../pages/certificaciones/Certificaciones'
import Configuracion_Privacidad from '../pages/configuracion-privacidad/Configuracion_Privacidad'
import Formas_Pago from '../pages/formas-pago/Formas_Pago'
import Historial_Servicios from '../pages/historial-servicios/Historial_Servicios'
import Invitar_Amigos from '../pages/invitar-amigos/Invitar_Amigos'
import Mensajes from '../pages/mensajes/Mensajes'
import Notificaciones from '../pages/notificaciones/Notificaciones'
import Perfil from '../pages/perfil/Perfil'
import Portal_Servicios from '../pages/portal-servicios/Portal_Servicios'
import Suscripciones from '../pages/suscripciones/Suscripciones'

// Componentes

class Rutas extends React.Component {
    render() {
        return (
            <>
                {/* <Router> */}
                <Routes>
                    <Route path="/perfil" component={Perfil} />
                    <Route path="/ajustes" component={Ajustes} />
                    <Route path="/biblioteca" component={Biblioteca} />
                    <Route path="/cambiar-clave">
                        <Cambiar_Clave></Cambiar_Clave>
                    </Route>
                    <Route path="/certificaciones">
                        <Certificaciones></Certificaciones>
                    </Route>
                    <Route path="/configuracion-privacidad">
                        <Configuracion_Privacidad></Configuracion_Privacidad>
                    </Route>
                    <Route path="/formas-pago">
                        <Formas_Pago></Formas_Pago>
                    </Route>
                    <Route path="/historial-servicios">
                        <Historial_Servicios></Historial_Servicios>
                    </Route>
                    <Route path="/invitar-amigos">
                        <Invitar_Amigos></Invitar_Amigos>
                    </Route>
                    <Route path="/mensajes">
                        <Mensajes></Mensajes>
                    </Route>
                    <Route path="/notificaciones">
                        <Notificaciones></Notificaciones>
                    </Route>
                    <Route path="/portal-servicios">
                        <Portal_Servicios></Portal_Servicios>
                    </Route>
                    <Route path="/suscripciones">
                        <Suscripciones></Suscripciones>
                    </Route>
                    {/* <Route component={NoMatch} /> */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                {/* </Router> */}
            </>
        )
    }
}

export default Rutas
