import React from 'react';
import '../../../css/footer.css';
import "../../../css/iconmoon/style.css";

const menuComunidad = document.querySelector('#menuDezzpo');

ReactDOM.render ( 
    /* Menu fijo */
    <Header id="menuFijo">
        <nav id="barraMenu">
            <img src="./img/Comunidad-Dezzpo.jpg" alt="Logo Comunidad Dezzpo" height="110px" width="210px">
            <div id="menuContenedor">                
                <ul class="menuSecciones">
                    <li class="botonSeccion"><a href="index.html" class="activo"> Home </a></li>
                    /* seleccion asi trabajamos*/
                    <div class="dropdown"><li class="botonSeccion">
                        <a href="./src/components/asi-trabajamos/asi_trabajamos.html" class="botonLink"> Asi trabajamos </a></li>
                        <div class="dropdownContenidos">
                           <a href="./src/components/ingreso/ingreso.html">Ingresar</a> 
                           <a href="./src/components/asesorias/asesorias.html">Asesores en vivo</a>
                           <a href="./src/components/comunidad-comerciantes/comunidad_comerciantes.html">Perfil Comerciante</a> 
                           <a href="./src/components/comunidad-propietarios/comunidad_propietarios.html">Perfil Propietario</a>
                           <a href="./src/components/registro/registro.html">Registrarse</a>
                           <a href="./src/components/ingreso/ingreso.html">Calificaciones</a>
                        </div>                    
                    </div>
                    /* seleccion nosotros */
                    <div class="dropdown"><li class="botonSeccion">
                        <a href="./src/components/nosotros/nosotros.html" class="botonLink"> Nosotros </a></li>
                        <div class="dropdownContenidos">                            
                           <a href="./src/components/nosotros/nosotros.html">Acerca de nosotros</a> 
                           <a href="./src/components/nosotros/nosotros.html">Equipo dezzpo</a>
                           <a href="./src/components/blog/blog.html">Programa de afiliados</a> 
                           <a href="./src/components/">Prensa</a>
                           <a href="./src/components/patrocinadores/patrocinadores.html">Patrocinadores</a>
                           <a href="./src/components/legal/legal.html">Legal</a>
                        </div>                    
                    </div>
                    /* seleccion Comunidad de Comerciantes*/
                    <div class="dropdown"><li class="botonSeccion">
                        <a href="./src/components/comunidad-comerciantes/comunidad_comerciantes.html" class="botonLink"> Comunidad de comerciantes </a></li>
                        <div class="dropdownContenidos">
                           <a href="./src/components/ingreso/ingreso.html">Tu cuenta</a> 
                           <a href="./src/components/asesorias/asesorias.html">Asesores en vivo</a>
                           <a href="./src/components/asi-trabajamos/asi_trabajamos.html">Asi funciona</a> 
                           <a href="./src/components/contactenos/contactenos.html">contactanos</a>
                           <a href="./src/components/ayuda-pqrs/ayuda_pqrs.html">Ayuda & Pqrs</a>
                           <a href="./src/components/legal/legal.html y condiciones">Terminos y condiciones</a>
                        </div>                    
                    </div>        
                    /* seleccion Comunidad de Propietarios*/            
                    <div class="dropdown"><li class="botonSeccion">
                        <a href="#Comunidad de propietarios" class="botonLink"> Comunidad de propietarios </a></li>
                        <div class="dropdownContenidos">
                            <a href="./src/components/nuevo-proyecto/nuevo_proyecto.html">Crea un nuevo proyecto</a> 
                            <a href="./src/components/blog/blog.html">Testimonio de propietarios</a>
                            <a href="./src/components/asi-trabajamos/asi_trabajamos.html">Asi funciona</a> 
                            <a href="./src/components/contactenos/contactenos.html">contactanos</a>
                            <a href="./src/components/ayuda-pqrs/ayuda_pqrs.html">Ayuda & Pqrs</a>
                            <a href="./src/components/legal/legal.html">Terminos y condiciones</a>
                        </div>                    
                    </div>
                    <li class="botonSeccion"><a href="./src/components/presupuestos/presupuestos.html" class="botonLink"> Presupuestos </a></li>
                    <li class="botonSeccion"><a href="./src/components/profesionales-servicios/profesionales_servicios.html" class="botonLink"> Profesionales y servicios </a></li>
                    <li class="botonSeccion"><a href="./src/components/asesorias/asesorias.html" class="botonLink"> Asesorias </a></li>
                    <li class="botonSeccion"><a href="./src/components/apendice-costos/apendice_costos.html" class="botonLink"> Apendice de costos </a></li>
                    <li class="botonSeccion"><a href="./src/components/ingreso/ingreso.html" class="botonLink"> Ingresar </a></li>
                </ul>
            </div>
        </nav>
    </Header>
  , menuComunidad);

export default menuComunidad
