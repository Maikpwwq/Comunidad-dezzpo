/* Footer de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react'
import '../../../../public/assets/css/datos_contacto.css'
import { Link, Redirect } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const DatosContacto = (props) => {
    return (
        <>
            <Col className="p-4">
                <Col className="datosContacto pt-0">
                    <h2 className="headline-xl textBlanco">
                        {' '}
                        Ponte en Contacto{' '}
                    </h2>
                    <ul className="listaFooter pt-3 w-100">
                        <Row className="m-0 w-100 d-flex">
                            <span
                                className="icon-DireccionDomicilioIcono"
                                style={{ width: 'auto' }}
                            ></span>
                            <Col className="m-0 p-0 body-1">
                                <li> Dirección Cll 159 No. 8c-45 </li>
                                <li> Piso 5 </li>
                            </Col>
                        </Row>
                        <Row className="m-0 w-100 d-flex">
                            <span
                                className="icon-TelefonoContactoIcono"
                                style={{ width: 'auto' }}
                            ></span>
                            <Col className="m-0 p-0 body-1">
                                <li> +57 3196138057 - Office </li>
                                <li> +57 3196138057 - PBX </li>
                            </Col>
                        </Row>
                        <Row className="m-0 w-100 d-flex">
                            <span
                                className="icon-EmailIcono"
                                style={{
                                    width: 'auto',
                                }}
                            ></span>
                            <Col className="m-0 p-0 body-1">
                                <li>
                                    <a
                                        href="mailto:comunidad.dezzpo@gmail.com"
                                        title="Correo Comunidad Dezzpo"
                                    >
                                        {' '}
                                        comunidad.dezzpo@gmail.com{' '}
                                    </a>
                                </li>
                            </Col>
                        </Row>
                    </ul>
                </Col>
            </Col>
        </>
    )
}

export default DatosContacto
