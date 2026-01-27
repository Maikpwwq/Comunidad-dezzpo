/**
 * Presupuestos Page
 *
 * Converted to TypeScript.
 */
// Styles
import '@assets/css/presupuestos.css'
// Components
import BuscadorNuevoProyecto from '@index/components/buscador/BuscadorNuevoProyecto'
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
export default function Page() {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="presupuestosMensaje">
                    <Col className="align-items-end" lg={4} md={6} sm={10}>
                        <Col className="opacidadNegro textBlanco">
                            <p className="p-description">
                                Solicítalo online, en menos tiempo, totalmente gratuito y sin
                                compromiso.
                            </p>
                            <p className="body-1">
                                Contamos con los mejores precios del mercado de reformas, conocer
                                el costo que tiene desarrollar tu proyecto ahora, y procede a
                                elegir el que te brinde más confianza, mayor calidad, y el mejor
                                costo
                            </p>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="presupuestosMensajeBuscador align-items-start p-4">
                    <Col className="m-0" lg={4} md={8} sm={8} xs={10}>
                        <p className="p-description textBlanco">
                            Publica tu proyecto gratis, los profesionales disponibles te
                            contactarán para ofrecer su presupuesto
                        </p>
                        <p className="body-2 textBlanco">
                            Anuncia gratuitamente un trabajo.
                            <br />
                            Lee comentarios, recibe cotizaciones y sigue las recomendaciones
                            para contratar.
                        </p>
                    </Col>
                    <Col
                        className="col m-4 p-0"
                        xl={4}
                        lg={6}
                        md={8}
                        sm={12}
                        xs={12}
                    >
                        <BuscadorNuevoProyecto />
                    </Col>
                </Row>
            </Container>
        </>
    )
}
