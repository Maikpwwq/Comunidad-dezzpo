/**
 * Nosotros (About Us) Page
 *
 * Converted to TypeScript.
 */
// Styles
import clsx from 'clsx'
// Components
import IcoMoon from 'react-icomoon'
import iconSet from '@assets/icomoon/selection.json'
// Assets
import RoadMap2 from '@assets/img/RoadMap2.png'
import Hitos from '@assets/img/Hitos.png'
// Bootstrap
import { Row, Col, Container, Button } from 'react-bootstrap'
// MUI
import { Typography } from '@mui/material'
// Values list
const values = [
    'Disciplina',
    'Eficiencia',
    'Empatía y humanismo',
    'Excelencia y calidad',
    'Trabajo en equipo',
    'Crecimiento personal',
    'Orden y limpieza',
]
export default function Page() {
    return (
        <div className="about-page">
            {/* Historia Section */}
            <Container fluid className="p-0">
                <Row className="nosotros-historia pageContainer m-0 justify-content-end">
                    <Col className="col-md-4 align-items-end">
                        <div className="opacidad-negro p-4 rounded-3 text-start">
                            <h1 className="type-hero-title text-start mb-4" style={{ color: '#e9ebe6' }}>
                                HISTORIA
                            </h1>
                            <p className="body-1 text-blanco">
                                Únete a la red profesional de Comunidad Dezzpo: brindamos soluciones de
                                mantenimiento, remodelaciones, instalaciones y acabados inmobiliarios
                                basados en experiencia, prevención y empatía. ¡Accede a información
                                confiiable y selecciona perfiles según estadísticas en nuestro marketplace!
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* Misión y Visión Section */}
            <Container fluid className="p-0">
                <Row className="nosotros-mision-vision m-0" id="Acerca-de-nosotros">
                    <Col className="d-flex flex-column align-items-center p-4" md={10}>
                        <Row className="right w-100 p-lg-5 p-4 d-flex flex-row justify-content-end align-content-start">
                            <Col md={12} lg={10} className="d-flex flex-wrap justify-content-end text-end">
                                <span className="pitch-propietarios mb-3 d-block w-100">
                                    <h2 className="headline-xl text-blanco">MISIÓN</h2>
                                </span>
                                <p className="body-1 text-blanco ps-lg-5" style={{ maxWidth: '800px' }}>
                                    Trabajamos para las personas, destacándonos por la calidad del
                                    servicio al cliente, el crecimiento continuo del ser y la gestión
                                    tecnológica. Somos una Comunidad de Comerciantes Calificados en
                                    mantenimiento general doméstico, brindando gestión oportuna del
                                    talento humano adecuado.
                                </p>
                            </Col>
                        </Row>
                        <Row className="left w-100 p-lg-5 p-4 d-flex flex-row justify-content-start">
                            <Col md={12} lg={10} className="d-flex flex-wrap justify-content-start text-start">
                                <span className="pitch-propietarios mb-3 d-block w-100">
                                    <h2 className="headline-xl text-blanco">VISIÓN</h2>
                                </span>
                                <p className="body-1 text-blanco pe-lg-5" style={{ maxWidth: '800px' }}>
                                    Dezzpo será en 2024 una marca colombiana posicionada, referente de
                                    consulta para la gestión en proyectos de mantenimiento, ofreciendo a
                                    la comunidad una propuesta de valor amigable para los Comerciantes
                                    calificados y propietarios.
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            {/* Política HSEQ Section */}
            <Container fluid className="p-0">
                <Row className="nosotros-politicas m-0 py-5">
                    <Col className="py-5 text-center">
                        <span className="pitch-propietarios mb-4 d-block">
                            <h2 className="headline-xl">POLÍTICA INTEGRAL HSEQ</h2>
                        </span>
                        <p className="body-1 text-optimal-width mx-auto text-center pb-5" style={{ maxWidth: '800px' }}>
                            Propendemos por mitigar el impacto ambiental. Nuestro propósito es
                            asegurar la creación de valor y perduración en el tiempo. Usamos
                            controles, técnicas y productos de calidad, alcanzando con nuestro
                            trabajo la satisfacción y rentabilidad del cliente y el bienestar de
                            nuestros colaboradores.
                        </p>
                    </Col>
                </Row>
            </Container>
            {/* Valores Section */}
            <Container fluid className="p-0">
                <Row className="nosotros-etica m-0 py-5 align-items-center">
                    <Col lg={6} md={6} sm={12} className="p-5 d-flex justify-content-md-end justify-content-center">
                        <div className="text-md-end text-center">
                            <h2 className="headline-xl text-blanco">VALORES Y PRINCIPIOS</h2>
                        </div>
                    </Col>
                    <Col lg={6} md={6} sm={12} className="p-5">
                        <div className="w-100">
                            <ul className="list-unstyled text-blanco">
                                {values.map((value) => (
                                    <li key={value} className="headline-s mb-2">{value}</li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* Equipo Section */}
            <Container fluid className="p-0" id="equipo-dezzpo">
                <Row className="nosotros-equipo m-0 align-items-center" style={{ minHeight: '500px' }}>
                    <Col md={12} className="d-flex flex-column align-items-center justify-content-center text-center p-5">
                        <div className="opacidad-negro p-5 rounded-3">
                            <h2 className="headline-xl text-blanco mb-3">Equipo Dezzpo</h2>
                            <p className="body-1 text-blanco mb-4">Conoce a nuestro equipo</p>
                            <Button className="btn btn-round btn-high btn-orange body-1 px-5">
                                Vinculate
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* Hitos Section */}
            <Container fluid className="p-0">
                <Row className="nosotros-hitos m-0 py-5">
                    <Col className="p-0 text-center">
                        <Col className="p-0 w-100 mb-5">
                            <h3 className="headline-xl pt-5 pb-5">
                                HITOS
                            </h3>
                            <Row className="w-100 justify-content-center m-0">
                                <img src={Hitos} style={{ width: 'auto', maxWidth: '100%' }} alt="Mapa de Hitos" />
                            </Row>
                            <h3 className="headline-xl pt-5 pb-5">
                                ROAD MAP
                            </h3>
                            <Row className="w-100 justify-content-center m-0">
                                <img src={RoadMap2} style={{ width: 'auto', maxWidth: '100%' }} alt="Road Map V2" />
                            </Row>
                        </Col>
                        <Col className="mb-5">
                            <p className="headline-m mb-3">
                                Pronto estaremos disponibles en:
                                <br />
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <IcoMoon
                                    iconSet={iconSet}
                                    icon="GooglePlay"
                                    style={{ height: '48px', width: 'auto' }}
                                />
                                <IcoMoon
                                    iconSet={iconSet}
                                    icon="AppStore"
                                    style={{ height: '48px', width: 'auto' }}
                                />
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
