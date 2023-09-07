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
                                <li><a href="https://bictia.com/" target="_blank"
                            rel="noopener noreferrer">
                                Bictia
                                    </a></li>
                                <li><a href="https://talentodigital.mintic.gov.co/734/w3-article-159508.html" target="_blank"
                            rel="noopener noreferrer">
                                Mintic / MisionTic2022
                                    </a></li>
                                <li><a href="https://redtecnoparque.com/" target="_blank"
                            rel="noopener noreferrer">
                                Sena / Red Tecnoparque
                                    </a></li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
