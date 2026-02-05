/**
 * Así Trabajamos (How We Work) Page
 *
 * Converted to TypeScript.
 */
// Styles
import clsx from 'clsx'
// Components
import { InfoSection } from '@components/layout/InfoSection'
// Bootstrap
import { Row, Col, Button, Container } from 'react-bootstrap'
// MUI
import ChatIcon from '@mui/icons-material/Chat'
// Stats data
const stats = [
    { value: '48', label: 'USUARIOS' },
    { value: '2021', label: 'ACTIVO DESDE' },
    { value: '33', label: 'CLIENTES FELICES' },
    { value: '62', label: 'PROYECTOS' },
]
// Rating criteria
const ratingCriteria = [
    'Cumple con los tiempos de entrega de las certificaciones, pólizas, actas y contratos.',
    'El servicio fue prestado en las fechas y horario programados.',
    'El servicio cumplió con las especificaciones y normas técnicas establecidas.',
    'Fue suficiente el personal y tenía todas las competencias necesarias.',
    'Las facturas, soportes y documentos contractuales fueron entregados oportunamente.',
]
export default function Page() {
    return (
        <div className="how-it-works-page">
            <div className="asi-trabajamos-registro" />
            {/* Chat Section */}
            <Container fluid className="p-0">
                <Row className="asi-trabajamos-chat m-0 w-100 d-flex align-items-center" style={{ minHeight: '600px' }}>
                    <Col className="d-flex justify-content-end pe-md-5" md={12}>
                        <div className="text-end p-5" style={{ maxWidth: '800px' }}>
                            <h1 className="type-hero-title mb-4">
                                Contacta Con Un Asesor
                                <br />
                                en Tiempo Real En Nuestro Chat <ChatIcon className="ms-1" style={{ fontSize: 'inherit' }} />
                            </h1>
                            <Button className="btn btn-round btn-high btn-avanzar mt-3">
                                <a
                                    className="body-1 text-white text-decoration-none"
                                    href="https://wa.me/573204842897?text=Hola%20estoy%20interesado%20en%20saber%20acerca%20de%20como%20Dezzpo%20..."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    CHAT EN VIVO
                                </a>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Vinculate Section */}
            <Container fluid className="p-0">
                <Row className="asi-trabajamos-vinculate m-0 w-100 align-items-center py-5">
                    <Col className="text-center" lg={12}>
                        <div className="p-5 d-inline-block rounded-3 bg-light">
                            <span className="headline-xl opacidad-negro d-block mb-4">PERFIL COMERCIANTE</span>
                            <Button className="btn btn-vinculate btn-lg px-5">Vincúlate</Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Propietario Section */}
            <Container fluid className="p-0 bg-dark">
                <Row className="asi-trabajamos-propietario m-0 w-100 py-5 justify-content-center">
                    <Col className="p-5" lg={8} md={10}>
                        <div className="text-center">
                            <h2 className="headline-xl text-blanco mb-4">PROPIETARIO</h2>
                            <p className="body-1 text-blanco" style={{ maxWidth: '900px', margin: '0 auto' }}>
                                SOMOS UNA COMUNIDAD DE COMERCIANTES PROFESIONALES, CONTRATA PERSONAL
                                CALIFICADO MANTENIMIENTO GENERAL RESIDENCIAL Y DE PROPIEDAD HORIZONTAL,
                                CONSULTA PÚBLICAMENTE LOS PERFILES Y LA REPUTACIÓN DE LOS PRESTADORES DE
                                SERVICIOS. AHORA TUS PROYECTOS Y REMODELACIONES MÁS RÁPIDO Y SIMPLE QUE NUNCA
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Certificación Section */}
            <Container fluid className="p-0">
                <Row className="asi-trabajamos-certificaciones m-0 w-100 py-5 align-items-center">
                    <Col lg={4} md={12} className="text-center text-lg-end p-5">
                        <span className="headline-xl text-blanco">
                            CERTIFICACIÓN
                        </span>
                    </Col>
                    <Col lg={8} md={12} className="p-5">
                        <p className="text-blanco body-1 mb-4" style={{ maxWidth: '75ch' }}>
                            Aumente sus posibilidades laborales, pregunta a nuestro equipo por
                            nuestra insignia de validación de habilidades. Esto te permitirá
                            brindar mayor confianza a los propietarios y acceder fácilmente a
                            proyectos de mayor complejidad.
                        </p>
                        <p className="text-blanco body-1" style={{ maxWidth: '75ch' }}>
                            Juntos programamos una visita de inspección para validar entre otras
                            cosas, certificados y diplomas, equipos y técnica requerida. ¿Listo
                            para solicitar una? Regístrese e ingrese con su usuario para comenzar.
                        </p>
                    </Col>
                </Row>
            </Container>

            {/* Calificaciones Section */}
            <Container className="py-5">
                <Row className="asi-trabajamos-calificaciones m-0 w-100 justify-content-center">
                    <Col lg={8} md={10}>
                        <InfoSection
                            title="CALIFICACIONES"
                            className="text-white mb-4"
                            description="La valoración debe darse con base en los siguientes tres aspectos:"
                        >
                            <div className="w-100 my-3 text-center">
                                <strong className="headline-m text-verde">Gestión {'>'} Calidad {'>'} Oportunidad</strong>
                            </div>
                        </InfoSection>

                        <div className="bg-dark p-4 rounded-3 text-white">
                            <p className="body-2 mb-3">Estado de observaciones generales y evaluación del desempeño:</p>
                            <ul className="list-unstyled">
                                {ratingCriteria.map((criteria, index) => (
                                    <li key={index} className="body-2 mb-2 d-flex">
                                        <span className="me-2 text-verde">•</span>
                                        {criteria}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Estadísticas Section */}
            <Container fluid className="p-0 bg-light">
                <Row className="asi-trabajamos-estadisticas m-0 py-5 justify-content-center">
                    <Col lg={10}>
                        <Row className="text-center">
                            {stats.map((stat) => (
                                <Col key={stat.label} md={3} sm={6} className="mb-4 mb-md-0">
                                    <div className="p-3">
                                        <span className="headline-xl d-block mb-2 text-primary">{stat.value}</span>
                                        <span className="body-1 text-muted fw-bold">{stat.label}</span>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
