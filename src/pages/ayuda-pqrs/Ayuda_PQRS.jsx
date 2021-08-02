/* Pagina de Ayuda & PQRS */
import React from 'react'
import '../../../public/assets/css/ayuda_pqrs.css'
import { Link } from 'react-router-dom'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const AyudaPQRS = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="ayudaPqrsTitulo m-0 w-100 d-flex flex-row justify-content-start">
                    <Col md={6}>
                        <span className="tituloPregunta">
                            <h1>¿Qué tipo de profesional necesitas?</h1>
                        </span>
                        <div className="opacidadNegro">
                            <p>
                                ¿De qué manera podemos ayudarte?
                                <br />
                                Preguntas frecuentes
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="ayudaPqrsPreguntas m-0 w-100">
                    <Col className="col">
                        <span className="tituloSinMargen">
                            <h3>Propietarios FAQ’s</h3>
                        </span>
                        <ul>
                            <li>
                                <a href="#">Adquirir servicios</a>
                            </li>
                            <li>
                                <a href="#">modificar proyectos</a>
                            </li>
                            <li>
                                <a href="#">¿como escoger el mejor personal?</a>
                            </li>
                        </ul>
                        <span className="tituloSinMargen">
                            <h3>Comerciantes calificados FAQ’s</h3>
                        </span>
                        <ul>
                            <li>
                                <a href="#">Ofrecer servicios </a>
                            </li>
                            <li>
                                <a href="#">
                                    ¿Cual es el costo de un proyecto?
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    ¿Como certifico mis habilidades y sevicios?
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    ¿Cuanto me cobra la comunidad Dezzpo?
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    ¿Como puedo aplicar a un proyecto?
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    ¿Como responder con un presupuesto?
                                </a>
                            </li>
                        </ul>
                        <span className="tituloSinMargen">
                            <h3>Y aquí, más todas las preguntas frecuentes</h3>
                        </span>
                        <ul>
                            <li>
                                <a href="#">
                                    ¿Cómo actualizo mi perfil en dezzpo?
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    ¿Cómo trabajan las calificaciones de los
                                    perfiles?
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    ¿como solicitar y realizar calificaciónes?{' '}
                                </a>
                            </li>
                            <li>
                                <a href="#">Configurar mi cuenta</a>
                            </li>
                            <li>
                                <a href="#">Seguridad</a>
                            </li>
                            <li>
                                <a href="#">No puedo usar mi cuenta</a>
                            </li>
                            <li>
                                <a href="#">
                                    Consejos practicos para Comerciantes
                                    calificados
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    Reglamentación del Sistema de Salud y
                                    seguridad en el trabajo
                                </a>
                            </li>
                        </ul>
                    </Col>
                    <Col className="col2 justify-content-start">
                        <span className="tituloSinMargen">
                            <h3>Servicio al Cliente</h3>
                        </span>
                        <p>
                            Si no estas seguro como la comunidad funciona,
                            <br />
                            o tienes una pregunta que no halla sido resuelta
                            <br />
                            en nuestra seccion de preguntas frecuentes,
                            <br />
                            nuestro equipo estará dispuesto a ayudar,
                            <br />
                            respondiendo a tus mensajes de lunes a viernes
                            <br />
                        </p>
                        <span>
                            RESUELVE TUS DUDAS
                            <br />
                            COMUNÍCATE CON
                            <br />
                            UN ASESOR
                        </span>
                        <br />
                        <button className="">CHAT EN VIVO</button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default AyudaPQRS
