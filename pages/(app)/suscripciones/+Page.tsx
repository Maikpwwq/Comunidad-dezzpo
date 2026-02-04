/**
 * Suscripciones Page
 * 
 * Displays subscription benefits for Owners and Merchants.
 * Migrated from src/app/pages/suscripciones/+Page.jsx
 */
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// MUI
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
const beneficiosPropietarios = [
    { title: 'Servicio 24 horas para urgencias' },
    { title: 'Todos los servicios disponibles' },
    { title: 'Prioridad al solicitar presupuestos' },
    { title: 'Garantia anti fraude' },
]
const beneficiosComerciantes = [
    { title: 'Ficha personalizado del perfil, con proyectos, opiniones, fotos...' },
    { title: 'Obten todos los detalles de contacto y observa todos los requerimientos en el area donde quieres trabajar' },
    { title: 'Avisos instantaneos por email de nuevas solicitudes' },
    { title: 'Diseñamos, construimos y comercializamos tu marca en Internet, Posicionate en Google y aparece arriba del motor de busquedas, nosotros creamos los anuncios así que no tendras que hacerlo' },
    { title: 'Credito mensual para publicitar tu perfil publico' },
    { title: 'Nesletter con consejos practicos para impulsar el exito de tu negocio' },
    { title: 'Descuentos premium para que reduzcas los gastos de tu negocio, ferreterias, restaurantes, online, sobre la marcha.' },
    { title: 'Guias de costeo de servicios para que tu presupuesto sea más que el indicado, estas te dejaran conocer los costos basicos y las variables que pueden influir en tu cotización' },
    { title: 'Pronto diponible para descarga nuestra aplicacion, para que siempre estes conectado con la comunidad' },
]
export default function Page() {
    return (
        <Container fluid className="p-0">
            <Row>
                <Col className="col-10">
                    <Row className="pt-4 m-0 w-100 d-flex">
                        <h1 className="type-hero-title mb-5">
                            El plan de beneficios con la membresía incluye
                        </h1>
                        <Col md={8}>
                            <Typography
                                variant="h4"
                                className="p-description"
                            >
                                Como Propietario{' '}
                            </Typography>
                            <span className="subtitle">
                                Adquiere nuestro servicio de afiliacion +
                                plus
                            </span>
                            <ul className="body-1">
                                {beneficiosPropietarios.map(
                                    (item, index) => {
                                        const { title } = item
                                        return <li className="body-1" key={index}>{title}</li>
                                    }
                                )}
                            </ul>
                        </Col>
                        <Col md={4}>
                            <Button>
                                <a
                                    className="chat-with-us body-1"
                                    href="https://wa.me/573204842897?text=Hola%20estoy%20interesado%20en%20saber%20acerca%20de%20como%20Dezzpo%20..."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    SOLICITAR
                                </a>
                            </Button>
                        </Col>
                    </Row>
                    <Row className="m-0 pt-4 w-100 d-flex">
                        <Col md={8}>
                            <Typography
                                variant="h4"
                                className="p-description"
                            >
                                Como Comerciante Calificado{' '}
                            </Typography>
                            <span className="subtitle">
                                Adquiere Un Membresia Pagada
                            </span>
                            <ul className="body-1">
                                {beneficiosComerciantes.map(
                                    (item, index) => {
                                        const { title } = item
                                        return <li className="body-1" key={index}>{title}</li>
                                    }
                                )}
                            </ul>
                        </Col>
                        <Col md={4}>
                            <Button>
                                <a
                                    className="chat-with-us body-1"
                                    href="https://wa.me/573204842897?text=Hola%20estoy%20interesado%20en%20saber%20acerca%20de%20como%20Dezzpo%20..."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    SOLICITAR
                                </a>
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
