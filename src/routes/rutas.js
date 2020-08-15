/* - Componente importancion de las paginas y distribucion de las rutas -  */
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

//  
import ApendiceCostos from '../pages/apendice-costos/Apendice_Costos';
import Aplicar from '../pages/aplicar/Aplicar'; //crear
import Asesorias from '../pages/asesorias/Asesorias';
import AsiTrabajamos from '../pages/asi-trabajamos/Asi_Trabajamos';
import AyudaPQRS from '../pages/ayuda-pqrs/Ayuda_PQRS';
import Blog from '../pages/blog/Blog';
import Calificaciones from '../pages/calificaciones/Calificaciones'; //crear
import ComunidadComerciantes from '../pages/comunidad-comerciantes/Comunidad_Comercientes';
import ComunidadPropietarios from '../pages/comunidad-propietarios/Comunidad_Propietarios';
import Contactenos from '../pages/contactenos/Contactenos';
import Ingreso from '../pages/ingreso/Ingreso';
import Inicio from '../pages/inicio/Inicio';
import Legal from '../pages/legal/Legal';
import Nosotros from '../pages/nosotros/Nosotros';
import NuevoProyecto from '../pages/nuevo-proyecto/Nuevo_Proyecto';
import Patrocinadores from '../pages/patrocinadores/Patrocinadores';
import Prensa from '../pages/prensa/Prensa';
import Presupuestos from '../pages/presupuestos/Presupuestos';
import ProfesionalesServicios from '../pages/profesionales-servicios/Profesionales_Servicios';
import Registro from '../pages/registro/Registro';

//
import FooterComunidad from '../components/footer/Footer';
import MenuComunidad from '../components/menu/Menu';
/* uso en Reactnative
import { Router, Route, browserHistory } from 'react-router';
<Router history={browserHistory}>
  <Route path="/(:filter)" component={App} />
</Router>
*/

const data = {data: "Hola Mundo"};

const Rutas = props => {

    return (
        <React.Fragment>
            <BrowserRouter>      
                <MenuComunidad/>                      
                <Switch>
                    <Route exact path="/" component={Inicio} data={data.data}>                
                        <IndexRoute component={Inicio} data={data.data}/>
                        <Route path="/apendice-costos" component={ApendiceCostos} data={data.data} />
                        <Route path="/aplicar" component={Aplicar} data={data.data} />
                        <Route path="/asesorias" component={Asesorias} data={data.data} />
                        <Route path="/asi-trabajamos" component={AsiTrabajamos} data={data.data} />
                        <Route path="/ayuda-pqrs" component={AyudaPQRS} data={data.data} />
                        <Route path="/blog" component={Blog} data={data.data} />
                        <Route path="/calificaciones" component={Calificaciones} data={data.data} />
                        <Route path="/comunidad-comerciantes" component={ComunidadComerciantes} data={data.data} />
                        <Route path="/comunidad-porpietarios" component={ComunidadPropietarios} data={data.data} />
                        <Route path="/contactenos" component={Contactenos} data={data.data} />
                        <Route path="/ingresar" component={Ingreso} data={data.data} />
                        <Route path="/legal" component={Legal} data={data.data} />
                        <Route path="/nosotros" component={Nosotros} data={data.data} />
                        <Route path="/nuevo-proyecto" component={NuevoProyecto} data={data.data} />
                        <Route path="/patrocinadores" component={Patrocinadores} data={data.data} />
                        <Route path="/prensa" component={Prensa} data={data.data} />
                        <Route path="/presupuestos" component={Presupuestos} data={data.data} />
                        <Route path="/profesionales-servicios" component={ProfesionalesServicios} data={data.data} />
                        <Route path="/registro" component={Registro} data={data.data} />
                    </Route>
                </Switch>            
                <FooterComunidad/>
            </BrowserRouter>                
        </React.Fragment>
    )
};

Rutas.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Rutas;