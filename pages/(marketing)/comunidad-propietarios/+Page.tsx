/**
 * Comunidad Propietarios Page
 *
 * Converted to TypeScript.
 */
// Styles
import React from 'react';
// Components
import { Link } from '@hooks'
import { ProjectSearchForm } from '@features/projects'
import { InfoSection } from '@components/layout/InfoSection'
// Assets
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

const checklistItems = [
    'Acceso a perfiles verificados.',
    'Garantía de cumplimiento.',
    'Soporte dedicado.',
    'Sin costos ocultos.'
]

const ChecklistItem = ({ text }: { text: string }) => (
    <div className="d-flex align-items-center mb-3">
        <span className="text-verde fw-bold fs-5 me-2">✓</span>
        <span className="body-1 text-blanco">{text}</span>
    </div>
)

const StepCard = ({ number, color, className, text }: { number: number, color: string, className?: string, text: React.ReactNode }) => (
    <Col className={`${className} p-0 mb-4 me-2`} lg={3} md={4} sm={10}>
        <div className="d-flex flex-column align-items-center text-center">
            <h3
                className="headline-l text-white d-flex align-items-center justify-content-center mb-3"
                style={{
                    backgroundColor: color,
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    margin: '0 auto'
                }}
            >
                {number}
            </h3>
            <p className="body-1 p-2">{text}</p>
        </div>
    </Col>
)

export default function Page() {
    return (
        <div className="owners-page">
            {/* Hero / Registration Section */}
            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-titulo m-0 align-items-center" style={{ minHeight: '600px' }}>
                    <Col lg={6} md={12} className="p-5 d-flex justify-content-center">
                        <div className="opacidad-negro p-5 rounded-3 w-100" style={{ maxWidth: '600px' }}>
                            <h1 className="type-hero-title text-blanco mb-4">
                                Regístrate como <br /> Propietario
                            </h1>
                            <p className="body-1 text-blanco mb-5">
                                Accede a una red de profesionales confiables para tus proyectos.
                            </p>
                            <Button
                                className="btn-round btn-high btn-orange body-1 px-5"
                                href="/registro"
                            >
                                Registrarme Gratis
                            </Button>
                        </div>
                    </Col>
                    {/* Background image is handled by CSS in .comunidad-propietarios-titulo */}
                </Row>
            </Container>
            {/* Search Section */}
            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-buscador m-0 py-5 bg-light position-relative" style={{ zIndex: 1 }}>
                    <Col className="text-start py-5 ps-lg-5" lg={6} md={8} sm={12}>
                        <Container>
                            <h2 className="headline-xl text-dark mb-4 ms-3">¿Qué proyecto tienes en mente?</h2>
                            <Row className="justify-content-start">
                                <Col lg={12}>
                                    <ProjectSearchForm simple={false} />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>

            {/* Info Section */}
            <Container>
                <Row className="py-5 justify-content-center">
                    <InfoSection
                        title="Cómo funciona"
                        description="Encuentra al profesional ideal en tres sencillos pasos"
                        centered
                    >
                        <Row className="ms-1 me-1 w-100 justify-content-center mt-4">
                            <StepCard
                                number={1}
                                color="#0f71b7"
                                text={<>Publica tu proyecto. Cuéntanos qué necesitas y recibe <strong>propuestas</strong> de expertos.</>}
                            />
                            <StepCard
                                number={2}
                                color="#30347b"
                                text={<>Compara y elige. Revisa perfiles, <strong>calificaciones</strong> y presupuestos.</>}
                            />
                            <StepCard
                                number={3}
                                color="#149ba1"
                                text={<>Contrata seguro. Acuerda los detalles y comienza tu proyecto con <strong>tranquilidad.</strong></>}
                            />
                        </Row>
                    </InfoSection>
                </Row>
            </Container>

            {/* Comunidad de Propietarios Section (Fixed Contrast) */}
            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-comunidad m-0 align-items-center py-5" style={{ minHeight: '500px', position: 'relative' }}>
                    {/* Add a dark overlay if the background image is too bright, or use opacidad-negro div */}
                    <div className="position-absolute w-100 h-100 bg-dark" style={{ opacity: 0.6, top: 0, left: 0, zIndex: 0 }}></div>
                    <Col lg={6} md={12} className="p-5 position-relative" style={{ zIndex: 1 }}>
                        <div className="ps-lg-5">
                            <h2 className="headline-xl text-blanco mb-4">Comunidad de Propietarios</h2>
                            <p className="body-1 text-blanco mb-5">
                                Únete a miles de propietarios que ya han transformado sus espacios con Dezzpo.
                                Encuentra el profesional ideal para tu proyecto con total seguridad.
                            </p>
                            <Button className="btn-round btn-middle btn-white text-dark fw-bold px-4">
                                Saber más
                            </Button>
                        </div>
                    </Col>
                    <Col lg={6} md={12} className="p-5 position-relative" style={{ zIndex: 1 }}>
                        <div className="bg-blur p-4 rounded-3 border border-light-subtle">
                            <h3 className="headline-m text-blanco mb-4">Beneficios exclusivos</h3>
                            {checklistItems.map((item, index) => (
                                <ChecklistItem key={index} text={item} />
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* Contact Section */}
            <Container fluid className="p-0 bg-white">
                <Row className="comunidad-propietarios-contacto m-0 py-5">
                    <Col className="text-center py-5">
                        <h2 className="headline-xl text-dark mb-4">¿Tienes dudas?</h2>
                        <p className="body-1 text-secondary mb-4">
                            Nuestro equipo de soporte está listo para ayudarte en cada paso.
                        </p>
                        <Button className="btn-round btn-middle btn-outline-dark px-5">
                            Contáctanos
                        </Button>
                    </Col>
                </Row>

                <Container className="mb-5 pb-5">
                    <Row className="justify-content-center g-4">
                        <Col md={6}>
                            <div className="p-5 bg-light rounded-3 h-100 text-center">
                                <h3 className="headline-m mb-3">¿Requieres de asesoría?</h3>
                                <p className="body-2 mb-4">Nuestra comunidad de comerciantes calificados te ayudarán.</p>
                                <Button className="btn btn-round btn-high btn-green body-2 w-100">
                                    <Link href="/asesorias">Pregunta a un Profesional</Link>
                                </Button>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className="p-5 bg-light rounded-3 h-100 text-center">
                                <h3 className="headline-m mb-3">Presupuestos</h3>
                                <p className="body-2 mb-4">Saber cuánto te puede costar es importante para iniciar.</p>
                                <Button className="btn btn-round btn-high btn-green body-2 w-100">
                                    <Link href="/nuevo-proyecto">Comenzar Cotización</Link>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
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
        </div >
    )
}
