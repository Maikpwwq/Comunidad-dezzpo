// Pagina de Inicio
import React from 'react';

const Inicio = props => {
    render ( 
        <React.Fragment>
            <main>
                {/* imagen fondo */}
                <section id="bannerComunidad">
                    <div id="contenedorBanner">
                        {/* Mensaje del Banner izquierda */}
                        <div class="slogan">
                            <span class="opacidadNegro"> <p> Hemos facilitado el servicio, <br/>
                                haciendolo más rapido y <br/>
                                simple que nunca </p> <br/>
                            <h1> Unete a la Comunidad </h1> </span>
                            <p><strong><em>Contenido legendario</em></strong></p>
                        </div>
                        {/* Formulario nuevo proyecto */}
                        <div class="contenerdorFormulario">
                            <form action="" id="formularioServicios">
                                <div class="formularioBusqueda1">
                                    <label for="">¿Qué tipo de profesional necesitas?</label>
                                    <div class="casillaSeleccion">
                                        <select name="seleccionarProfesional" id="seleccionarProfesional"> {/* type="text" value="Selecciona un profesional listado #1" */}
                                            <option value="administradores PH"> administradores PH </option>
                                            <option value="Afinadores de muros y acabados"> Afinadores de muros y acabados </option>
                                            <option value=" Aisladores acústicos ">  Aisladores acústicos </option>
                                            <option value="Integradores Control de acceso "> Integradores Control de acceso  </option>
                                            <option value=" Albañiles ">  Albañiles </option>
                                            <option value="Artesanos"> Artesanos </option>
                                            <option value="Arquitectos"> Arquitectos </option>
                                            <option value="Toderos"> Toderos </option>
                                            <option value="Técnico en automatización"> Técnico en automatización </option>
                                            <option value=" Técnico en domótica ">  Técnico en domótica  </option>
                                            <option value="Carpinteros"> Carpinteros </option>
                                            <option value="Carpinteros del aluminio"> Carpinteros del aluminio</option>
                                            <option value="Carpinteros de metales "> Carpinteros de metales </option>
                                            <option value="Cerrajeros "> Cerrajeros  </option>
                                            <option value="Constructoras"> Constructoras </option>
                                            <option value=" Instaladores Cocinas ">  Instaladores Cocinas  </option>
                                            <option value="Instaladores Baños "> Instaladores Baños  </option>
                                            <option value="Controladores de plagas"> Controladores de plagas </option>
                                            <option value="Centros de diseño grafico"> Centros de diseño grafico </option>
                                            <option value="Técnico en drenajes e inundaciones"> Técnico en drenajes e inundaciones </option>
                                            <option value="Electricistas"> Electricistas </option>
                                            <option value=" Geólogos ">  Geólogos  </option>
                                            <option value="Ferreteros ">Ferreteros </option>
                                            <option value=" Técnico en gasodomésticos y refrigeración ">  Técnico en gasodomésticos y refrigeración  </option>
                                            <option value="Impermeabilizadores"> Impermeabilizadores	</option>
                                            <option value="Instaladores de Adoquín">Instaladores de Adoquín</option>
                                            <option value="Instaladores de cableado estructurado"> Instaladores de cableado estructurado </option>
                                            <option value="Instaladores de cerámica "> Instaladores de cerámica  </option>
                                            <option value="Instaladores de cubiertas"> Instaladores de cubiertas </option>
                                            <option value="Instaladores de parques"> Instaladores de parques </option>
                                            <option value="Instaladores de ventanas"> Instaladores de ventanas </option>
                                            <option value=" Jardineros "> Jardineros </option>
                                            <option value=" Lavanderías "> Lavanderías </option>
                                            <option value=" Técnicos de Tanques de agua "> Técnicos de Tanques de agua </option>
                                            <option value=" Técnicos de Limpiezas técnicas "> Técnicos de Limpiezas técnicas </option>
                                            <option value=" Maestros de Obra "> Maestros de Obra </option>
                                            <option value=" Ayudantes de mudanzas "> Ayudantes de mudanzas </option>
                                            <option value=" Ayudantes de movilizaciones "> Ayudantes de movilizaciones </option>
                                            <option value="Mecanicos"> Mecanicos </option>
                                            <option value=" Paisajistas "> Paisajistas </option>
                                            <option value="Pintores ">Pintores </option>
                                            <option value="Plomeros ">Plomeros </option>
                                            <option value="Tecnicos de redes">Tecnicos de redes</option>
                                            <option value=" Reparadores de piscinas ">  Reparadores de piscinas </option>
                                            <option value=" Asistentes de servicio domestico "> Asistentes de servicio domestico </option>
                                            <option value=" Técnico en seguridad electrónica "> Técnico en seguridad electrónica </option>
                                            <option value=" Tapicería "> Tapiceros </option>
                                            <option value=" Trabajadores de piedras "> Trabajadores de piedras </option>                
                                        </select>
                                        <span class="icon-LupaFomularioIcono"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></span>
                                    </div>                        
                                    <label for="">¿Qué tipo de proyecto es?</label>
                                    <div class="casillaSeleccion">                            
                                        <select name="seleccionarServicio" id="seleccionarServicio" >  {/* type="text" value="Selecciona el trabajo listado #2" */}
                                            <option value="Administraciones PH"> Administraciones PH </option>
                                            <option value="Acabados en muros"> Acabados en muros </option>
                                            <option value="Aislamiento acústico"> Aislamiento acústico </option>
                                            <option value="Control de acceso"> Control de acceso </option>
                                            <option value="Albañilería"> Albañilería </option>
                                            <option value="Artesanías y manualidades "> Artesanías y manualidades </option>
                                            <option value="Arquitectura"> Arquitectura </option>
                                            <option value="Asistencia toderos"> Asistencia toderos </option>
                                            <option value="Automatización"> Automatización </option>
                                            <option value="Domótica"> Domótica </option>
                                            <option value="Carpintería"> Carpintería </option>
                                            <option value="Carpintería en aluminio">Carpintería en aluminio</option>
                                            <option value="Carpintería metálica">Carpintería metálica</option>
                                            <option value="Cerrajería"> Cerrajería </option>
                                            <option value="Construcción obra"> Construcción obra </option>
                                            <option value="Reformas Cocinas"> Reformas Cocinas </option>
                                            <option value="Reformas Baños"> Reformas Baños </option>
                                            <option value="Control de plagas"> Control de plagas </option>
                                            <option value="Diseño e impresión"> Diseño e impresión </option>
                                            <option value="Drenajes e inundaciones"> Drenajes e inundaciones </option>
                                            <option value="Electricidad"> Electricidad </option>
                                            <option value="Estudios de suelos"> Estudios de suelos </option>
                                            <option value="Ferreterías">Ferreterías</option>
                                            <option value="Gasodomésticos y refrigeración"> Gasodomésticos y refrigeración </option>
                                            <option value="Impermeabilización"> Impermeabilización	</option>
                                            <option value="Instalación de adoquín">Instalación de adoquín</option>
                                            <option value="Instalación de cableado estructurado"> Instalación de cableado estructurado </option>
                                            <option value="Instalación de cerámica"> Instalación de cerámica </option>
                                            <option value="Instalación de cubiertas"> Instalación de cubiertas </option>
                                            <option value="Instalación de parques"> Instalación de parques </option>
                                            <option value="Instalación de ventanas"> Instalación de ventanas </option>
                                            <option value=" Jardinería "> Jardinería </option>
                                            <option value=" Lavandería "> Lavandería </option>
                                            <option value=" Tanques de agua "> Tanques de agua </option>
                                            <option value=" Limpiezas técnicas "> Limpiezas técnicas </option>
                                            <option value=" Maestro Obra "> Maestro Obra </option>
                                            <option value=" Mudanzas "> Mudanzas </option>
                                            <option value=" Movilizar pesos "> Movilizar pesos </option>
                                            <option value="Mecanica">Mecanica</option>
                                            <option value=" Paisajismo "> Paisajismo </option>
                                            <option value="Pintura ">Pintura </option>
                                            <option value="Plomería ">Plomería </option>
                                            <option value="Redes cableado estructurado ">Redes cableado estructurado </option>
                                            <option value=" Reformas Piscinas "> Reformas Piscinas </option>
                                            <option value=" Servicio doméstico "> Servicio doméstico </option>
                                            <option value=" Sistemas de Seguridad y alarmas "> Sistemas de Seguridad y alarmas </option>
                                            <option value=" Tapicería "> Tapicería </option>
                                            <option value=" Trabajos en piedra "> Trabajos en piedra </option>
                                        </select>
                                        <span class="icon-LupaFomularioIcono"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></span>
                                    </div>                        
                                    <button class="animacionBoton" type="submit"> Siguiente </button>
                                </div>                
                            </form>
                        </div>
                    </div>
                    {/* Mensaje del Banner inferior*/}
                    <div class="mensajeBanner">
                        <p> Encuentra aqui un profesional Seguro y Confiable para cada trabajo. Desde iluminación <br/>
                            y pequeños arreglos, hasta diseños de ingeniería y remodelaciones completas. </p> 
                    </div>
                </section>
                {/* Seccion de Registro */}
                <section id="registrate">
                    <div class="registrateImagen">
                        
                    </div>
                    <div class="registrateformulario">
                        <form id="formularioRegistro" action="">
                            <div>
                                <h1>REGISTRATE</h1> 
                                <p>bienvenido a todos los beneficios de dezzpo</p> 
                                <label for="">Nombre</label><br/>
                                <input type="text" value=""/><br/>
                                <label for="">Nombre de usuario</label><br/>
                                <input type="text" value=""/><br/>
                                <label for="">Email</label><br/>
                                <input type="email" value=""/><br/>
                                <label for="">Contraseña</label><br/>
                                <input type="password" value=""/><br/>
                                <label for="">Confirme la Contraseña</label><br/>
                                <input type="password" value=""/><br/>
                                <label for=""> No soy un robot
                                    <input type="checkbox" checked="checkbox"/> 
                                </label> <br/>
                                <button type="submit">Crear Cuenta</button>
                                <p>Bienvenido</p>
                            </div>
                        </form>
                    </div>
                </section>
                {/* Seccion de como funciona la comunidad */}
                <section id="comoFunciona">
                    <h1>¿Como funciona nuestra comunidad?</h1>
                    {/* Propietarios */}
                    <div class="comoPropietarios">
                        <div class="comunidadTitulo">
                            <h2>PROPIETARIOS</h2>
                        </div>
                        <div class="nuevoProyecto">
                            <p>
                                1 <br/>
                                Crea una nueva oferta gratis <br/>
                                Describe tu proyecto <br/>
                            </p>            
                        </div>
                        <div class="seleccionaPerfiles">
                            <p>
                                2 <br/>
                                Selecciona el perfil adecuado y <br/>
                                consigue algunas cotizaciones. <br/>
                                El servicio profesional se pondrá en <br/>
                                contacto con tigo. <br/>
                            </p>
                        </div>
                        <div class="calificaServicio">
                            <p>
                                3 <br/>
                                Califica y comenta. <br/>
                                Finalizo el proyecto, <br/>
                                Dejanos conocer tu experiencia. <br/>
                            </p>
                        </div>
                    </div>
                    {/* Comerciantes Calificados */}
                    <div class="comoComerciantes">
                        <div class="comunidadTitulo">
                            <h2>COMERCIANTES CALIFICADOS</h2>
                        </div>
                        <div class="buscarOfertas">
                            <p>
                                1 <br/>
                                Busca la oferta indicada para ti. <br/>
                                Filtra los proyectos de los <br/>
                                propietarios y postulate. <br/> 
                            </p> 
                        </div>
                        <div class="cargaPresupuesto">                
                            <p> 
                                2 <br/>
                                Diligencia el presupuesto <br/>
                                Haz una cotizacion detallada con los datos suministrados, <br/>
                                en caso de ser escogido por el propietario para desarrollar el <br/>
                                servicio, nos pagaras una comisión por el servicio prestado <br/>
                            </p> 
                        </div>
                        <div class="calificaPropietario">
                            <p>
                                3 <br/>
                                Califica y comenta. <br/>
                                Finalizo el proyecto, <br/>
                                Dejanos conocer tu experiencia. <br/>
                            </p>
                        </div>
                    </div>
                </section>
                {/* Afuturo importar del contenedor de categorias y servicios */}
                {/* seccion de categorias y servicios */}
                <section id="popularCategorias">
                    <div class="">
                        <h1> NUESTRA COMUNIDAD </h1>
                        <p>Tenemos una gran cantidad de profesionales que quieren trabajar en su proyecto.</p>
                        <img src="assets/img/CategoriasPopulares.png" alt="Categorias Populares entre la Comunidad" height="170" width="900"/>
                        <div class="categoriasPopulares">
                            <h2> o encuentralos dentro de las categorías populares:</h2>
                            <ul>
                                <li>Pintor y decorador, Pintura y decoracion de interiores </li>
                                <li>Electricista, Instalación y validación de acometidas electricas </li>
                                <li>Instaladores de techos y cubiertas, mantenimiento de cubiertas </li>
                                <li>Maestro, Construcciones y ampliaciones </li>
                                <li>Plomero, reparacion de fugas </li>
                                <li>Carpinteria, instalacion de closets, más </li>                
                            </ul>            
                        </div>
                    </div>
                </section>
                {/* seccion de categorias y servicios */}
                <section id="categoriasServicios">        
                    <div class="tituloServicios">
                        <h1>Nuestro comerciantes y servicios</h1>
                    </div> <br/>
                    <div class="contratistasReformas">            
                        <div>
                            <ul>
                                <li> Administraciones PH `{'>'}` administradores PH </li> 
                                <li> Acabados en muros`{'>'}` Afinadores de muros y acabados </li> 
                                <li> Aislamiento acústico`{'>'}` Aisladores acústicos </li> 
                                <li> Control de acceso `{'>'}` Integradores Control de acceso </li>
                                <li> Albañilería `{'>'}` Albañiles </li>
                                <li> Artesanías y manualidades `{'>'}` Artesanos </li>
                                <li> Arquitectura `{'>'}` Arquitectos </li>
                                <li> Asistencia toderos `{'>'}` Toderos </li>
                                <li> Automatización `{'>'}` Técnico en automatización </li>
                                <li> Domótica `{'>'}` Técnico en domótica </li>
                                <li> Carpintería `{'>'}` Carpinteros </li>
                                <li> Carpintería en aluminio `{'>'}` Carpinteros de aluminio </li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li> Carpintería metálica `{'>'}` Carpinteros de metales </li>
                                <li> Cerrajería `{'>'}` Cerrajeros </li>
                                <li> Construcción obra `{'>'}` Constructoras </li>
                                <li> Reformas Cocinas `{'>'}` Instaladores Cocina </li>
                                <li> Reformas Baños `{'>'}` Instaladores Baños </li>
                                <li> Control de plagas `{'>'}` Controladores de plagas </li>
                                <li> Diseño e impresión `{'>'}` Centros de diseño grafico </li>
                                <li> Drenajes e inundaciones `{'>'}` Técnico en drenajes e inundaciones </li>
                                <li> Electricidad `{'>'}` Electricistas </li>
                                <li> Estudios de suelos `{'>'}` Geólogos </li>
                                <li> Ferreterías `{'>'}` Ferreteros </li>
                                <li> Gasodomésticos y refrigeración `{'>'}` Técnico en gasodomésticos y refrigeración </li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li> Impermeabilización	`{'>'}` Impermeabilizadores </li>
                                <li> Instalación de adoquín `{'>'}` Instaladores de Adoquín </li>
                                <li> Instalación de cableado estructurado `{'>'}` Instaladores de cableado estructurado </li>
                                <li> Instalación de cerámica `{'>'}` Instaladores de cerámica </li>
                                <li> Instalación de cubiertas `{'>'}` Instaladores de cubiertas </li>
                                <li> Instalación de parques `{'>'}` Instaladores de parques </li>
                                <li> Instalación de ventanas `{'>'}` Instaladores de ventanas </li>
                                <li> Jardinería `{'>'}` Jardineros </li>
                                <li> Lavandería `{'>'}` Lavanderías </li>
                                <li> Tanques de agua `{'>'}` Técnicos de tanques de aguas </li>
                                <li> Limpiezas técnicas `{'>'}` Técnicos de limpiezas técnicas </li>
                                <li> Maestro Obra `{'>'}` Maestros de obra </li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li> Mudanzas `{'>'}` Ayudantes de mudanzas </li>
                                <li> Movilizar pesos `{'>'}` Ayudantes de movilizaciones </li>
                                <li> Mecánica `{'>'}` Mecánicos </li>
                                <li> Paisajismo `{'>'}` Paisajistas </li>
                                <li> Pintura `{'>'}` Pintores </li>
                                <li> Plomería `{'>'}` Plomeros </li>
                                <li> Redes cableado estructurado `{'>'}` Tecnicos en redes </li> 
                                <li> Reformas Piscinas `{'>'}` Reparadores de piscinas </li>
                                <li> Servicio doméstico `{'>'}` Asistentes de servicio domestico </li>
                                <li> Sistemas de Seguridad y alarmas `{'>'}` Técnico en seguridad electrónica </li>
                                <li> Tapicería `{'>'}` Tapiceros </li>
                                <li> Trabajos en piedra `{'>'}` Trabajadores de piedras </li>
                            </ul>
                        </div>        
                    </div>        
                </section>
                {/* seccion de comerciantes Locales*/}
                <section id="comerciantesLocales">
                    <div class="localCiudades">
                        <h1>Busca en tu ciudad comerciantes calificados</h1>
                        <div class="ciudades">
                            <ul>
                                <li>Bogota</li>
                                <li>Medellin</li>
                                <li>Cali</li>
                            </ul>
                            <ul>
                                <li>Villavicencio</li>
                                <li>Chia</li>
                                <li>Cota</li>
                            </ul>
                            <ul>
                                <li>Funza</li>
                                <li>Mosquera</li>
                                <li>Zipaquira</li>
                            </ul>
                        </div>    
                        <img src="assets/img/LocalCiudades.png" alt="Busca Comerciantes Locales" height="121px" width="500px"/>
                    </div>          
                </section>   
            </main>
        </React.Fragment>
    )
};

export default Inicio;