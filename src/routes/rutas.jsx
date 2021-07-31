/* - Componente importancion de las paginas y distribucion de las rutas -  */
import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link,
} from 'react-router-dom'

//Paginas
import ApendiceCostos from '../pages/apendice-costos/Apendice_Costos'
import Aplicar from '../pages/aplicar/Aplicar'
import Asesorias from '../pages/asesorias/Asesorias'
import AsiTrabajamos from '../pages/asi-trabajamos/Asi_Trabajamos'
import AyudaPQRS from '../pages/ayuda-pqrs/Ayuda_PQRS'
import Blog from '../pages/blog/Blog'
import Calificaciones from '../pages/calificaciones/Calificaciones'
import ComunidadComerciantes from '../pages/comunidad-comerciantes/Comunidad_Comercientes'
import ComunidadPropietarios from '../pages/comunidad-propietarios/Comunidad_Propietarios'
import Contactenos from '../pages/contactenos/Contactenos'
import Ingreso from '../pages/ingreso/Ingreso'
import Inicio from '../pages/inicio/Inicio'
import Legal from '../pages/legal/Legal'
import Nosotros from '../pages/nosotros/Nosotros'
import NuevoProyecto from '../pages/nuevo-proyecto/Nuevo_Proyecto'
import Patrocinadores from '../pages/patrocinadores/Patrocinadores'
import Prensa from '../pages/prensa/Prensa'
import Presupuestos from '../pages/presupuestos/Presupuestos'
import ProfesionalesServicios from '../pages/profesionales-servicios/Profesionales_Servicios'
import Registro from '../pages/registro/Registro'

// import NoMatch from "./NoMatch";

// Componentes
import FooterComunidad from '../components/footer/Footer'
import MenuComunidad from '../components/menu/Menu'

import Button from '@material-ui/core/Button'

// import "./main.css";

class Rutas extends React.Component {
    render() {
        //   const { name } = this.props;
        return (
            <div>
                {/* <Button variant="contained"> {name} </Button> */}
                <Router>
                    <MenuComunidad />
                    <div
                        className="router-output"
                        style={{ 'padding-top': '80px' }}
                    >
                        <Switch>
                            <Route exact path="/" component={Inicio} />
                            <Route
                                path="/asi-trabajamos"
                                component={AsiTrabajamos}
                            />
                            <Route
                                path="/apendice-costos"
                                component={ApendiceCostos}
                            />
                            <Route path="/aplicar">
                                <Aplicar></Aplicar>
                            </Route>
                            <Route path="/asesorias">
                                <Asesorias></Asesorias>
                            </Route>
                            <Route path="/asi-trabajamos">
                                <AsiTrabajamos></AsiTrabajamos>
                            </Route>
                            <Route path="/ayuda-pqrs">
                                <AyudaPQRS></AyudaPQRS>
                            </Route>
                            <Route path="/blog">
                                <Blog></Blog>
                            </Route>
                            <Route path="/calificaciones">
                                <Calificaciones></Calificaciones>
                            </Route>
                            <Route path="/comunidad-comerciantes">
                                <ComunidadComerciantes></ComunidadComerciantes>
                            </Route>
                            <Route path="/comunidad-propietarios">
                                <ComunidadPropietarios></ComunidadPropietarios>
                            </Route>
                            <Route path="/contactenos">
                                <Contactenos></Contactenos>
                            </Route>
                            <Route path="/ingreso">
                                <Ingreso></Ingreso>
                            </Route>
                            <Route path="/legal">
                                <Legal></Legal>
                            </Route>
                            <Route path="/nosotros">
                                <Nosotros></Nosotros>
                            </Route>
                            <Route path="/nuevo-proyecto">
                                <NuevoProyecto></NuevoProyecto>
                            </Route>
                            <Route path="/patrocinadores">
                                <Patrocinadores></Patrocinadores>
                            </Route>
                            <Route path="/prensa">
                                <Prensa></Prensa>
                            </Route>
                            <Route path="/presupuestos">
                                <Presupuestos></Presupuestos>
                            </Route>
                            <Route path="/profesionales-servicios">
                                <ProfesionalesServicios></ProfesionalesServicios>
                            </Route>
                            <Route path="/registro">
                                <Registro></Registro>
                            </Route>
                            {/* <Route component={NoMatch} /> */}
                            <Redirect to="/" />
                        </Switch>
                    </div>
                    <FooterComunidad />
                </Router>
            </div>
        )
    }
}

export default Rutas
