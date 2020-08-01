/* Menu de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react';
import {Link, Redirect} from 'react-router-dom';

import '../../../css/menu.css';
import "../../../css/iconmoon/style.css";

const MenuComunidad = props => {
    render ( 
        /* Menu fijo */
        <Header id="menuFijo">
            <nav id="barraMenu">
                <img src="../../../img/Comunidad-Dezzpo.jpg" alt="Logo Comunidad Dezzpo" height="110px" width="210px"/>
                <div id="menuContenedor">                
                    <ul class="menuSecciones">
                        <li class="botonSeccion"><Link to="index.html" class="activo"> Home </Link></li>
                        /* seleccion asi trabajamos*/
                        <div class="dropdown"><li class="botonSeccion">
                            <Link to="./src/components/asi-trabajamos/asi_trabajamos.html" class="botonLink"> Asi trabajamos </Link></li>
                            <div class="dropdownContenidos">
                            <Link to="./src/components/ingreso/ingreso.html">Ingresar</Link> 
                            <Link to="./src/components/asesorias/asesorias.html">Asesores en vivo</Link>
                            <Link to="./src/components/comunidad-comerciantes/comunidad_comerciantes.html">Perfil Comerciante</Link> 
                            <Link to="./src/components/comunidad-propietarios/comunidad_propietarios.html">Perfil Propietario</Link>
                            <Link to="./src/components/registro/registro.html">Registrarse</Link>
                            <Link to="./src/components/ingreso/ingreso.html">Calificaciones</Link>
                            </div>                    
                        </div>
                        /* seleccion nosotros */
                        <div class="dropdown"><li class="botonSeccion">
                            <Link to="./src/components/nosotros/nosotros.html" class="botonLink"> Nosotros </Link></li>
                            <div class="dropdownContenidos">                            
                            <Link to="./src/components/nosotros/nosotros.html">Acerca de nosotros</Link> 
                            <Link to="./src/components/nosotros/nosotros.html">Equipo dezzpo</Link>
                            <Link to="./src/components/blog/blog.html">Programa de afiliados</Link> 
                            <Link to="./src/components/">Prensa</Link>
                            <Link to="./src/components/patrocinadores/patrocinadores.html">Patrocinadores</Link>
                            <Link to="./src/components/legal/legal.html">Legal</Link>
                            </div>                    
                        </div>
                        /* seleccion Comunidad de Comerciantes*/
                        <div class="dropdown"><li class="botonSeccion">
                            <Link to="./src/components/comunidad-comerciantes/comunidad_comerciantes.html" class="botonLink"> Comunidad de comerciantes </Link></li>
                            <div class="dropdownContenidos">
                            <Link to="./src/components/ingreso/ingreso.html">Tu cuenta</Link> 
                            <Link to="./src/components/asesorias/asesorias.html">Asesores en vivo</Link>
                            <Link to="./src/components/asi-trabajamos/asi_trabajamos.html">Asi funciona</Link> 
                            <Link to="./src/components/contactenos/contactenos.html">contactanos</Link>
                            <Link to="./src/components/ayuda-pqrs/ayuda_pqrs.html">Ayuda & Pqrs</Link>
                            <Link to="./src/components/legal/legal.html y condiciones">Terminos y condiciones</Link>
                            </div>                    
                        </div>        
                        /* seleccion Comunidad de Propietarios*/            
                        <div class="dropdown"><li class="botonSeccion">
                            <Link to="#Comunidad de propietarios" class="botonLink"> Comunidad de propietarios </Link></li>
                            <div class="dropdownContenidos">
                                <Link to="./src/components/nuevo-proyecto/nuevo_proyecto.html">Crea un nuevo proyecto</Link> 
                                <Link to="./src/components/blog/blog.html">Testimonio de propietarios</Link>
                                <Link to="./src/components/asi-trabajamos/asi_trabajamos.html">Asi funciona</Link> 
                                <Link to="./src/components/contactenos/contactenos.html">contactanos</Link>
                                <Link to="./src/components/ayuda-pqrs/ayuda_pqrs.html">Ayuda & Pqrs</Link>
                                <Link to="./src/components/legal/legal.html">Terminos y condiciones</Link>
                            </div>                    
                        </div>
                        <li class="botonSeccion"><Link to="./src/components/presupuestos/presupuestos.html" class="botonLink"> Presupuestos </Link></li>
                        <li class="botonSeccion"><Link to="./src/components/profesionales-servicios/profesionales_servicios.html" class="botonLink"> Profesionales y servicios </Link></li>
                        <li class="botonSeccion"><Link to="./src/components/asesorias/asesorias.html" class="botonLink"> Asesorias </Link></li>
                        <li class="botonSeccion"><Link to="./src/components/apendice-costos/apendice_costos.html" class="botonLink"> Apendice de costos </Link></li>
                        <li class="botonSeccion"><Link to="./src/components/ingreso/ingreso.html" class="botonLink"> Ingresar </Link></li>
                    </ul>
                </div>
            </nav>
        </Header>
)};

export default MenuComunidad