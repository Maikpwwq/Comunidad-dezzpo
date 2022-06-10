// Pagina de Contactenos
import React from 'react'
import '../../../../public/assets/css/contactenos.css'

// Imagenes
import ContactenosFranja from '../../../../public/assets/img/ContactenosFranja.png'
import LogoPNG from '../../../../public/assets/img/LogoPNG.png'
import SelectorContactenos from '../../../../public/assets/img/SelectorContactenos.png'

//
import DatosContacto from '../../components/datos_contacto/DatosContacto'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Contactenos = (props) => {
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
                                    name="message"
                                    id="message"
                                    cols="30"
                                    rows="10"
                                    required
                                >
                                    mensaje:
                                </textarea>
                                <br />
                                <button>ENVIAR</button>
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

export default Contactenos
