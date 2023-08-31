export { Page }
// Pagina de Profesionales Servicios
import React from 'react'
import '#@/assets/css/profesionales_servicios.css'
import { NuestraComunidad } from '#@/index/components/nuestra-comunidad/NuestraComunidad'

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

// import { Link } from '#R/Link'

const Page = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="profesionalesServiciosMensaje m-0 d-flex flex-row justify-content-end">
                    <Col
                        className="d-flex flex-col justify-content-end align-items-end"
                        xl={4}
                        lg={6}
                        md={8}
                        sm={10}
                        xs={12}
                    >
                        <Col className="opacidadNegro p-4 m-0 center">
                            <h2 className="headline-xl textBlanco">
                                Profesionales y Servicios Recuerda
                            </h2>
                            <p className="body-1">
                                Los Certificados describen las acreditaciones
                                que ha recibido cada comerciante calificado,
                                estos se pueden consultar junto al perfil,
                                además podras consultar las fotos de sus
                                anteriores trabajos, las calificaciones y
                                comentarios de otros Propietarios
                            </p>
                            <span className="p-description textBlanco">
                                Busca Profesionales en tu zona
                            </span>
                        </Col>
                    </Col>
                </Row>
            </Container>
            {/* seccion de categorias y servicios */}
            <NuestraComunidad></NuestraComunidad>
        </>
    )
}
