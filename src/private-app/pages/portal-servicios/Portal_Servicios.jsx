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
                    <h2>Obtener o Aplicar con Cotizaciones</h2>
                    <Col>
                        Publica un proyecto gratis{' '}
                        <p>
                            Busqueda Local Servicios: Buscar comerciantes
                            Calificados
                        </p>
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
                            </tr>
                        </table>
                    </Col>
                </Row>
                <Row className="m-0 w-100 d-flex">
                    <Col>
                        Aplica a un Proyecto Gratis
                        <p>Buscar Requerimientos</p>
                        <span>
                            <h2>Proyectos activos</h2>
                        </span>
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
                            </tr>
                        </table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Portal_Servicios
