// Pagina de Prensa
import React from 'react'
import '@/assets/css/prensa.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Prensa = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="pageContainer">
                    <Col className="prensaMensaje">
                        <span className="tituloDocumento">
                            {' '}
                            <h3 className="headline-l">
                                Consulta por titulo de documento
                            </h3>{' '}
                        </span>
                        <ul className="body-2">
                            <li>Estudios</li>
                            <li>Estudios</li>
                            <li>Estudios</li>
                            <li>Estudios</li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Prensa
