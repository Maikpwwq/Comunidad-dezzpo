// Pagina de Presupuestos
import React from 'react'
import '../../../../public/assets/css/presupuestos.css'

import BuscadorNuevoProyecto from '../../components/buscador/BuscadorNuevoProyecto'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Presupuestos = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="presupuestosMensaje">
                    <Col className="align-items-end" lg={4} md={6} sm={10}>
                        <Col className="opacidadNegro textBlanco">
                            <p className="p-description">
                                {' '}
                                Solicitalo online, en menos tiempo, totalmente{' '}
                                gratuito y sin compromiso.{' '}
                            </p>
                            <p className="body-1">
                                Contamos con los mejores precios del mercado de
                                reformas, conocer el costo que tiene desarrollar
                                tu proyecto ahora, y procede a elegir el que te
                                brinde más confianza, mayor calidad, y el mejor
                                costo <br />
                            </p>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="presupuestosMensajeBuscador align-items-start justify-content-end">
                    <Col className="p-4 m-4" lg={4} md={6} sm={12}>
                        <p className="p-description textBlanco">
                            Publica tu proyecto gratis, los profesionales
                            disponibles te contactaran para ofrecer su
                            presupuesto
                        </p>
                        <p className="body-2 textBlanco">
                            Anuncia gratuitamente un trabajo. <br />
                            Lee comentarios, recibe cotizaciones y sigue las
                            recomendaciones para contratar.
                        </p>
                    </Col>
                    <Col className="" md={6} sm={12}>
                        <BuscadorNuevoProyecto></BuscadorNuevoProyecto>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Presupuestos
