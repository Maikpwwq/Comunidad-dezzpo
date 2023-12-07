import * as React from 'react'
import './busca_en_tu_ciudad.css'

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import LocalCiudades from '#@/assets/img/LocalCiudades.png'

const BuscaEnTuCiudad = () => {
    return (
        <>
            <Container fluid className="p-0">
                {/* seccion de comerciantes Locales*/}
                <Row id="comerciantesLocales" className="p-4 m-0">
                    <Col className="col-12">
                        <h2 className="headline-xl textBlanco">
                            Busca en tu ciudad comerciantes calificados
                        </h2>
                        <Row className="ciudades p-0 col-12">
                            <Col className="" md={3} sm={12}>
                                <ul className="body-2 align-items-center">
                                    <li>Bogota</li>
                                    <li>Medellin</li>
                                    <li>Cali</li>
                                </ul>
                            </Col>
                            <Col className="" md={3} sm={12}>
                                <ul className="body-2 align-items-center">
                                    <li>Villavicencio</li>
                                    <li>Chia</li>
                                    <li>Cota</li>
                                </ul>
                            </Col>
                            <Col className="" md={3} sm={12}>
                                <ul className="body-2 align-items-center">
                                    <li>Funza</li>
                                    <li>Mosquera</li>
                                    <li>Zipaquira</li>
                                </ul>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="" lg={6} md={6} sm={12}>
                        <img
                            src={LocalCiudades}
                            alt="Busca Comerciantes Locales"
                            height="auto"
                            width="100%"
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default BuscaEnTuCiudad
