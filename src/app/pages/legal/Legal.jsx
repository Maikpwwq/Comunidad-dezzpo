// Pagina de Legal
import React from 'react'
import '../../../../public/assets/css/legal.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Legal = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="legalContainer">
                    <div className="legalDocumentos row">
                        <div className="col">
                            <span className="tituloDocumento">
                                <h3 className="headline-l">
                                    Terminos y condiciones
                                    <br /> Propietarios
                                </h3>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                        <div className="col">
                            <span className="tituloDocumento">
                                <h3 className="headline-l">
                                    Terminos y condiciones
                                    <br /> Comercientes Calificados{' '}
                                </h3>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                        <div className="col">
                            <span className="tituloDocumento">
                                <h3 className="headline-l">Terminos de uso</h3>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                        <div className="col">
                            <span className="tituloDocumento">
                                <h3 className="headline-l">
                                    Politica de privacidad
                                </h3>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                        <div className="col">
                            <span className="tituloDocumento">
                                <h3 className="headline-l">Cookies</h3>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                    </div>
                </Row>
            </Container>
        </>
    )
}

export default Legal
