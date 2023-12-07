// Pagina de Blog
import React from 'react'
import '#@/assets/css/blog.css'
import Link from '#R/Link'

// Imagenes
import BlogEntrada1 from '#@/assets/img/BlogEntrada1.png'
import User1 from '#@/assets/img/iconos/User1.svg'
import BlogEntrada2 from '#@/assets/img/BlogEntrada2.png'
import User2 from '#@/assets/img/iconos/User2.svg'
import BlogEntrada3 from '#@/assets/img/BlogEntrada3.png'
import User3 from '#@/assets/img/iconos/User3.svg'

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Page = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="blogTitulo m-0 w-100">
                    <Col>
                        <h2 className="headline-xl textBlanco">BLOG</h2>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="testimonioPropietarios m-0 w-100">
                    <Col className="mt-4 mb-4">
                        <Col className="">
                            <h3 className="headline-l">
                                Testimonios de Propietarios
                            </h3>
                        </Col>
                        <Container fluid className="p-0">
                            <Row className="">
                                <Col>
                                    <span> usuario: </span>
                                    <div>
                                        <img
                                            src={User1}
                                            alt="ImagenPerfil"
                                            height="130px"
                                            width="130px"
                                        />
                                    </div>
                                    <span> ACREDITADO </span>
                                </Col>
                                <Col>
                                    <p className="body-1">
                                        No encontraba en quien depositar mi
                                        confianza, la restauracion de mis
                                        muebles es una realidad y estoy feliz
                                    </p>
                                </Col>
                                <Col>
                                    <img
                                        src={BlogEntrada1}
                                        alt="ImagenServicio"
                                        height="170px"
                                        width="330px"
                                    />
                                </Col>
                            </Row>
                        </Container>
                        <Container fluid className="p-0">
                            <Row className="">
                                <Col>
                                    <span> usuario: </span>
                                    <div>
                                        <img
                                            src={User2}
                                            alt="ImagenPerfil"
                                            height="130px"
                                            width="130px"
                                        />
                                    </div>
                                    <span> ACREDITADO </span>
                                </Col>
                                <Col>
                                    <p className="body-1">
                                        La familia se crecio y la casa esta
                                        nuevamente llena de vida, contratar la
                                        ampliación de los espacios fue algo muy
                                        sencillo
                                    </p>
                                </Col>
                                <Col>
                                    <img
                                        src={BlogEntrada2}
                                        alt="ImagenServicio"
                                        height="170px"
                                        width="330px"
                                    />
                                </Col>
                            </Row>
                        </Container>
                        <Container fluid className="p-0">
                            <Row className="">
                                <Col>
                                    <span> usuario: </span>
                                    <div>
                                        <img
                                            src={User3}
                                            alt="ImagenPerfil"
                                            height="130px"
                                            width="130px"
                                        />
                                    </div>
                                    <span> ACREDITADO </span>
                                </Col>
                                <Col>
                                    <p className="body-1">
                                        Pasaron años antes de que me decidiera,
                                        ahora los problemas de humedad ya son
                                        cosas del pasado
                                    </p>
                                </Col>
                                <Col>
                                    <img
                                        src={BlogEntrada3}
                                        alt="ImagenServicio"
                                        height="170px"
                                        width="330px"
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Page