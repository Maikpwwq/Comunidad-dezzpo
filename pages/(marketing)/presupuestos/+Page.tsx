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
                <Row className="presupuestos-mensaje d-flex align-items-center" style={{ minHeight: '500px' }}>
                    <Col className="p-lg-5 p-4" lg={6} md={8} sm={12}>
                        <div className="opacidad-negro p-4 rounded-3 text-blanco">
                            <h2 className="headline-xl mb-4 text-blanco">
                                Solicítalo online, en menos tiempo, totalmente gratuito y sin compromiso.
                            </h2>
                            <p className="body-1 text-blanco">
                                Contamos con los mejores precios del mercado de reformas, conoce
                                el costo que tiene desarrollar tu proyecto ahora, y procede a
                                elegir el que te brinde más confianza, mayor calidad, y el mejor
                                costo.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="presupuestos-mensaje-buscador align-items-center p-lg-5 p-4">
                    <Col className="mb-4" lg={6} md={12}>
                        <div className="opacidad-negro p-4 rounded-3">
                            <h2 className="headline-l text-blanco mb-3">
                                Publica tu proyecto gratis, los profesionales disponibles te
                                contactarán para ofrecer su presupuesto
                            </h2>
                            <p className="body-1 text-blanco m-0">
                                Anuncia gratuitamente un trabajo.
                                <br />
                                Lee comentarios, recibe cotizaciones y sigue las recomendaciones
                                para contratar.
                            </p>
                        </div>
                    </Col>
                    <Col lg={6} md={12} className="d-flex justify-content-center">
                        <div className="w-100" style={{ maxWidth: '600px' }}>
                            <ProjectSearchForm simple={false} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
