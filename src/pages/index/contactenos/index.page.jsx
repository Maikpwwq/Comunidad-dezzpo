export { Page }

// Pagina de Contactenos
import React from 'react'
import '#@/assets/css/contactenos.css'

// Imagenes
import ContactenosFranja from '#@/assets/img/ContactenosFranja.png'
import LogoPNG from '#@/assets/img/LogoPNG.png'
import SelectorContactenos from '#@/assets/img/SelectorContactenos.png'

import { DatosContacto } from '#P/index/components/datos_contacto/DatosContacto'

// react-bootrstrap
// import { Row, Col, Container, Button } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const Page = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="m-0 w-100">
                    <Col className="m-4">
                        <h2 className="mainTitulo headline-xl textVerde">
                            {' '}
                            CONTÁCTENOS{' '}
                        </h2>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="contactenosMensaje row m-0 w-100">
                    <Col className="" lg={4} md={6} sm={10}>
                        <img
                            src={ContactenosFranja}
                            alt="fondo comunidad dezzpo"
                        />
                        <img src={LogoPNG} alt="Logo Comunidad Dezzpo" />
                    </Col>
                    <Col className="" lg={4} md={6} sm={10}>
                        <div className="formContacto">
                            <form action="">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="nombre:"
                                    required
                                />
                                <br />
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    placeholder="Email:"
                                    required
                                />
                                <br />
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    placeholder="telefono:"
                                    required
                                />
                                <br />
                                <textarea
                                    className="mb-4"
                                    name="message"
                                    id="message"
                                    cols="30"
                                    rows="6"
                                    required
                                >
                                    mensaje:
                                </textarea>
                                <br />
                                <br />
                                <Button className="btn-main btn-round btn-high body-1">
                                    ENVIAR
                                </Button>
                            </form>
                        </div>
                    </Col>
                    <Col className="" lg={4} md={6} sm={10}>
                        <div className="borderBlue">
                            <img
                                src={SelectorContactenos}
                                alt="datos de contacto"
                            />
                            {/* Datos de contacto comunidad dezzpo */}
                            <DatosContacto></DatosContacto>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
