/**
 * Presupuestos Page
 *
 * Converted to TypeScript.
 */
// Styles
// Components
import { ProjectSearchForm } from '@features/projects'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
export default function Page() {
    return (
        <div className="budgets-page">
            <Container fluid className="p-0">
                <Row className="presupuestos-mensaje">
                    <Col className="align-items-end" lg={4} md={6} sm={10}>
                        <Col className="opacidad-negro text-blanco">
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
                <Row className="presupuestos-mensaje-buscador align-items-start p-4">
                    <Col className="m-0" lg={4} md={8} sm={8} xs={10}>
                        <p className="p-description text-blanco">
                            Publica tu proyecto gratis, los profesionales disponibles te
                            contactarán para ofrecer su presupuesto
                        </p>
                        <p className="body-2 text-blanco">
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
                        <ProjectSearchForm simple={false} />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
