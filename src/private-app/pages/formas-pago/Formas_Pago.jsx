// Pagina de Usuario - FormasPago
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const FormasPago = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100">
                    <Col className="col-10 d-flex align-items-start justify-content-between">
                        <Row className="p-4" md={10}>
                            <span>
                                <h2 className="headline-xl">Formas de Pago</h2>{' '}
                            </span>
                            <label for="addMetodoPago">
                                Adicionar Forma de Pago
                            </label>
                            <select name="addMetodoPago" id="addMetodoPago">
                                <option value="Tarjetas">
                                    Tarjeta Debito o Credito
                                </option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Baloto">Vía Baloto</option>
                                <option value="Efecty">Efecty</option>
                            </select>
                        </Row>
                        <Row className="p-4" md={10}>
                            <span>
                                <h2 className="headline-xl">Tickets de pago</h2>{' '}
                            </span>
                            <Col className="col-10 p-4">
                                <table>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Orden de Servicios</th>
                                        <th>Vigencia</th>
                                        <th>Estado</th>
                                        <th>Pagar en linea</th>
                                        <th>Descargar</th>
                                    </tr>
                                    <tr>
                                        <td>DATA...</td>
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

export default FormasPago
