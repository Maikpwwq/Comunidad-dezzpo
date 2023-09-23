export { Page }
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - Suscripciones
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const Page = () => {
    return (
        <>
            <Container fluid className="p-0">
                <Row>
                    <Col className="col-10">
                        <Row className="pt-4 m-0 w-100 d-flex">
                            <h2 className="headline-xl mb-5">
                                El plan de beneficios con la membresía incluye
                            </h2>
                            <Col md={8}>
                                <Typography
                                    variant="h3"
                                    className="p-description"
                                >
                                    Como Propietario{' '}
                                </Typography>
                                <span className="subtitle">
                                    Adquiere nuestro servicio de afiliacion +
                                    plus
                                </span>
                                <ul className="body-1">
                                    <li>Servicio 24 horas para urgencias</li>
                                    <li>Todos los servicios disponibles</li>
                                    <li>Prioridad al solicitar presupuestos</li>
                                    <li>Garantia anti fraude</li>
                                </ul>
                            </Col>
                            <Col md={4}>
                                <Button>
                                    <a
                                        className="chat-with-us body-1"
                                        href="https://api.whatsapp.com/send?phone=573196138057"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        SOLICITAR
                                    </a>
                                </Button>
                            </Col>
                        </Row>

                        <Row className="m-0 pt-4 w-100 d-flex">
                            <Col md={8}>
                                <Typography
                                    variant="h3"
                                    className="p-description"
                                >
                                    Como Comerciante Calificado{' '}
                                </Typography>
                                <span className="subtitle">
                                    Adquiere Un Membresia Pagada
                                </span>
                                <ul className="body-1">
                                    <li>
                                        Ficha personalizado del perfil, con
                                        proyectos, opiniones, fotos...
                                    </li>
                                    <li>
                                        Obten todos los detalles de contacto y
                                        observa todos los requerimientos en el
                                        area donde quieres trabajar
                                    </li>
                                    <li>
                                        Avisos instantaneos por email de nuevas
                                        solicitudes
                                    </li>
                                    <li>
                                        Diseñamos, construimos y comercializamos
                                        tu marca en Internet, Posicionate en
                                        Google y aparece arriba del motor de
                                        busquedas, nosotros creamos los anuncios
                                        así que no tendras que hacerlo
                                    </li>
                                    <li>
                                        Credito mensual para publicitar tu
                                        perfil publico
                                    </li>
                                    <li>
                                        Nesletter con consejos practicos para
                                        impulsar el exito de tu negocio
                                    </li>
                                    <li>
                                        Descuentos premium para que reduzcas los
                                        gastos de tu negocio, ferreterias,
                                        restaurantes, online, sobre la marcha.
                                    </li>
                                    <li>
                                        Guias de costeo de servicios para que tu
                                        presupuesto sea más que el indicado,
                                        estas te dejaran conocer los costos
                                        basicos y las variables que pueden
                                        influir en tu cotización
                                    </li>
                                    <li>
                                        Pronto diponible para descarga nuestra
                                        aplicacion, para que siempre estes
                                        conectado con la comunidad
                                    </li>
                                </ul>
                            </Col>
                            <Col md={4}>
                                <Button>
                                    <a
                                        className="chat-with-us body-1"
                                        href="https://api.whatsapp.com/send?phone=573196138057"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        SOLICITAR
                                    </a>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
