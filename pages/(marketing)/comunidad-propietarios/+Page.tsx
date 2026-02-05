/**
 * Comunidad Propietarios Page
 *
 * Converted to TypeScript.
 */
// Styles
import clsx from 'clsx'
// Components
import { Link } from '@hooks'
import Registro from '../../../pages/(auth)/registro/+Page'
import { ProjectSearchForm } from '@features/projects'
import { InfoSection } from '@components/layout/InfoSection'
// Bootstrap
import { Row, Col, Container, Button } from 'react-bootstrap'

// Verification list items
const verificationList = [
    'Verifica Adecuadamente La Identidad.',
    'Que el personal cuente con los elementos de protección personal requeridos.',
    'Recuerda verificar los certificados técnicos y de afiliación propios de cada labor.',
    'Diligenciar y firmar debidamente el contrato de prestación de servicios.',
    'Las obras que afectan a terceros de la comunidad han de hacerse saber para conseguir su aprobación.',
    'Cuando hayas elegido el profesional, descarga y utiliza el contrato de adquisición.',
    'Reserva un 5% del presupuesto para imprevistos.',
    'Expón claramente cualquier aspecto que pueda influir en el resultado final.',
    'Si el proyecto tiene impacto energético y/o ecológico, consulta ayudas y subvenciones institucionales.',
]

export default function Page() {
    return (
        <div className="owners-page">
            <Container fluid className="p-0" style={{ overflowY: 'hidden' }}>
                <Row className="comunidad-propietarios-titulo m-0 d-flex flex-row justify-content-start align-items-center" style={{ minHeight: '600px' }}>
                    <Col className="align-items-start ps-md-5" md={8} sm={12} lg={6}>
                        <div className="opacidad-negro p-4 rounded-3" style={{ backdropFilter: 'blur(5px)' }}>
                            <p className="body-2 text-blanco mb-4">
                                Somos un Marketplace de servicios, promocionamos contratistas de
                                adecuaciones y acabados inmobiliarios. Compara perfiles y
                                estadísticas, con base en calificaciones de la comunidad.
                            </p>
                            <h1 className="type-hero-title text-verde mb-4">
                                Contrata seguro con nuestra comunidad
                            </h1>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-registro m-0 align-items-center">
                    <Col md={6} lg={6} className="d-flex justify-content-center p-5">
                        <div className="text-center" style={{ maxWidth: '500px' }}>
                            <h2 className="headline-xl mb-4">Comunidad de Propietarios</h2>
                            <p className="body-1">Encuentra el profesional ideal para tu proyecto con total seguridad.</p>
                        </div>
                    </Col>
                    <Registro />
                </Row>
            </Container>

            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-buscador m-0 align-items-center p-5">
                    <Col
                        className="d-flex justify-content-center align-items-center mb-4 mb-lg-0"
                        lg={6}
                        md={12}
                    >
                        <div className="opacidad-negro p-4 rounded-3 text-center" style={{ maxWidth: '500px' }}>
                            <h3 className="headline-l text-blanco mb-3">Haz realidad la casa que deseas</h3>
                            <p className="body-2 text-blanco">
                                Con ayuda de la comunidad encuentra un profesional Seguro y Confiable, para cada trabajo.
                            </p>
                        </div>
                    </Col>
                    <Col className="d-flex justify-content-center" lg={6} md={12}>
                        <div className="w-100" style={{ maxWidth: '600px' }}>
                            <ProjectSearchForm simple={false} />
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container className="py-5">
                <InfoSection
                    title="Planea con nosotros el proyecto"
                    description="El espacio de tus sueños comienza con una gran idea y tenemos miles de ellas."
                    centered
                    className="mb-5"
                >
                    <Button className="btn btn-round btn-high btn-green body-1 mt-3">
                        <Link href="/blog">Nuestro Blog</Link>
                    </Button>
                </InfoSection>

                <Row className="justify-content-center">
                    <Col lg={4} md={12} className="mb-4 d-flex flex-column align-items-center text-center px-4">
                        <p className="body-2 mb-4">
                            Nuestra recomendación esencial al contratar un comerciante
                            calificado, nunca cancelar la totalidad por adelantado.
                        </p>
                        <h4 className="headline-m mb-3">Propietario revisa la</h4>
                        <Button className="btn btn-avanzar body-1 text-blanco mb-4 w-100" style={{ maxWidth: '250px' }}>
                            Lista de chequeo
                        </Button>
                        <div className="body-2 bg-light p-3 rounded-3 w-100">
                            <strong>3204842897</strong><br />
                            Lunes a viernes, 8am - 5pm<br />
                            Sábados 9am - 2pm
                        </div>
                    </Col>

                    <Col lg={8} md={12}>
                        <Row>
                            <Col md={12} className="mb-4">
                                <div className="p-4 bg-light rounded-3 h-100">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                                        <h3 className="headline-m m-0">Observa cambios</h3>
                                        <Button className="btn btn-round btn-high btn-green body-2 my-2">
                                            <Link href="/blog">Proyectos Destacados</Link>
                                        </Button>
                                    </div>
                                    <p className="body-2">Inspírate, tenemos muchos trabajos realizados.</p>
                                </div>
                            </Col>

                            <Col md={6} className="mb-4">
                                <div className="p-4 bg-light rounded-3 h-100">
                                    <h3 className="headline-m mb-3">¿Requieres de asesoría?</h3>
                                    <p className="body-2 mb-4">Nuestra comunidad de comerciantes calificados te ayudarán.</p>
                                    <Button className="btn btn-round btn-high btn-green body-2 w-100">
                                        <Link href="/asesorias">Pregunta a un Profesional</Link>
                                    </Button>
                                </div>
                            </Col>

                            <Col md={6} className="mb-4">
                                <div className="p-4 bg-light rounded-3 h-100">
                                    <h3 className="headline-m mb-3">Presupuestos</h3>
                                    <p className="body-2 mb-4">Saber cuánto te puede costar es importante para iniciar.</p>
                                    <Button className="btn btn-round btn-high btn-green body-2 w-100">
                                        <Link href="/nuevo-proyecto">Comenzar Cotización</Link>
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-lista-verificacion m-0 py-5 justify-content-center">
                    <Col lg={8} md={10} className="position-relative z-1"> {/* Added z-index to ensure text is above overlay if any */}
                        <div className="p-5 rounded-3" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
                            <h2 className="type-hero-title text-blanco mb-5 text-center">LISTA DE VERIFICACIÓN</h2>
                            <ul className="list-unstyled">
                                {verificationList.map((item, index) => (
                                    <li key={index} className="body-1 text-white mb-3 d-flex">
                                        <span className="me-2 text-verde">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 border-top border-light">
                                <p className="headline-m text-verde text-center m-0">
                                    Se resuelve la encuesta de satisfacción del servicio
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
