export { Page }
/* Pagina de Ayuda & PQRS */
import React from 'react'
import '#@/assets/css/ayuda_pqrs.css'
import { Link } from '#R/Link'

// react-bootrstrap
// import { Row, Col, Container, Button } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import ChatIcon from '@mui/icons-material/Chat';

const Page = (props) => {
    const handleClickChat = () => {}
    return (
        <>
            <Container fluid className="p-0">
                <Row className="ayudaPqrsTitulo m-0 w-100 d-flex flex-row justify-content-start">
                    <Col
                        className="align-items-start m-4"
                        lg={4}
                        md={6}
                        sm={10}
                    >
                        <Col className="opacidadNegro center">
                            <h2 className="headline-xl textBlanco">
                                ¿Qué tipo de profesional necesitas?
                            </h2>
                            <p className="p-description">
                                ¿De qué manera podemos ayudarte?
                                <br />
                                Preguntas frecuentes.
                            </p>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="ayudaPqrsPreguntas m-0 w-100">
                    <Row className="p-4 align-items-baseline">
                        <Col className="col p-4" lg={5} sm={12}>
                            <span className="tituloSinMargen">
                                <h3 className="headline-l">
                                    Propietarios FAQ’s
                                </h3>
                            </span>
                            <ul className="body-1">
                                <li>
                                    <a href="#">Adquirir servicios</a>
                                </li>
                                <li>
                                    <a href="#">modificar proyectos</a>
                                </li>
                                <li>
                                    <a href="#">
                                        ¿como escoger el mejor personal?
                                    </a>
                                </li>
                            </ul>
                            <span className="tituloSinMargen">
                                <h3 className="headline-l">
                                    Comerciantes calificados FAQ’s
                                </h3>
                            </span>
                            <ul className="body-1">
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
                                        ¿Como certifico mis habilidades y
                                        sevicios?
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
                                <h3 className="headline-l">
                                    Y aquí, más todas las preguntas frecuentes
                                </h3>
                            </span>
                            <ul className="body-1">
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
                                        ¿como solicitar y realizar
                                        calificaciónes?
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
                        <Col
                            className="col justify-content-start p-4"
                            lg={5}
                            sm={12}
                            xs={12}
                        >
                            <span className="tituloSinMargen">
                                <h3 className="headline-l">
                                    Servicio al Cliente
                                </h3>
                            </span>
                            <p className="body-1">
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
                            <p className="p-description">
                                RESUELVE TUS DUDAS
                                <br />
                                COMUNÍCATE CON
                                <br />
                                UN ASESOR <ChatIcon className="ms-1"/> 
                            </p>
                            <br />
                            <Button
                                className="btn btn-round btn-high btn-avanzar"
                                onClick={handleClickChat}
                            >
                                <a
                                    className="body-1"
                                    href="https://api.whatsapp.com/send?phone=573196138057"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    CHAT EN VIVO
                                </a>
                            </Button>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </>
    )
}
