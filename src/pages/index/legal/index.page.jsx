// Pagina de Legal
import React from 'react'
import '#@/assets/css/legal.css'

// react-bootrstrap
import { Row, Col, Container } from 'react-bootstrap'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Container from 'react-bootstrap/Container'

export { Legal }

const Legal = () => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="legalContainer">
                    <Col className="m-4">
                        <h3 className="headline-l textBlanco">
                            Terminos y condiciones
                            <br /> Propietarios
                        </h3>
                        <br />
                        <a
                            href="http://www.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            .PDF
                        </a>
                    </Col>
                    <Col className="m-4">
                        <h3 className="headline-l textBlanco">
                            Terminos y condiciones
                            <br /> Comercientes Calificados{' '}
                        </h3>
                        <br />
                        <a
                            href="http://www.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            .PDF
                        </a>
                    </Col>
                    <Col className="m-4">
                        <h3 className="headline-l textBlanco">
                            Terminos de uso
                        </h3>
                        <br />
                        <a
                            href="http://www.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            .PDF
                        </a>
                    </Col>
                    <Col className="m-4">
                        <h3 className="headline-l textBlanco">
                            Politica de privacidad
                        </h3>
                        <br />
                        <a
                            href="http://www.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            .PDF
                        </a>
                    </Col>
                    <Col className="m-4">
                        <h3 className="headline-l textBlanco">Cookies</h3>
                        <br />
                        <a
                            href="http://www.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            .PDF
                        </a>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
