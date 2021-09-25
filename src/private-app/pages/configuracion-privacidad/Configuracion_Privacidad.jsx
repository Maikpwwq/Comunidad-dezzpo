// Pagina de Usuario - ConfiguracionPrivacidad
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const ConfiguracionPrivacidad = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Col className="m-0 w-100 d-flex align-items-start justify-content-start">
                    <h2>Configuracion de privacidad</h2>
                    <Row md={10}>
                        <div>
                            <table>
                                <tr>
                                    <th>Configuracion</th>
                                    <th>Privacidad</th>
                                    <th>Editar</th>
                                </tr>
                                <tr>
                                    <td>
                                        Quien puede ver las publicaciones de tu
                                        perfil{' '}
                                    </td>
                                    <td>Publico</td>
                                    <td>
                                        <button>Editar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Quien puede responder a tus solicitudes{' '}
                                    </td>
                                    <td>Publico</td>
                                    <td>
                                        <button>Editar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Quien puede ver tu lista de amigos </td>
                                    <td>Publico</td>
                                    <td>
                                        <button>Editar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Quien puede buscarte con el numero de
                                        telefono que proporcionaste{' '}
                                    </td>
                                    <td>Publico</td>
                                    <td>
                                        <button>Editar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Quien puede buscarte con el correo
                                        electronico que proporcionaste{' '}
                                    </td>
                                    <td>Publico</td>
                                    <td>
                                        <button>Editar</button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default ConfiguracionPrivacidad
