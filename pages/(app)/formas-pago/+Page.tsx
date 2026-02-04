/**
 * Formas de Pago (Payment Methods) Page
 *
 * Converted to TypeScript.
 */
import { useState } from 'react'
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// MUI
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
// Payment method options
const paymentMethods = [
    { value: 'Tarjetas', label: 'Tarjeta Débito o Crédito' },
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Baloto', label: 'Vía Baloto' },
    { value: 'Efecty', label: 'Efecty' },
]
// Table columns
const ticketColumns = ['Fecha', 'Orden de Servicios', 'Vigencia', 'Estado', 'Pagar en línea', 'Descargar']
export default function Page() {
    const [selectedMethod, setSelectedMethod] = useState('')
    const handleChange = (event: SelectChangeEvent) => {
        setSelectedMethod(event.target.value)
    }
    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100">
                <Col className="col-10 d-flex align-items-start justify-content-between">
                    <Row className="p-4" md={10}>
                        <h1 className="type-hero-title">Formas de Pago</h1>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="addMetodoPago">Adicionar método</InputLabel>
                            <Select
                                name="addMetodoPago"
                                id="addMetodoPago"
                                autoWidth
                                label="Formas de Pago"
                                value={selectedMethod}
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {paymentMethods.map((method) => (
                                    <MenuItem key={method.value} value={method.value}>
                                        {method.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Row>
                    <Row className="p-4" md={10}>
                        <h2 className="headline-xl">Tickets de pago</h2>
                        <Col className="col-10 p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {ticketColumns.map((col) => (
                                            <TableCell key={col}>{col}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        {ticketColumns.map((col) => (
                                            <TableCell key={col}>DATA...</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
