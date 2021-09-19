// Pagina de Blog
import React from 'react'
import '../../../../public/assets/css/blog.css'
import { Link } from 'react-router-dom'

// Imagenes
import BlogEntrada1 from '../../../../public/assets/img/BlogEntrada1.png'
import User1 from '../../../../public/assets/img/iconos/User1.svg'
import BlogEntrada2 from '../../../../public/assets/img/BlogEntrada2.png'
import User2 from '../../../../public/assets/img/iconos/User2.svg'
import BlogEntrada3 from '../../../../public/assets/img/BlogEntrada3.png'
import User3 from '../../../../public/assets/img/iconos/User3.svg'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Blog = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="blogTitulo m-0 w-100">
                    <Col>
                        <span className="mainTitulo">
                            {' '}
                            <h1>BLOG</h1>{' '}
                        </span>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="testimonioPropietarios m-0 w-100">
                    <Col className="mainCol">
                        <Col>
                            <span className="testimoniosTitulo">
                                <p>Testimonios de Propietarios</p>
                            </span>
                        </Col>
                        <Container fluid className="p-0">
                            <Row className="experienciasContainer">
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
                                    <p>
                                        No encontraba en quien depositar mi
                                        confianza, la restauracion <br />
                                        de mis muebles es una realidad y estoy
                                        feliz
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
                            <Row>
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
                                    <p>
                                        La familia se crecio y la casa esta
                                        nuevamente llena de vida, <br />
                                        contratar la ampliación de los espacios
                                        fue algo muy sencillo
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
                            <Row>
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
                                    {' '}
                                    <p>
                                        Pasaron años antes de que me decidiera,
                                        ahora los problemas <br />
                                        de humedad ya son cosas del pasado{' '}
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

export default Blog
