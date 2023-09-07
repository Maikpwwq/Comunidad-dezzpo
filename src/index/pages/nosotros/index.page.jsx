export { Page }

// Pagina de Nosotros
import React from 'react'
import '#@/assets/css/nosotros.css'
import IcoMoon from 'react-icomoon'
import iconSet from '#@/assets/css/icomoon/selection.json'
// Imagenes
import RoadMap2 from '#@/assets/img/RoadMap2.png'
import Hitos from '#@/assets/img/Hitos.png'

// react-bootrstrap
// import { Row, Col, Container, Button } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Typography from '@mui/material/Typography'

const Page = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="nosotrosHistoria pageContainer m-0 justify-content-end">
                    <Col className="col-md-4 align-items-end">
                        <div className="opacidadNegro">
                            <h2
                                className="headline-xl"
                                style={{ color: '#e9ebe6' }}
                            >
                                HISTORIA
                            </h2>
                            <p className="body-2">
                                Únete a la red profesional de Comunidad Dezzpo:
                                brindamos soluciones de mantenimiento,
                                remodelaciones, instalaciones y acabados
                                inmobiliarios basados en experiencia, prevención
                                y empatía. ¡Accede a información confiable y
                                selecciona perfiles según estadísticas en
                                nuestro marketplace!
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row
                    className="nosotrosMisionVision m-0"
                    id="Acerca-de-nosotros"
                >
                    <Col
                        className="d-flex flex-column align-items-center p-4"
                        md={10}
                    >
                        <Row className="right w-100 p-4 d-flex flex-row justify-content-end align-content-start">
                            <Col
                                md={6}
                                className="d-flex flex-row justify-content-start"
                            >
                                <span className="pitchPropietarios">
                                    <h2 className="headline-xl">MISIÓN</h2>
                                </span>
                            </Col>
                            <Col md={6} className="ps-4 pe-4">
                                <p className="body-2 textBlanco ps-4 pe-4">
                                    Trabajamos para las personas, destacándonos
                                    por la calidad del servicio al cliente, el
                                    crecimiento continuo del ser y la gestión
                                    tecnológica, somos una Comunida de
                                    Comerciantes Calificados en mantenimiento
                                    general doméstico, brindando a susproyectos
                                    gestión oportuna del talento humano
                                    adecuado, haciendo asequible la técnica
                                    requerida para una solución de experiencia y
                                    prevención.
                                </p>
                            </Col>
                        </Row>
                        <Row className="left w-100 p-4 d-flex flex-row justify-content-start">
                            <Col md={6} className="ps-4 pe-4">
                                <p className="body-2 textBlanco ps-4 pe-4">
                                    Dezzpo será en 2024 una marca colombiana
                                    posicionada, referente de consulta para la
                                    gestión en proyectos de mantenimiento,
                                    ofreciendo a la comunidad una propuesta de
                                    valor amigable para los Comerciantes
                                    calificados y propietarios. Promoviendo el
                                    mejoramiento de la calidad de vida, y de los
                                    servicios, a través de soluciones
                                    tecnológicas con información a la medida.
                                </p>
                            </Col>
                            <Col
                                md={6}
                                className="d-flex flex-row justify-content-end"
                                style={{ 'padding-right': '80px' }}
                            >
                                <span className="pitchPropietarios">
                                    <h2 className="headline-xl">VISIÓN</h2>
                                </span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="nosotrosPoliticas m-0">
                    <Col>
                        <span className="pitchPropietarios">
                            <h2 className="headline-xl">
                                POLÍTICA INTEGRAL HSEQ
                            </h2>
                        </span>
                        <p className="body-2">
                            Propendemos por mitigar el impacto ambiental.
                            Nuestro proposito es asegurar la creacion de valor y
                            <br />
                            perdurarción en el tiempo. Usamos controles,
                            tecnicas y productos de calidad, alcanzando con
                            nuestro <br />
                            trabajo la satisfaccion y rentabilidad del cliente y
                            el bienestar de nuestros colaboradores,
                            capacitandonos <br />
                            en el correcto uso de elementos de proteccion
                            personal y de los equipos. <br />
                        </p>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="nosotrosEtica m-0">
                    <Col
                        lg={6}
                        md={6}
                        sm={12}
                        className="m-4 ps-4 d-flex justify-content-center"
                    >
                        <div className="left w-100 ps-4">
                            <h2 className="headline-xl textBlanco">
                                VALORES Y PRINCIPIOS
                            </h2>
                        </div>
                    </Col>
                    <Col lg={6} md={6} sm={12} className="m-4 ps-4">
                        <div className="right w-100">
                            <ul className="p-description textBlanco">
                                <li>Disiplina </li>
                                <li>Eficiencia </li>
                                <li>Empatia y humanismo </li>
                                <li>Excelencia y calidad </li>
                                <li>Trabajo en equipo </li>
                                <li>Crecimiento personal </li>
                                <li>Orden y limpieza </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0" id="eqipo-dezzpo">
                <Row className="nosotrosEquipo m-0">
                    <Col className="md-12 m-0">
                        <Col className="p-2 ps-4 pe-4 opacidadBlanco">
                            <span className="pitchPropietarios">
                                <h2 className="headline-xl">Equipo Dezzpo</h2>
                                <br />
                                <p className="p-description">
                                    Conoce a nuestro equipo
                                </p>
                            </span>
                        </Col>
                        <Col className="right p-4">
                            <div>
                                <Button className="btn-round btn-middle btn-orange w-auto body-1">
                                    Vinculate
                                </Button>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="nosotrosHitos m-0">
                    <Col className="p-0">
                        <Col className="p-0 w-100 mb-5">
                            <Typography variant='h3' className="headline-xl pt-5 pb-5">
                                HITOS
                            </Typography>
                            <Row className="w-100">
                                <img src={Hitos} style={{ width: 'auto', }} alt="Mapa de Hitos" />
                            </Row>
                            <Typography variant='h3' className="headline-xl pt-5 pb-5">
                                ROAD MAP
                            </Typography>
                            <Row className="w-100">
                                <img src={RoadMap2}  style={{ width: 'auto', }}  alt="ROAD MAP V2" />
                            </Row>
                        </Col>
                        <Col className="mb-5">
                            <p className="p-description">
                                Pronto estaremos disponibles en: <br />
                            </p>
                            {/* Apple App Store */}
                            <IcoMoon
                                iconSet={iconSet}
                                icon="GooglePlay"
                                style={{
                                    height: '48px',
                                    marginBottom: '8px',
                                    width: 'auto',
                                }}
                            />
                            {/* Android Google Play App Store */}
                            <IcoMoon
                                iconSet={iconSet}
                                icon="AppStore"
                                style={{
                                    height: '48px',
                                    marginBottom: '8px',
                                    width: 'auto',
                                }}
                            />
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
