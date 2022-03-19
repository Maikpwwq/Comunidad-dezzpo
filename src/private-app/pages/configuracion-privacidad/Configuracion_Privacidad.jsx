// Pagina de Usuario - ConfiguracionPrivacidad
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'

const ConfiguracionPrivacidad = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="p-4">
                    <Col className="m-0 w-100 d-flex align-items-start justify-content-start">
                        <h2 className="headline-xl">
                            Configuracion de privacidad
                        </h2>
                        <Row md={10}>
                            <Col className="col-10 p-4">
                                <table>
                                    <tr>
                                        <th>Configuracion</th>
                                        <th>Privacidad</th>
                                        <th>Editar</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            Quien puede ver las publicaciones de
                                            tu perfil{' '}
                                        </td>
                                        <td>Publico</td>
                                        <td>
                                            <Button>Editar</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Quien puede responder a tus
                                            solicitudes{' '}
                                        </td>
                                        <td>Publico</td>
                                        <td>
                                            <Button>Editar</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Quien puede ver tu lista de amigos{' '}
                                        </td>
                                        <td>Publico</td>
                                        <td>
                                            <Button>Editar</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Quien puede buscarte con el numero
                                            de telefono que proporcionaste{' '}
                                        </td>
                                        <td>Publico</td>
                                        <td>
                                            <Button>Editar</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Quien puede buscarte con el correo
                                            electronico que proporcionaste{' '}
                                        </td>
                                        <td>Publico</td>
                                        <td>
                                            <Button>Editar</Button>
                                        </td>
                                    </tr>
                                </table>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ConfiguracionPrivacidad
