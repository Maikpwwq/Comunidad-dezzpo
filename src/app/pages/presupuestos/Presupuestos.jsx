// Pagina de Presupuestos
import React from 'react'
import '../../../../public/assets/css/presupuestos.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Presupuestos = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="presupuestosMensaje">
                    <Col className="col-md-4 align-items-end">
                        <Col className="opacidadNegro">
                            <span className="p-description">
                                {' '}
                                Solicitalo online, en menos tiempo, totalmente{' '}
                                <br />
                                gratuito y sin compromiso.{' '}
                            </span>
                            <span className="body-1">
                                Contamos con los mejores precios del mercado de
                                reformas, conocer el costo <br />
                                que tiene desarrollar tu proyecto ahora, y
                                procede a elegir el que te brinde <br />
                                más confianza, mayor calidad, y el mejor costo{' '}
                                <br />
                            </span>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="presupuestosMensajeBuscador row">
                    <Col className="col">
                        <span className="p-description">
                            Publica tu proyecto gratis, los profesionales
                            disponibles te <br />
                            contactaran para ofrecer su presupuesto
                        </span>
                        <p className="body-2">
                            Anuncia gratuitamente un trabajo. <br />
                            Lee comentarios, recibe cotizaciones y sigue las
                            recomendaciones para contratar.
                        </p>
                    </Col>
                    <Col className="col">se importa buscador del home</Col>
                </Row>
            </Container>
        </>
    )
}

export default Presupuestos
