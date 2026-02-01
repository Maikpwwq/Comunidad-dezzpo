/**
 * Ayuda PQRS (Help & FAQ) Page
 *
 * Converted to TypeScript.
 */
// Styles
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
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
        <>
            <Container fluid className="help-page p-0">
                <Row className="ayuda-pqrs-titulo m-0 w-100 d-flex flex-row justify-content-start">
                    <Col className="align-items-start m-4" lg={4} md={6} sm={10}>
                        <Col className="opacidad-negro center">
                            <h2 className="headline-xl text-blanco">
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
                <Row className="ayuda-pqrs-preguntas m-0 w-100">
                    <Row className="p-4 align-items-baseline">
                        <Col className="col p-4" lg={5} sm={12}>
                            <span className="titulo-sin-margen">
                                <h3 className="headline-l">Propietarios FAQ's</h3>
                            </span>
                            <ul className="body-1">
                                {propietariosFaq.map((item) => (
                                    <li key={item}>
                                        <a href="#">{item}</a>
                                    </li>
                                ))}
                            </ul>
                            <span className="titulo-sin-margen">
                                <h3 className="headline-l">Comerciantes calificados FAQ's</h3>
                            </span>
                            <ul className="body-1">
                                {comerciantesFaq.map((item) => (
                                    <li key={item}>
                                        <a href="#">{item}</a>
                                    </li>
                                ))}
                            </ul>
                            <span className="titulo-sin-margen">
                                <h3 className="headline-l">
                                    Y aquí, más todas las preguntas frecuentes
                                </h3>
                            </span>
                            <ul className="body-1">
                                {generalFaq.map((item) => (
                                    <li key={item}>
                                        <a href="#">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                        <Col className="col justify-content-start p-4" lg={5} sm={12} xs={12}>
                            <span className="titulo-sin-margen">
                                <h3 className="headline-l">Servicio al Cliente</h3>
                            </span>
                            <p className="body-1">
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
                            <p className="p-description">
                                RESUELVE TUS DUDAS
                                <br />
                                COMUNÍCATE CON
                                <br />
                                UN ASESOR <ChatIcon className="ms-1" />
                            </p>
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
                </Row>
            </Container>
        </>
    )
}
