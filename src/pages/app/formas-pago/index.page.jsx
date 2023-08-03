export { Page }

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

import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const Page = (props) => {
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
                                    value=""
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
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>
                                                Orden de Servicios
                                            </TableCell>
                                            <TableCell>Vigencia</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>
                                                Pagar en linea
                                            </TableCell>
                                            <TableCell>Descargar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>DATA...</TableCell>
                                            <TableCell>DATA...</TableCell>
                                            <TableCell>DATA...</TableCell>
                                            <TableCell>DATA...</TableCell>
                                            <TableCell>DATA...</TableCell>
                                            <TableCell>DATA...</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
