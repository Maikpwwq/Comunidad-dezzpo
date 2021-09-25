// Pagina de Usuario - Biblioteca
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Biblioteca = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Col className="m-0 w-100 d-flex align-items-start justify-content-start">
                    <Row md={10}>
                        <span>
                            <h2>Descargar documentos</h2>
                        </span>
                        <p>
                            Encuentra aqui, plantillas para redactar tus
                            documentos, material de consulta, enlaces utiles y
                            más.
                        </p>
                        <p>
                            Al ejecutar un nuevo proyecto siempre edite e
                            imprima prímero los documentos anexos, como lo son
                            cotizaciones y contratos{' '}
                        </p>
                    </Row>
                    <Row md={10}>
                        <div>
                            <table>
                                <tr>
                                    <th>Titulo</th>
                                    <th>Descargar</th>
                                </tr>
                                <tr>
                                    <td>CONTRATO DE ADQUISICION DE SERVICIO</td>
                                    <td>Pdf</td>
                                </tr>
                                <tr>
                                    <td>
                                        FORMATO DE REQUERIMIENTOS DEL CLIENTE{' '}
                                    </td>
                                    <td>Pdf</td>
                                </tr>
                                <tr>
                                    <td>FORMATO DE COTIZACIÓN DE SERVICIOS </td>
                                    <td>Publico</td>
                                    <td>Pdf</td>
                                </tr>
                            </table>
                        </div>
                    </Row>
                    <Row md={10}>
                        <span>
                            <h2>Material de consulta</h2>
                        </span>
                        <div>
                            <table>
                                <tr>
                                    <th>Titulo</th>
                                    <th>Descargar</th>
                                </tr>
                                <tr>
                                    <td>
                                        Patologías y sistemas de mantenimiento
                                        en los inmuebles
                                    </td>
                                    <td>Pdf</td>
                                </tr>
                                <tr>
                                    <td>
                                        MANUAL DE PROCEDIMIENTOS DE
                                        MANTENIMIENTO CORRECTIVO Y PREVENTIVO{' '}
                                    </td>
                                    <td>Pdf</td>
                                </tr>
                                <tr>
                                    <td>
                                        Reglamentaciones del Sistema de salud y
                                        seguridad en el trabajo{' '}
                                    </td>
                                    <td>Publico</td>
                                    <td>Pdf</td>
                                </tr>
                            </table>
                        </div>
                    </Row>
                    <Row md={10}>
                        <span>
                            <h2>Canal de youtube</h2>
                        </span>
                        <p>
                            Hemos recopilado unas listas de videos, las cuales
                            pueden ser de gran utilidad, para especificar los
                            detalles y acabados del servicio
                        </p>
                    </Row>
                    <Row md={10}>
                        <span>
                            <h2> Libreta de direcciones </h2>
                        </span>
                        <span>Tiendas</span>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default Biblioteca
