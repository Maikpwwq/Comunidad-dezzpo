// Pagina de Nosotros
import React from 'react'
import '../../../../public/assets/css/nosotros.css'

// Imagenes
import RoadMap from '../../../../public/assets/img/RoadMap.svg'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Nosotros = (props) => {
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
                                La Comunidad Dezzpo Inc, un Marketplace de{' '}
                                servicios publicitarios, para contratistas de{' '}
                                mantenimiento inmobiliario.
                                <br /> Aquí estamos cambiando la forma de
                                contratar, comerciantes locales de reformas,
                                maestros de construcción e instaladores
                                independientes de acabados. <br />
                                Consulta públicamente los perfiles y la
                                reputación de los prestadores de servicios, tus
                                proyectos y adecuaciones nunca han sido mejor
                                asistidos. <br />
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
                                    Dezzpo será en 2020 una marca colombiana
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
                            Nuestro proposito es asegurar la creacion de valor y{' '}
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
                        <Col>
                            <div className="opacidadBlaco">
                                <span className="pitchPropietarios">
                                    <h2 className="headline-xl">
                                        Equipo Dezzpo
                                    </h2>
                                    <br />
                                    <p className="p-description">
                                        Conoce a nuestro equipo
                                    </p>
                                </span>
                            </div>
                        </Col>
                        <Col className="right">
                            <div>
                                <button>Vinculate</button>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="nosotrosHitos m-0">
                    <Col className="p-0">
                        <Col className="p-0 w-100">
                            <h2 className="headline-xl">
                                ROAD MAP <br /> HITOS
                            </h2>
                            <Row className="w-100">
                                <img src={RoadMap} alt="ROAD MAP" />
                            </Row>
                        </Col>
                        <Col className="">
                            <p className="p-description">
                                Pronto estaremos disponibles en <br />
                                <li>
                                    <a href="#">Apple App Store </a>
                                </li>
                                <li>
                                    <a href="#">
                                        Android Google Play App Store{' '}
                                    </a>{' '}
                                </li>
                            </p>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Nosotros
