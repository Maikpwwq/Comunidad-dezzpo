export { Page }

// Pagina de nuestros patrocinadores
import React from 'react'
import '#@/assets/css/patrocinadores.css'

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Page = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="containerPatrocinadores">
                    <Col className="col-10">
                        <div className="patrocinadoresMensaje">
                            <span className="tituloDocumento">
                                <h2 className="headline-xl">
                                    Estos son algunos de nuestros patrocinadores
                                </h2>
                            </span>
                            <ul className="p-description">
                                <li>Bictia</li>
                                <li>Mintic / MisionTic2022</li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
