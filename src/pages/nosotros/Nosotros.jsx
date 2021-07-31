// Pagina de Nosotros
import React from 'react'
import '../../../public/assets/css/nosotros.css'

// Imagenes
import RoadMap from '../../../public/assets/img/RoadMap.svg'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Nosotros = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="pageContainer m-0">
                    <Col className="nosotrosHistoria align-items-end">
                        <div className="opacidadNegro">
                            <span className="pitchPropietarios">
                                {' '}
                                <h2 style={{ color: '#e9ebe6' }}>
                                    HISTORIA
                                </h2>{' '}
                            </span>
                            <p>
                                La Comunidad Dezzpo Inc, un Marketplace de{' '}
                                <br />
                                servicios publicitarios, para contratistas de{' '}
                                <br />
                                mantenimiento inmobiliario. Aquí estamos <br />
                                cambiando la forma de contratar, comerciantes{' '}
                                <br />
                                locales de reformas, maestros de construcción e
                                <br />
                                instaladores independientes de acabados. <br />
                                Consulta públicamente los perfiles y la
                                reputación de los prestadores de servicios, tus
                                proyectos <br /> y adecuaciones nunca han sido
                                mejor asistidos. <br />
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="nosotrosMisionVision m-0">
                    <Col
                        className="d-flex flex-column align-items-center"
                        md={12}
                    >
                        <Row className="right w-100 m-0 d-flex flex-row justify-content-end align-content-start">
                            <Col
                                md={6}
                                className="d-flex flex-row justify-content-start"
                            >
                                <span className="pitchPropietarios">
                                    <h2>MISIÓN</h2>
                                </span>
                            </Col>
                            <Col md={6}>
                                <p>
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
                        <Row className="left w-100 m-0 d-flex flex-row justify-content-start">
                            <Col md={6}>
                                <p>
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
                                    <h2>VISIÓN</h2>
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
                            <h2>POLÍTICA INTEGRAL HSEQ</h2>
                        </span>
                        <p>
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
                        md={6}
                        className="w-50 ps-4 d-flex justify-content-center"
                    >
                        <div className="left w-100 ps-4">
                            <span className="pitchPropietarios">
                                <h2 style={{ color: '#e9ebe6' }}>
                                    VALORES Y PRINCIPIOS
                                </h2>
                            </span>
                        </div>
                    </Col>
                    <Col md={6} className="w-50">
                        <div className="right w-100">
                            <ul>
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
            <Container fluid className="p-0">
                <Row className="nosotrosEquipo m-0">
                    <Col className="md-12 m-0">
                        <Col>
                            <div className="opacidadBlaco">
                                <span className="pitchPropietarios">
                                    <h2>Equipo Dezzpo</h2>
                                    <br />
                                    Conoce a nuestro equipo
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
                    <Col>
                        <Col>
                            <div className="left">
                                <span className="pitchPropietarios">
                                    {' '}
                                    <h2>
                                        ROAD MAP <br /> HITOS
                                    </h2>
                                </span>
                            </div>
                            <img src={RoadMap} alt="ROAD MAP" />
                        </Col>
                        <Col>
                            <p>
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
