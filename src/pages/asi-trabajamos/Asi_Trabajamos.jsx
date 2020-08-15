// Pagina de Asi Trabajamos
import React from 'react';

const AsiTrabajamos = props => {
    render ( 
        <React.Fragment>
            <main class="section">
                <div class="container">
                    <div class="asiTrabajamosRegistro">
                        {/*se importa el componente de registro */} 
                    </div>
                    <div class="asiTrabajamosChat">
                        <div class="colRight">
                            <span class="chatAsesor"> Contacta Con Un Asesor  <br/>
                                en Tiempo Real En Nuestro Chat </span>
                                <br/><br/>
                            <div><button class="btn">CHAT EN VIVO</button></div>
                        </div>
                    </div>
                    <div class="asiTrabajamosVinculate">
                        <div class="colRight2">
                            <span> PERFIL COMERCIANTE </span>
                            <div><button class="btn">Vinculate</button></div>
                        </div>
                    </div>
                    <div class="asiTrabajamosPropietario">
                        <div class="colRight3">
                            <span> <h1>PROPIETARIO</h1> </span>
                            <p>
                                SOMOS UNA COMUNIDAD DE COMERCIANTES PROFESIONALES,<br/> 
                                CONTRATA PERSONAL CALIFICADO MANTENIMIENTO GENERAL <br/>
                                RESIDENCIAL Y DE PROPIEDAD HORIZONTAL, CONSULTA <br/>
                                PÚBLICAMENTE LOS PERFILES Y LA REPUTACIÓN DE LOS <br/>
                                PRESTADORES DE SERVICIOS. AHORA TUS PROYECTOS Y <br/>
                                REMODELACIONES MÁS RÁPIDO Y SIMPLE QUE NUNCA <br/>
                            </p>
                        </div>                
                    </div>
                    <div class="asiTrabajamosCertificaciones">
                        <div class="colCenter">
                            <span class=""> CERTIFICACIÓN </span>
                        </div>
                        <div class="colLeft">
                            <p class="whiteP">
                                Aumente sus posibilidades laborales, pregunta a nuestro equipo por nuestra insignia <br/>
                                de validación de habilidades, esto te permitira brindar mayor confianza a los <br/>
                                propietarios, y acceder facilmente a proyectos de mayor complejidad <br/>
                            </p>
                            <p >
                                Juntos programamos una visita de inspección para validarentre otras cosas, <br/>
                                certificados y  diplomas, equipos y tecnica requerida. <br/>
                                ¿Listo para solicitar una? Regístrese e ingrese con su usuario para comenzar. <br/>
                            </p>                    
                        </div>
                    </div>
                    <div class="asiTrabajamosCalificaciones">
                        <div class="colRight3">
                            <span><h1>CALIFICACIONES</h1></span>
                            <p class="LeftP">
                                La valoración debe darse con base en los <br/>
                                siguientes tres aspectos: <br/>
                                `{'>'}` Gestión `{'>'}` Calidad  `{'>'}` Oportunidad <br/>
                                <br/>
                                <ul>
                                    <li>Estado de observaciones generales y evaluacion del desempeño: </li>
                                    <li>Cumple con los tiempos de entrega de las certificaciones,<br/>
                                        polizas, actas y contratos. </li>
                                    <li>El servicio fue prestado en las fechas y horario programados.</li>
                                    <li>El servicio cumplio con las especificaciones y <br/>
                                        normas tecnicas establecidas.</li>
                                    <li>Fue suficiente el presonal y tenia todas las competencias <br/>
                                        necesarias para ejecutar las actividades del contrato. </li>
                                    <li>Las facturas, soportes y documentos contractuales fueren <br/>
                                        entregados oportunamente.</li>
                                </ul>
                            </p>
                        </div>            
                    </div>
                    <div class="asiTrabajamosEstadisticas">
                        <div class="row">
                            <ul>
                                <li>USUARIOS</li>
                                <li>ACTIVO DESDE</li>
                                <li>CLIENTES FELICES</li>
                                <li>PROYECTOS</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </React.Fragment>
    )
};

export default AsiTrabajamos;