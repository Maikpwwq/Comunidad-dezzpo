export { Page }

// Pagina de nuestros patrocinadores
import React from 'react'
import '#@/assets/css/patrocinadores.css'
import LogoBictia from '/assets/img/LogoBictia.png'
import LogoMisionTic2022 from '/assets/img/LogoMisionTic2022.png'
import LogoTecnoparque from '/assets/img/LogoTecnoparque.png'

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
                    <Col className="col-10 align-items-start">
                        <div className="patrocinadoresMensaje">
                            <span className="tituloDocumento">
                                <h2 className="headline-xl">
                                    Estos son algunos de <br /> nuestros
                                    patrocinadores
                                </h2>
                            </span>
                            <ul className="p-description flex-row align-items-center">
                                <li>
                                    <a
                                        href="https://redtecnoparque.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={LogoTecnoparque}
                                            alt="Sena / Red Tecnoparque"
                                            height="93px"
                                            className="my-3"
                                        />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://talentodigital.mintic.gov.co/734/w3-article-159508.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={LogoMisionTic2022}
                                            alt="Logo Mintic / MisionTic2022"
                                            height="84px"
                                            className="my-3"
                                        />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://bictia.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={LogoBictia}
                                            alt="Logo Casa Bictia"
                                            height="48px"
                                            className="ms-5 my-3"
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
