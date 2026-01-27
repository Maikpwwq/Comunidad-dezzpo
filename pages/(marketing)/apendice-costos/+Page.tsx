/**
 * Apéndice Costos Page
 *
 * Converted to TypeScript.
 * Displays cost reference table for common services.
 */

export const documentProps = {
    title: 'Apéndice de Costos | Comunidad Dezzpo',
    description: 'Referencia de precios y costos estimados para servicios de mantenimiento y construcción.',
}

import { useState, useEffect } from 'react'

// Styles
import '@assets/css/apendice_costos.css'

// Components
import { Link } from '@hooks'
import TableCards from '@pages/apendice-costos/tabla/tabla'

// Local data
import ApendiceJson from '@pages/apendice-costos/apendice-costos.json'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

// MUI
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

// Types
interface CategoriaItem {
    subSistema?: string
    subCategoria?: string
    subCategoriaCantidad?: string
    subCategoriaDescription?: string
    subCategoriaPrecio?: number
}

// FAQ Links
const faqLinks = [
    '¿Cuánto cuesta instalar nuevas tomacorrientes?',
    '¿Cuánto cuesta instalar una ducha eléctrica?',
    '¿Cuánto cuesta diagnosticar un fallo eléctrico?',
    '¿Cuánto cuesta remodelar una habitación?',
    '¿Cuánto cuesta instalar nuevas iluminaciones y lámparas?',
]

export default function Page() {
    const [categoriaInfo, setCategoriaInfo] = useState<CategoriaItem[]>([])

    useEffect(() => {
        // Load from local JSON
        if (ApendiceJson) {
            setCategoriaInfo(ApendiceJson as CategoriaItem[])
        }
    }, [])

    const formatCurrency = (value: number) => {
        return parseInt(String(value)).toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
        })
    }

    return (
        <>
            <Container fluid className="p-0">
                <Row className="apendiceCostosTitulo m-0 w-100 d-flex justify-content-end">
                    <Col lg={4} md={6} sm={10} xs={12}>
                        <h3 className="titulo headline-xl">
                            Costeo de Servicios
                            <br />
                            Comunes
                        </h3>
                    </Col>
                </Row>
            </Container>

            <Container fluid className="p-0">
                <Row className="m-0 w-100 d-flex ps-4 pe-4">
                    <TableCards dataTable={categoriaInfo} />
                    <Table
                        sx={{
                            display: { sm: 'grid', xs: 'grid' },
                            overflowX: 'scroll',
                        }}
                    >
                        <TableHead>
                            <TableRow className="w-100" sx={{ display: 'table' }}>
                                <TableCell>Subcategoría</TableCell>
                                <TableCell>Unidad Medida</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Precio unitario bajo</TableCell>
                                <TableCell>Precio unitario alto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categoriaInfo.map((categoria, index) => {
                                if (categoria.subCategoria === undefined) {
                                    return (
                                        <TableRow key={categoria.subSistema || index}>
                                            <TableCell className="center headline-l w-100">
                                                {categoria.subSistema}
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                const precioBajo = (categoria.subCategoriaPrecio || 0) * 1.05
                                const precioAlto = (categoria.subCategoriaPrecio || 0) * 1.65

                                return (
                                    <TableRow key={categoria.subCategoria}>
                                        <TableCell>{categoria.subCategoria}</TableCell>
                                        <TableCell>{categoria.subCategoriaCantidad}</TableCell>
                                        <TableCell>{categoria.subCategoriaDescription}</TableCell>
                                        <TableCell>{formatCurrency(precioBajo)}</TableCell>
                                        <TableCell>{formatCurrency(precioAlto)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Row>
            </Container>

            <Container fluid className="p-0">
                <Row className="apendiceCostosPreguntas m-0 w-100">
                    <Col>
                        <ul className="body-2">
                            {faqLinks.map((question) => (
                                <li key={question}>
                                    <Link href="/apendice-costos">{question}</Link>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
