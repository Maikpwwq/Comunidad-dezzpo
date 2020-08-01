/* - Componente importancion de las paginas y distribucion de las rutas -  */
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// 
import App from '../App';
import ApendiceCostos from '../components/apendice-costos/apendice_costos.html';
import Aplicar from '../components/aplicar/aplicar.html';
import Asesorias from '../components/asesorias/asesorias.html';
import AsiTrabajamos from '../components/asi-trabajamos/asi_trabajamos.html';
import AyudaPQRS from '../components/ayuda-pqrs/ayuda_pqrs.html';
import Blog from '../components/blog/blog.html';
import Calificaciones from '../components/calificaciones/calificaciones.html';
import ComunidadComerciantes from '../components/comunidad-comerciantes/comunidad_comerciantes.html';
import ComunidadPropietarios from '../components/comunidad-propietarios/comunidad_propietarios.html';
import Contactenos from '../components/contactenos/contactenos.html';
import Ingreso from '../components/inicio/inicio.html';
import Inicio from '../components/inicio/inicio.html';
import Legal from '../components/legal/legal.html';
import Nosotros from '../components/nosotros/nosotros.html';
import NuevoProyecto from '../components/nuevo-proyecto/nuevo_proyecto.html';
import Patrocinadores from '../components/patrocinadores/patrocinadores.html';
import Prensa from '../components/prensa/prensa.html';
import Presupuestos from '../components/presupuestos/presupuestos.html';
import ProfesionalesServicios from '../components/profesionales-servicios/profesionales_servicios.html';
import Registro from '../components/registro/registro.html';

/* uso en Reactnative
import { Router, Route, browserHistory } from 'react-router';
<Router history={browserHistory}>
  <Route path="/(:filter)" component={App} />
</Router>
*/

const data = {data: "Hola Mundo"};

const Rutas = props => {

    return (
        <BrowserRouter>                
            <React.Fragment>
                <Switch>
                    <Route exact path="/" component={App} data={data.data} />                
                    <Route exact path="/apendice-costos" component={ApendiceCostos} data={data.data} />
                    <Route exact path="/aplicar" component={Aplicar} data={data.data} />
                    <Route exact path="/asesorias" component={Asesorias} data={data.data} />
                    <Route exact path="/asi-trabajamos" component={AsiTrabajamos} data={data.data} />
                    <Route exact path="/ayuda-pqrs" component={AyudaPQRS} data={data.data} />
                    <Route exact path="/blog" component={Blog} data={data.data} />
                    <Route exact path="/calificaciones" component={Calificaciones} data={data.data} />
                    <Route exact path="/comunidad-comerciantes" component={ComunidadComerciantes} data={data.data} />
                    <Route exact path="/comunidad-porpietarios" component={ComunidadPropietarios} data={data.data} />
                    <Route exact path="/contactenos" component={Contactenos} data={data.data} />
                    <Route exact path="/ingresar" component={Ingreso} data={data.data} />
                    <Route exact path="/inicio" component={Inicio} data={data.data} />
                    <Route exact path="/legal" component={Legal} data={data.data} />
                    <Route exact path="/nosotros" component={Nosotros} data={data.data} />
                    <Route exact path="/nuevo-proyecto" component={NuevoProyecto} data={data.data} />
                    <Route exact path="/patrocinadores" component={Patrocinadores} data={data.data} />
                    <Route exact path="/prensa" component={Prensa} data={data.data} />
                    <Route exact path="/presupuestos" component={Presupuestos} data={data.data} />
                    <Route exact path="/profesionales-servicios" component={ProfesionalesServicios} data={data.data} />
                    <Route exact path="/registro" component={Registro} data={data.data} />
                </Switch>
            </React.Fragment>
        </BrowserRouter>                
    )
};

Rutas.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Rutas;