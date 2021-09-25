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
                <Col className="m-0 w-100 d-flex align-items-start justify-content-between">
                    <Row md={10}>
                        <span>
                            <h2>Formas de Pago</h2>{' '}
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
                    <Row md={10}>
                        <span>
                            <h2>Tickets de pago</h2>{' '}
                        </span>
                        <div>
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
                        </div>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default FormasPago
