// Pagina de Usuario - Portal_Servicios
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Portal_Servicios = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex">
                    <Col className="col-10 p-4">
                        <h2 className="headline-xl">
                            Obtener o Aplicar con Cotizaciones
                        </h2>
                        <p className="body-2">Publica un proyecto gratis </p>
                        <p className="body-1">
                            Busqueda Local Servicios: Buscar comerciantes
                            Calificados
                        </p>
                        <Col className="col-10 p-4">
                            <table>
                                <tr>
                                    <th>Miembro</th>
                                    <th>Oferta de Servicios</th>
                                    <th>Certificaciones</th>
                                    <th>Calificaciones</th>
                                    <th>Se unio el</th>
                                    <th>Ubicación</th>
                                    <th>Contactar</th>
                                </tr>
                                <tr>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                </tr>
                            </table>
                        </Col>
                    </Col>
                </Row>
                <Row className="m-0 w-100 d-flex">
                    <Col className="p-4">
                        <span>
                            <h2 className="headline-xl">Proyectos activos</h2>
                        </span>
                        <p className="body-2">Aplica a un Proyecto Gratis </p>
                        <p className="body-1">Buscar Requerimientos</p>
                        <Col className="col-10 p-4">
                            <table>
                                <tr>
                                    <th>Imagenes</th>
                                    <th>Descripción</th>
                                    <th>Fecha de Publicación</th>
                                    <th>Valor Aproximado</th>
                                    <th>Se unio el</th>
                                    <th>Ubicación</th>
                                    <th>Postular</th>
                                </tr>
                                <tr>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                    <td>DATA...</td>
                                </tr>
                            </table>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Portal_Servicios
