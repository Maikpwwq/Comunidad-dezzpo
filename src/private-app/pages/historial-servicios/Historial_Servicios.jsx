// Pagina de Usuario - HistorialServicios
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const HistorialServicios = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start">
                    <Col md={10}>
                        <h2> Proyectos Publicados</h2>
                        <div>
                            <table>
                                <tr>
                                    <th>imagenes</th>
                                    <th>Descripción</th>
                                    <th>fecha de publicación</th>
                                    <th>valor aproximado</th>
                                    <th>Ubicación</th>
                                </tr>
                                <tr>
                                    <td>DATA...</td>
                                </tr>
                            </table>
                        </div>
                        <h2>Proyectos cerrados</h2>
                        <div>
                            <table>
                                <tr>
                                    <th>imagenes</th>
                                    <th>Descripción</th>
                                    <th>fecha de publicación</th>
                                    <th>valor aproximado</th>
                                    <th>Ubicación</th>
                                    <th>Postular</th>
                                </tr>
                                <tr>
                                    <td>DATA...</td>
                                </tr>
                            </table>
                        </div>
                        <h2>Requerimientos guardados</h2>
                        <div>
                            <table>
                                <tr>
                                    <th>imagenes</th>
                                    <th>Descripción</th>
                                    <th>fecha de publicación</th>
                                    <th>valor aproximado</th>
                                    <th>Ubicación</th>
                                </tr>
                                <tr>
                                    <td>DATA...</td>
                                </tr>
                            </table>
                        </div>
                        <h2>Requerimientos solicitados</h2>
                        <div>
                            <table>
                                <tr>
                                    <th>imagenes</th>
                                    <th>Descripción</th>
                                    <th>fecha de publicación</th>
                                    <th>valor aproximado</th>
                                    <th>Ubicación</th>
                                </tr>
                                <tr>
                                    <td>DATA...</td>
                                </tr>
                            </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default HistorialServicios
