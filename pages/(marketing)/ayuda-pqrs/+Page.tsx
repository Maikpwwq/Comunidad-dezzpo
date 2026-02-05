/**
 * Ayuda PQRS (Help & FAQ) Page
 *
 * Converted to TypeScript.
 */
// Styles
import clsx from 'clsx'
// Components
import { InfoSection } from '@components/layout/InfoSection'
// Bootstrap
import { Row, Col, Container, Button } from 'react-bootstrap'
// MUI
import ChatIcon from '@mui/icons-material/Chat'
// FAQ data
const propietariosFaq = [
    'Adquirir servicios',
    'Modificar proyectos',
    '¿Cómo escoger el mejor personal?',
]
const comerciantesFaq = [
    'Ofrecer servicios',
    '¿Cuál es el costo de un proyecto?',
    '¿Cómo certifico mis habilidades y servicios?',
    '¿Cuánto me cobra la comunidad Dezzpo?',
    '¿Cómo puedo aplicar a un proyecto?',
    '¿Cómo responder con un presupuesto?',
]
const generalFaq = [
    '¿Cómo actualizo mi perfil en dezzpo?',
    '¿Cómo trabajan las calificaciones de los perfiles?',
    '¿Cómo solicitar y realizar calificaciones?',
    'Configurar mi cuenta',
    'Seguridad',
    'No puedo usar mi cuenta',
    'Consejos prácticos para Comerciantes calificados',
    'Reglamentación del Sistema de Salud y seguridad en el trabajo',
]
export default function Page() {
    return (
        <div className="help-page">
            <Container fluid className="p-0">
                <Row className="ayuda-pqrs-titulo m-0 w-100 d-flex flex-row justify-content-start align-items-center" style={{ minHeight: '500px' }}>
                    <Col className="align-items-start m-4 ps-md-5" lg={6} md={8} sm={10}>
                        <div className="opacidad-negro p-4 rounded-3" style={{ backdropFilter: 'blur(5px)' }}>
                            <h1 className="type-hero-title text-blanco mb-3">
                                ¿Qué tipo de profesional necesitas?
                            </h1>
                            <p className="headline-l text-blanco p-description mb-0">
                                ¿De qué manera podemos ayudarte?
                                <br />
                                Preguntas frecuentes.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0 bg-light">
                <Row className="ayuda-pqrs-preguntas m-0 w-100 py-5 justify-content-center">
                    <Col lg={10} className="d-flex flex-wrap">
                        <Col className="p-4" lg={6} md={12}>
                            <h3 className="headline-l mb-4 color-green">Propietarios FAQ's</h3>
                            <ul className="list-unstyled mb-5">
                                {propietariosFaq.map((item) => (
                                    <li key={item} className="mb-2">
                                        <a href="#" className="body-1 text-dark text-decoration-none hover-underline">{item}</a>
                                    </li>
                                ))}
                            </ul>

                            <h3 className="headline-l mb-4 color-green">Comerciantes calificados FAQ's</h3>
                            <ul className="list-unstyled mb-5">
                                {comerciantesFaq.map((item) => (
                                    <li key={item} className="mb-2">
                                        <a href="#" className="body-1 text-dark text-decoration-none hover-underline">{item}</a>
                                    </li>
                                ))}
                            </ul>

                            <h3 className="headline-l mb-4 color-green">
                                Y aquí, más todas las preguntas frecuentes
                            </h3>
                            <ul className="list-unstyled">
                                {generalFaq.map((item) => (
                                    <li key={item} className="mb-2">
                                        <a href="#" className="body-1 text-dark text-decoration-none hover-underline">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </Col>

                        <Col className="p-4" lg={6} md={12}>
                            <div className="bg-white p-5 rounded-3 shadow-sm">
                                <h3 className="headline-xl mb-4 text-center">Servicio al Cliente</h3>
                                <p className="body-1 mb-4">
                                    Si no estás seguro cómo la comunidad funciona,
                                    <br />
                                    o tienes una pregunta que no haya sido resuelta
                                    <br />
                                    en nuestra sección de preguntas frecuentes,
                                    <br />
                                    nuestro equipo estará dispuesto a ayudar,
                                    <br />
                                    respondiendo a tus mensajes de lunes a viernes
                                </p>

                                <InfoSection
                                    title="RESUELVE TUS DUDAS"
                                    centered
                                    className="mb-4"
                                    description=""
                                >
                                    <div className="text-center w-100">
                                        <span className="headline-m d-block mb-2">COMUNÍCATE CON UN ASESOR <ChatIcon className="ms-1" /></span>
                                    </div>
                                </InfoSection>

                                <div className="text-center mt-4">
                                    <Button className="btn btn-round btn-high btn-avanzar">
                                        <a
                                            className="body-1 text-white text-decoration-none"
                                            href="https://wa.me/573204842897?text=Hola%20estoy%20interesado%20en%20saber%20acerca%20de%20como%20Dezzpo%20..."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Chat en vivo
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </Col>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}
