// Pagina de Profesionales Servicios
import React from 'react';
import '../../../public/assets/css/profesionales_servicios.css';
import {Link} from 'react-router-dom';

const ProfesionalesServicios = props => {
    return ( 
        <>
            <main className="section">
                <div className="container">
                    <div className="profesionalesServiciosMensaje">
                        Profesionales y Servicios <br/>
                        Recuerda
                        <p>
                            Los Certificados describen las acreditaciones que ha recibido cada comerciante <br/>
                            calificado, estos se pueden consultar junto al perfil, además podras consultar <br/>
                            las fotos de sus anteriores trabajos, las calificaciones y comentarios de otros <br/>
                            Propietarios 
                        </p>
                        <span> Busca Profesionales en tu zona </span>
                    </div>
                    {/* seccion de categorias y servicios */}
                        <section id="popularCategorias">
                            <div className="">
                                <h1> NUESTRA COMUNIDAD </h1>
                                <p>Tenemos una gran cantidad de profesionales que quieren trabajar en su proyecto.</p>
                                <img src="assets/img/CategoriasPopulares.png" alt="Categorias Populares entre la Comunidad" height="170" width="900"/>
                                <div className="categoriasPopulares">
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
                            <div className="tituloServicios">
                                <h1>Nuestro comerciantes y servicios</h1>
                            </div> <br/>
                            <div className="contratistasReformas">            
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
                            <div className="localCiudades">
                                <h1>Busca en tu ciudad comerciantes calificados</h1>
                                <div className="ciudades">
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
                </div>
            </main>
        </>
    )
};

export default ProfesionalesServicios;