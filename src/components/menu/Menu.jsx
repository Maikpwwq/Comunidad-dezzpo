/* Menu de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react';
import {Link, Redirect} from 'react-router-dom';

const MenuComunidad = props => {
    render ( 
        <React.Fragment>
        <header id="menuFijo">
            {/* Menu fijo */}
            <nav id="barraMenu">
                <img src="assets/img/Comunidad-Dezzpo.jpg" alt="Logo Comunidad Dezzpo" height="110px" width="210px"/>
                <div id="menuContenedor">                
                    <ul class="menuSecciones">
                        <li class="botonSeccion"><Link to="/" class="activo"> Home </Link></li>
                        {/* seleccion asi trabajamos*/}
                        <div class="dropdown"><li class="botonSeccion">
                            <Link to="/asi_trabajamos" class="botonLink"> Asi trabajamos </Link></li>
                            <div class="dropdownContenidos">
                            <Link to="/ingreso">Ingresar</Link> 
                            <Link to="/asesorias">Asesores en vivo</Link>
                            <Link to="/comunidad-comerciantes">Perfil Comerciante</Link> 
                            <Link to="/comunidad-propietarios">Perfil Propietario</Link>
                            <Link to="/registro">Registrarse</Link>
                            <Link to="/ingreso">Calificaciones</Link>
                            </div>                    
                        </div>
                        {/* seleccion nosotros */}
                        <div class="dropdown"><li class="botonSeccion">
                            <Link to="/nosotros" class="botonLink"> Nosotros </Link></li>
                            <div class="dropdownContenidos">                            
                            <Link to="/nosotros/#Acerca-de-nosotros">Acerca de nosotros</Link> 
                            <Link to="/nosotros/#equipo-dezzpo">Equipo dezzpo</Link>
                            <Link to="/blog">Programa de afiliados</Link> 
                            <Link to="/prensa">Prensa</Link>
                            <Link to="/patrocinadores">Patrocinadores</Link>
                            <Link to="/legal">Legal</Link>
                            </div>                    
                        </div>
                        {/* seleccion Comunidad de Comerciantes*/}
                        <div class="dropdown"><li class="botonSeccion">
                            <Link to="/comunidad-comerciantes" class="botonLink"> Comunidad de comerciantes </Link></li>
                            <div class="dropdownContenidos">
                            <Link to="/ingreso">Tu cuenta</Link> 
                            <Link to="/asesorias">Asesores en vivo</Link>
                            <Link to="/asi-trabajamos">Asi funciona</Link> 
                            <Link to="/contactenos">contactanos</Link>
                            <Link to="/ayuda-pqrs">Ayuda & Pqrs</Link>
                            <Link to="/legal">Terminos y condiciones</Link>
                            </div>                    
                        </div>        
                        {/* seleccion Comunidad de Propietarios*/}
                        <div class="dropdown"><li class="botonSeccion">
                            <Link to="#Comunidad de propietarios" class="botonLink"> Comunidad de propietarios </Link></li>
                            <div class="dropdownContenidos">
                                <Link to="/nuevo-proyecto">Crea un nuevo proyecto</Link> 
                                <Link to="/blog">Testimonio de propietarios</Link>
                                <Link to="/asi-trabajamos">Asi funciona</Link> 
                                <Link to="/contactenos">contactanos</Link>
                                <Link to="/ayuda-pqrs">Ayuda & Pqrs</Link>
                                <Link to="/legal">Terminos y condiciones</Link>
                            </div>                    
                        </div>
                        <li class="botonSeccion"><Link to="/presupuestos" class="botonLink"> Presupuestos </Link></li>
                        <li class="botonSeccion"><Link to="/profesionales-servicios" class="botonLink"> Profesionales y servicios </Link></li>
                        <li class="botonSeccion"><Link to="/asesorias" class="botonLink"> Asesorias </Link></li>
                        <li class="botonSeccion"><Link to="/apendice-costos" class="botonLink"> Apendice de costos </Link></li>
                        <li class="botonSeccion"><Link to="/ingreso" class="botonLink"> Ingresar </Link></li>
                    </ul>
                </div>
            </nav>
            {false && <Redirect to="/" ></Redirect>}
        </header>
        </React.Fragment>
)};

export default MenuComunidad