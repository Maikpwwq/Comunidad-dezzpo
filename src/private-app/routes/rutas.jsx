/* - Componente importancion de las paginas y distribucion de las rutas -  */
import React from 'react'
import {
    Routes,
    Navigate,
    useNavigate,
    useLocation,
    Route,
} from 'react-router-dom'

// //Paginas
// import Home from '../../app/pages/inicio/Inicio'
import Ajustes from '../pages/ajustes/Ajustes'
import Biblioteca from '../pages/biblioteca/Biblioteca'
import Cambiar_Clave from '../pages/cambiar-clave/Cambiar_Clave'
import Certificaciones from '../pages/certificaciones/Certificaciones'
import Calificaciones from '../pages/calificaciones/Calificaciones'
import Configuracion_Privacidad from '../pages/configuracion-privacidad/Configuracion_Privacidad'
import Formas_Pago from '../pages/formas-pago/Formas_Pago'
import Historial_Servicios from '../pages/historial-servicios/Historial_Servicios'
import Invitar_Amigos from '../pages/invitar-amigos/Invitar_Amigos'
import Mensajes from '../pages/mensajes/Mensajes'
import Notificaciones from '../pages/notificaciones/Notificaciones'
import Perfil from '../pages/perfil/Perfil'
import Portal_Servicios from '../pages/portal-servicios/Portal_Servicios'
import Requerimiento from '../pages/requerimiento/Requerimiento'
import Suscripciones from '../pages/suscripciones/Suscripciones'

class Rutas extends React.Component {
    render() {
        // const location = useLocation()
        // const navigate = useNavigate()
        return (
            <>
                <Routes>
                    <Route index element={<Perfil />}></Route>
                    <Route path="/perfil" element={<Perfil></Perfil>} />
                    <Route path="/perfil/:id" element={<Perfil></Perfil>} />
                    <Route path="/ajustes" element={<Ajustes></Ajustes>} />
                    <Route
                        path="/biblioteca"
                        element={<Biblioteca></Biblioteca>}
                    />
                    <Route
                        path="/cambiar-clave"
                        element={<Cambiar_Clave></Cambiar_Clave>}
                    ></Route>
                    <Route
                        path="/calificaciones"
                        element={<Calificaciones></Calificaciones>}
                    ></Route>
                    {/* <Route
                        path="/cerrar-sesion"
                        element={
                            <Navigate
                                to="/" //{<Home />}
                                replace
                                state={{ from: location }}
                            />
                        }
                        // render={() => {
                        //     navigate('/')
                        // }}
                        // render={
                        //     <Navigate
                        //         to="/"
                        //         replace
                        //         state={{ from: location }}
                        //     />
                        // }
                    ></Route> */}
                    <Route
                        path="/certificaciones"
                        element={<Certificaciones></Certificaciones>}
                    ></Route>
                    <Route
                        path="/configuracion-privacidad"
                        element={
                            <Configuracion_Privacidad></Configuracion_Privacidad>
                        }
                    ></Route>
                    <Route
                        path="/formas-pago"
                        element={<Formas_Pago></Formas_Pago>}
                    ></Route>
                    <Route
                        path="/historial-servicios"
                        element={<Historial_Servicios></Historial_Servicios>}
                    ></Route>
                    <Route
                        path="/invitar-amigos"
                        element={<Invitar_Amigos></Invitar_Amigos>}
                    ></Route>
                    <Route
                        path="/mensajes"
                        element={<Mensajes></Mensajes>}
                    ></Route>
                    <Route
                        path="/notificaciones"
                        element={<Notificaciones></Notificaciones>}
                    ></Route>
                    <Route
                        path="/portal-servicios"
                        element={<Portal_Servicios></Portal_Servicios>}
                    ></Route>
                    <Route
                        path="/requerimiento"
                        element={<Requerimiento></Requerimiento>}
                    ></Route>
                    <Route
                        path="/suscripciones"
                        element={<Suscripciones></Suscripciones>}
                    ></Route>
                    {/* <Route path="*" element={<Navigate to={<NoMatch/>} />} /> */}
                </Routes>
            </>
        )
    }
}

export default Rutas
