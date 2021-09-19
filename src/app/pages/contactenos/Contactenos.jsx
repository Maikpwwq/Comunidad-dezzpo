// Pagina de Contactenos
import React from 'react'
import '../../../../public/assets/css/iconmoon/style.css'
import '../../../../public/assets/css/contactenos.css'

// Imagenes
import ContactenosFranja from '../../../../public/assets/img/ContactenosFranja.png'
import LogoPNG from '../../../../public/assets/img/LogoPNG.png'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Contactenos = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="m-0 w-100">
                    <Col className="contactenosTitulo">
                        <span className="mainTitulo">
                            {' '}
                            <h1> CONTÁCTENOS </h1>
                        </span>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="contactenosMensaje row m-0 w-100">
                    <Col className="col">
                        <img
                            src={ContactenosFranja}
                            alt="fondo comunidad dezzpo"
                        />
                        <img src={LogoPNG} alt="Logo Comunidad Dezzpo" />
                    </Col>
                    <Col className="col">
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
                    <Col className="col">
                        <div className="borderBlue">
                            <img
                                src="assets/img/SelectorContactenos.png"
                                alt="datos de contacto"
                            />
                            {/*Datos de contacto comunidad dezzpo*/}
                            <div className="datosContacto">
                                <h1> Consultenos </h1>
                                <ul className="listaContacto">
                                    <span className="icon-DireccionDomicilioIcono"></span>
                                    <li> Dirección Cll 159 No. 8c-45 </li>
                                    <li> Piso 5 </li>
                                    <br />
                                    <span className="icon-TelefonoContactoIcono"></span>
                                    <li> +57 3196138057 - Office </li>
                                    <li> +57 3196138057 - PBX </li>
                                    <br />
                                    <span className="icon-EmailIcono"></span>
                                    <li>
                                        <a
                                            href="mailto:comunidad.dezzpo@gmail.com"
                                            title="Correo Comunidad Dezzpo"
                                        >
                                            {' '}
                                            comunidad.dezzpo@gmail.com{' '}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Contactenos
