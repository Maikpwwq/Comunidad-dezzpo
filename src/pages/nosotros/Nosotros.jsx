// Pagina de Nosotros
import React from 'react';

const Nosotros = props => {
    render ( 
        <React.Fragment>
            <main class="section">
                <div class="container">
                    <div class="nosotrosHistoria">
                        <div class="opacidadNegro">
                            <span class="pitchPropietarios"> <h1>HISTORIA</h1> </span>
                            <p>
                                La Comunidad Dezzpo Inc, un Marketplace de <br/>
                                servicios publicitarios, para contratistas de <br/>
                                mantenimiento inmobiliario. Aquí estamos <br/>
                                cambiando la forma de contratar, comerciantes <br/>
                                locales de reformas, maestros de construcción e<br/>
                                instaladores independientes de acabados. <br/>
                                Consulta públicamente los perfiles y la 
                                reputación de los prestadores de servicios, tus <br/>
                                proyectos y adecuaciones nunca han sido mejor asistidos.<br/>
                            </p>
                        </div>                
                    </div>
                    <div class="nosotrosMisionVision">
                        <div class="right">
                            <span class="pitchPropietarios"><h1>MISIÓN</h1></span>
                            <p>
                                Trabajamos para las personas, destacándonos por la calidad del servicio al <br/>
                                cliente, el crecimiento continuo del ser y la gestión tecnológica, somos una <br/>
                                Comunida de Comerciantes Calificados en mantenimiento general doméstico, brindando a<br/>
                                susproyectos gestión oportuna del talento humano adecuado , haciendo <br/>
                                asequible la técnica requerida para una solución de experiencia y prevención. <br/>
                            </p>
                            <br/>                    
                        </div> 
                        <br/>
                        <div class="left">
                            <br/>
                            <p>
                                Dezzpo será en 2020 una marca colombiana posicionada, referente de consulta para la<br/> 
                                gestión en proyectos de mantenimiento, ofreciendo a la comunidad una propuesta de <br/>
                                valor amigable para los  Comerciantes calificados y propietarios. Promoviendo el <br/>
                                mejoramiento de la calidad de vida, y de los  servicios, a través de soluciones <br/>
                                tecnológicas con información a la medida.
                            </p>
                            <span class="pitchPropietarios"><h1>VISIÓN</h1></span>
                        </div>                                 
                    </div>
                    <div class="nosotrosPoliticas">
                        <span class="pitchPropietarios"><h1>POLÍTICA INTEGRAL  HSEQ</h1></span>
                        <p>
                            Propendemos por mitigar el impacto ambiental. Nuestro proposito es asegurar la creacion de valor y <br/>
                            perdurarción en el tiempo. Usamos controles, tecnicas y productos de calidad, alcanzando con nuestro <br/>
                            trabajo la satisfaccion y rentabilidad del cliente y el bienestar de nuestros colaboradores, capacitandonos <br/>
                            en el correcto uso de elementos de proteccion personal y de los equipos. <br/>
                        </p>
                    </div>
                    <div class="nosotrosEtica">
                        <div class="left">
                            <span class="pitchPropietarios"><h1>VALORES Y PRINCIPIOS</h1></span>
                        </div>                
                        <div class="right">
                            <ul>
                                <li>Disiplina </li>
                                <li>Eficiencia  </li>
                                <li>Empatia y humanismo </li>
                                <li>Excelencia y calidad  </li>
                                <li>Trabajo en equipo </li>
                                <li>Crecimiento personal </li>
                                <li>Orden y limpieza </li>
                            </ul>
                        </div>                
                    </div>
                    <div class="nosotrosEquipo">
                        <div class="opacidadBlaco">
                            <span class="pitchPropietarios"><h1>Equipo Dezzpo</h1><br/>
                                Conoce a nuestro equipo</span>                                    
                        </div>                
                        <div class="right"><button>Vinculate</button></div>
                    </div>
                    <div class="nosotrosHitos">
                        <div class="left">
                            <span class="pitchPropietarios"> <h1>ROAD MAP <br/> HITOS</h1></span>
                        </div>                
                        <img src="assets/img/RoadMap.svg" alt="ROAD MAP"/>
                        <p>
                            Pronto estaremos disponibles en  <br/>
                            <li><a href="#">Apple App Store </a></li>
                            <li><a href="#">Android Google Play App Store </a> </li>
                        </p>
                    </div>
                </div>
            </main>    
        </React.Fragment>
    )
};

export default Nosotros;