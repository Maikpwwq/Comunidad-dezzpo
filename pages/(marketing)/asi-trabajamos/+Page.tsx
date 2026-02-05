/**
 * Así Trabajamos (How We Work) Page
 *
 * Converted to TypeScript.
 */
// Styles
// Bootstrap
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
                <Row className="asi-trabajamos-chat m-0 w-100 d-flex justify-content-end">
                    <Col className="col d-flex" md={6} sm={12}>
                        <h1 className="chat-asesor type-hero-title">
                            Contacta Con Un Asesor
                            <br />
                            en Tiempo Real En Nuestro Chat <ChatIcon className="ms-1" />
                        </h1>
                        <br />
                        <Button className="btn btn-round btn-high btn-avanzar">
                            <a
                                className="body-1"
                                href="https://wa.me/573204842897?text=Hola%20estoy%20interesado%20en%20saber%20acerca%20de%20como%20Dezzpo%20..."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                CHAT EN VIVO
                            </a>
                        </Button>
                    </Col>
                </Row>
            </Container>
            {/* Vinculate Section */}
            <Container fluid className="p-0">
                <Row className="asi-trabajamos-vinculate m-0 w-100 d-flex justify-content-end">
                    <Col className="col d-flex center" lg={4} md={8} sm={12}>
                        <span className="headline-xl opacidad-negro p-4">PERFIL COMERCIANTE</span>
                        <div className="pt-4">
                            <Button className="btn btn-vinculate">Vinculate</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* Propietario Section */}
            <Container fluid className="p-0">
                <Row className="asi-trabajamos-propietario m-0 w-100 d-flex justify-content-end">
                    <Col className="col d-flex m-0 p-0 ps-4 pe-4" lg={6} md={12} sm={12}>
                        <h2 className="headline-xl text-blanco">PROPIETARIO</h2>
                        <p className="body-2 m-0 p-0 ps-4 pe-4 ms-4 me-4 text-blanco">
                            SOMOS UNA COMUNIDAD DE COMERCIANTES PROFESIONALES, CONTRATA PERSONAL
                            CALIFICADO MANTENIMIENTO GENERAL RESIDENCIAL Y DE PROPIEDAD HORIZONTAL,
                            CONSULTA PÚBLICAMENTE LOS PERFILES Y LA REPUTACIÓN DE LOS PRESTADORES DE
                            SERVICIOS. AHORA TUS PROYECTOS Y REMODELACIONES MÁS RÁPIDO Y SIMPLE QUE NUNCA
                        </p>
                    </Col>
                </Row>
            </Container>
            {/* Certificación Section */}
            <Container fluid className="p-0">
                <Row className="asi-trabajamos-certificaciones m-0 w-100">
                    <Col className="d-flex flex-column align-items-center" md={12}>
                        <Col
                            className="certificaciones-titulo d-flex mb-4 mt-4 p-0 align-items-center"
                            style={{ minHeight: '8em' }}
                            lg={4}
                            md={6}
                            sm={10}
                            xs={12}
                        >
                            <span className="pt-4 p-0 mt-4 text-blanco certificacion-titulo headline-xl">
                                CERTIFICACIÓN
                            </span>
                        </Col>
                        <Col className="p-0 w-100 d-flex flex-column align-items-start">
                            <p className="text-blanco m-4 p-4 body-1" style={{ maxWidth: '75ch' }}>
                                Aumente sus posibilidades laborales, pregunta a nuestro equipo por
                                nuestra insignia de validación de habilidades. Esto te permitirá
                                brindar mayor confianza a los propietarios y acceder fácilmente a
                                proyectos de mayor complejidad.
                            </p>
                            <p className="text-blanco m-4 p-4 body-1" style={{ maxWidth: '75ch' }}>
                                Juntos programamos una visita de inspección para validar entre otras
                                cosas, certificados y diplomas, equipos y técnica requerida. ¿Listo
                                para solicitar una? Regístrese e ingrese con su usuario para comenzar.
                            </p>
                        </Col>
                    </Col>
                </Row>
            </Container>
            {/* Calificaciones Section */}
            <Container fluid className="p-0">
                <Row className="asi-trabajamos-calificaciones m-0 p-4 w-100 d-flex flex-column align-items-end">
                    <Col className="mt-4" lg={6} md={6} sm={12}>
                        <h2 className="headline-xl text-blanco">CALIFICACIONES</h2>
                        <p className="body-1 text-blanco">
                            La valoración debe darse con base en los siguientes tres aspectos:
                            <br />
                            {`>`} Gestión {`>`} Calidad {`>`} Oportunidad
                        </p>
                        <br />
                        <ul className="ps-0 body-2">
                            <li>Estado de observaciones generales y evaluación del desempeño:</li>
                            <br />
                            {ratingCriteria.map((criteria, index) => (
                                <li key={index}>- {criteria}</li>
                            ))}
                        </ul>
                    </Col>
                    <Col className="col-12" style={{ minHeight: '200px' }} />
                    <Col className="col-12" style={{ minHeight: '200px' }} />
                </Row>
            </Container>
            {/* Estadísticas Section */}
            <Container fluid className="p-0">
                <Row className="asi-trabajamos-estadisticas m-0">
                    <Row className="headline-l">
                        <ul>
                            {stats.map((stat) => (
                                <li key={stat.label}>
                                    <span className="text-black">{stat.value}</span>
                                    <br />
                                    {stat.label}
                                </li>
                            ))}
                        </ul>
                    </Row>
                </Row>
            </Container>
        </div>
    )
}
