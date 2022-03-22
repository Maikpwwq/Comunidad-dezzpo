// Pagina de Usuario - FormasPago
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const FormasPago = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100">
                    <Col className="col-10 d-flex align-items-start justify-content-between">
                        <Row className="p-4" md={10}>
                            <h2 className="headline-xl">Formas de Pago</h2>{' '}
                            <FormControl fullWidth>
                                <InputLabel forHtml="addMetodoPago">
                                    Adicionar metodo
                                </InputLabel>
                                <Select
                                    name="addMetodoPago"
                                    id="addMetodoPago"
                                    autoWidth
                                    label="Formas de Pago"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Tarjetas">
                                        Tarjeta Debito o Credito
                                    </MenuItem>
                                    <MenuItem value="Efectivo">
                                        Efectivo
                                    </MenuItem>
                                    <MenuItem value="Baloto">
                                        Vía Baloto
                                    </MenuItem>
                                    <MenuItem value="Efecty">Efecty</MenuItem>
                                </Select>
                            </FormControl>
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
