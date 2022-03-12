/* - Componente importancion de las paginas y distribucion de las rutas -  */
import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
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

class Rutas extends React.Component {
    render() {
        //   const { name } = this.props;
        return (
            <div>
                {/* <Button variant="contained"> {name} </Button> */}
                <MenuComunidad />
                <div
                    className="router-output"
                    style={{ 'padding-top': '80px' }}
                >
                    <Routes>
                        <Route index element={<Inicio />}></Route>
                        <Route
                            path="/asi-trabajamos"
                            element={<AsiTrabajamos />}
                        />
                        <Route
                            path="apendice-costos"
                            element={<ApendiceCostos />}
                        />
                        <Route path="aplicar" element={<Aplicar />} />
                        <Route path="asesorias" element={<Asesorias />} />
                        <Route
                            path="asi-trabajamos"
                            element={<AsiTrabajamos />}
                        />
                        <Route path="ayuda-pqrs" element={<AyudaPQRS />} />
                        <Route path="blog" element={<Blog />} />
                        <Route
                            path="calificaciones"
                            element={<Calificaciones />}
                        />
                        <Route
                            path="comunidad-comerciantes"
                            element={<ComunidadComerciantes />}
                        />
                        <Route
                            path="comunidad-propietarios"
                            element={<ComunidadPropietarios />}
                        />
                        <Route path="contactenos" element={<Contactenos />} />
                        <Route path="ingreso" element={<Ingreso />} />
                        <Route path="legal" element={<Legal />} />
                        <Route path="/nosotros" element={<Nosotros />} />
                        <Route
                            path="nuevo-proyecto"
                            element={<NuevoProyecto />}
                        />
                        <Route
                            path="patrocinadores"
                            element={<Patrocinadores />}
                        />
                        <Route path="prensa" element={<Prensa />} />
                        <Route path="presupuestos" element={<Presupuestos />} />
                        <Route
                            path="profesionales-servicios"
                            element={<ProfesionalesServicios />}
                        />
                        <Route path="registro" element={<Registro />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
                <FooterComunidad />
            </div>
        )
    }
}

export default Rutas
