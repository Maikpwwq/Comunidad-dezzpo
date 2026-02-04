/**
 * Profesionales Servicios Page
 *
 * Converted to TypeScript.
 */
// Styles
// Components
import { NuestraComunidad, CategoriasServicios } from '@features/marketing'
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
export default function Page() {
    return (
        <>
            <Container fluid className="services-page p-0">
                <Row className="profesionales-servicios-mensaje m-0 d-flex flex-row justify-content-end">
                    <Col
                        className="d-flex flex-col justify-content-end align-items-end"
                        xl={4}
                        lg={6}
                        md={8}
                        sm={10}
                        xs={12}
                    >
                        <Col className="opacidad-negro p-4 m-0 center">
                            <h1 className="type-hero-title text-blanco">
                                Profesionales y Servicios Recuerda
                            </h1>
                            <p className="body-1">
                                Los Certificados describen las acreditaciones que ha recibido cada
                                comerciante calificado, estos se pueden consultar junto al perfil,
                                además podrás consultar las fotos de sus anteriores trabajos, las
                                calificaciones y comentarios de otros Propietarios
                            </p>
                            <span className="p-description text-blanco">
                                Busca Profesionales en tu zona
                            </span>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <CategoriasServicios />
            <NuestraComunidad />
        </>
    )
}
