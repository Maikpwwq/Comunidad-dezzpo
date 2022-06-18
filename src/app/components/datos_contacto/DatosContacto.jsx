/* Footer de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react'
import '../../../../public/assets/css/datos_contacto.css'
import { Link, Redirect } from 'react-router-dom'
import IcoMoon from 'react-icomoon'
import iconSet from '../../../../public/assets/css/icomoon/selection.json'
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
                    <ul className="listaContacto pt-3 w-100 align-items-end">
                        <Row className="border-top m-0 w-100 d-flex pt-2 pb-2">
                            <IcoMoon
                                iconSet={iconSet}
                                icon="TelefonoContactoIcono"
                                style={{
                                    height: '21px',
                                    marginRight: '8px',
                                    width: 'auto',
                                }}
                            />
                            <Col className="m-0 p-0 body-1 align-items-end">
                                <li>
                                    {' '}
                                    +57{' '}
                                    <a
                                        className="chat-with-us body-1"
                                        href="https://api.whatsapp.com/send?phone=573196138057"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        3196138057
                                    </a>{' '}
                                    - Office{' '}
                                </li>
                                {/* <li> +57 3196138057 - PBX </li> */}
                            </Col>
                        </Row>
                        <Row className="border-top m-0 w-100 d-flex pt-2 pb-2">
                            <IcoMoon
                                iconSet={iconSet}
                                icon="DireccionDomicilioIcono"
                                style={{
                                    height: '21px',
                                    marginRight: '8px',
                                    width: 'auto',
                                }}
                            />
                            <Col className="m-0 p-0 body-1 align-items-end">
                                <li> Dirección Cll 159 No. 8c-45 </li>
                                <li> Piso 5 </li>
                            </Col>
                        </Row>
                        <Row className="border-top m-0 w-100 d-flex pt-2">
                            <Col className="m-0 p-0 pt-2 pb-2 body-1 align-items-end">
                                <li>
                                    <IcoMoon
                                        iconSet={iconSet}
                                        icon="EmailIcono"
                                        style={{
                                            height: '21px',
                                            marginRight: '8px',
                                            width: 'auto',
                                        }}
                                    />
                                    <a
                                        className="chat-with-us"
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